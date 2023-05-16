import CurrencyEnum from "~/refs/CurrencyEnum";
import type OccurenceEnum from "~/refs/OccurenceEnum";
import { prisma } from "~/services.server/db";

export class SubscriptionController {
  getSubscriptionsForUser(userId: string) {
    return prisma.subscription.findMany({
      where: {
        userId,
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
      currency,
      nextExecution,
    }: {
      name: string;
      amount: number;
      occurence: OccurenceEnum;
      currency: CurrencyEnum;
      nextExecution: Date;
    }
  ) {
    return prisma.subscription.create({
      data: {
        name,
        amount,
        occurence,
        nextExecution,
        currency,
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
}

export default SubscriptionController;
