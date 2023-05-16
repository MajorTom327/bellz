import type OccurenceEnum from "~/refs/OccurenceEnum";
import { prisma } from "~/services.server/db";

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
}

export default SubscriptionController;
