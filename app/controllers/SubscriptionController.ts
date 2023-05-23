import Bluebird from "bluebird";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import OccurenceEnum from "~/refs/OccurenceEnum";
import { prisma } from "~/services.server/db";

import { AccountController } from "./AccountController";

export class SubscriptionController {
  getSubscriptionsForUser(userId: string) {
    return prisma.subscription.findMany({
      where: {
        userId,
      },
      include: {
        account: {
          select: { currency: true },
        },
      },
    });
  }

  getSubscriptionsForAccount(accountId: string) {
    return prisma.subscription.findMany({
      where: {
        accountId,
      },
    });
  }

  createSubscription(
    accountId: string,
    userId: string,
    {
      name,
      amount,
      occurence,
      nextExecution,
    }: {
      name: string;
      amount: number;
      occurence: OccurenceEnum;
      nextExecution: Date;
    }
  ) {
    return prisma.subscription.create({
      data: {
        name,
        amount,
        occurence,
        nextExecution,
        account: {
          connect: {
            id: accountId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  toggleSubscription(subscriptionId: string) {
    return prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.findUnique({
        where: {
          id: subscriptionId,
        },
      });

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      const updatedSubscription = await tx.subscription.update({
        where: {
          id: subscriptionId,
        },
        data: {
          active: !subscription.active,
        },
      });

      return updatedSubscription;
    });
  }

  applyStaledSubscriptions() {
    const accountController = new AccountController();
    return prisma.$transaction(async (tx) => {
      const staledSubscriptions = await tx.subscription.findMany({
        where: {
          nextExecution: {
            lte: DateTime.local().toJSDate(),
          },
          active: true,
        },
      });

      console.log(`Will update ${staledSubscriptions.length} subscriptions`);

      const subscriptions = await Bluebird.mapSeries(
        staledSubscriptions,
        async (subscription) => {
          await tx.transaction.create({
            data: {
              amount: subscription.amount,
              accountId: subscription.accountId,
              date: new Date(),
              description: subscription.name,
            },
          });

          await accountController.updateAccountBalance(
            subscription.accountId,
            tx
          );

          return tx.subscription.update({
            where: {
              id: subscription.id,
            },
            data: {
              lastExecution: new Date(),
              nextExecution: match(subscription.occurence)
                .with(OccurenceEnum.DAILY, () =>
                  DateTime.local().plus({ days: 1 }).toJSDate()
                )
                .with(OccurenceEnum.WEEKLY, () =>
                  DateTime.local().plus({ weeks: 1 }).toJSDate()
                )
                .with(OccurenceEnum.MONTHLY, () =>
                  DateTime.local().plus({ months: 1 }).toJSDate()
                )
                .otherwise(() => {
                  throw new Error("Invalid occurence");
                }),
            },
          });
        }
      );

      return {
        updatedSubscriptions: subscriptions.length,
      };
    });
  }
}

export default SubscriptionController;
