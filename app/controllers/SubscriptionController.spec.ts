import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OccurenceEnum from "~/refs/OccurenceEnum";
import prisma from "~/services.server/__mocks__/db";

import { SubscriptionController } from "./SubscriptionController";

vi.mock("~/services.server/db");

describe("SubscriptionController", () => {
  describe("toggleSubscription", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("Should enable subscription if it is disabled", async () => {
      const subscription = {
        id: "1",
        active: false,
        name: "Subscription",
        amount: 100,
        occurence: OccurenceEnum.MONTHLY,
        nextExecution: new Date(),

        lastExecution: new Date(),

        userId: "1",
        accountId: "1",

        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.subscription.findUnique.mockResolvedValue(subscription);

      prisma.subscription.update.mockResolvedValue(subscription);

      prisma.$transaction.mockImplementation((callback) => callback(prisma));

      const subscriptionController = new SubscriptionController();

      const result = await subscriptionController.toggleSubscription("1");

      expect(result).toEqual(subscription);

      expect(prisma.subscription.findUnique).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
      });

      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        data: {
          active: true,
        },
      });
    });

    it("Should disable subscription if it is enabled", async () => {
      const subscription = {
        id: "1",
        active: true,
        name: "Subscription",
        amount: 100,
        occurence: OccurenceEnum.MONTHLY,
        nextExecution: new Date(),

        lastExecution: new Date(),

        userId: "1",
        accountId: "1",

        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.subscription.findUnique.mockResolvedValue(subscription);

      prisma.subscription.update.mockResolvedValue(subscription);

      prisma.$transaction.mockImplementation((callback) => callback(prisma));

      const subscriptionController = new SubscriptionController();

      const result = await subscriptionController.toggleSubscription("1");

      expect(result).toEqual(subscription);

      expect(prisma.subscription.findUnique).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
      });

      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        data: {
          active: false,
        },
      });
    });

    it("Should throw an error if the subscription is not found", async () => {
      prisma.subscription.findUnique.mockResolvedValue(null);

      prisma.$transaction.mockImplementation((callback) => callback(prisma));

      const subscriptionController = new SubscriptionController();

      await expect(
        subscriptionController.toggleSubscription("1")
      ).rejects.toThrow("Subscription not found");
    });
  });

  describe("applyStaledSubscriptions", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("Should return 0 updatedSubscriptions if none are found", async () => {
      prisma.subscription.findMany.mockResolvedValue([]);

      prisma.$transaction.mockImplementation((callback) => callback(prisma));

      const subscriptionController = new SubscriptionController();
      const result = await subscriptionController.applyStaledSubscriptions();

      expect(result).toEqual({
        updatedSubscriptions: 0,
      });
    });

    it("Should insert a new transaction for each subscription and update the subscription", async () => {
      const subscription = {
        id: "sub-1",
        active: false,
        name: faker.finance.transactionDescription(),
        amount: faker.number.int({ min: 100, max: 1000 }),
        occurence: OccurenceEnum.MONTHLY,

        nextExecution: faker.date.recent(),
        lastExecution: faker.date.recent(),

        userId: "usr-1",
        accountId: "acc-1",

        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.subscription.findMany.mockResolvedValue([subscription]);

      prisma.transaction.create.mockResolvedValue({
        id: "trans-1",
        amount: subscription.amount,
        accountId: subscription.accountId,
        description: subscription.name,
        date: subscription.nextExecution,

        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // * Update account balance part
      // @ts-expect-error
      prisma.transaction.aggregate.mockResolvedValue({ _sum: { amount: 100 } });
      // @ts-expect-error
      prisma.account.update.mockResolvedValue({});

      prisma.subscription.update.mockResolvedValue(subscription);

      prisma.$transaction.mockImplementation((callback) => callback(prisma));

      const subscriptionController = new SubscriptionController();
      const result = await subscriptionController.applyStaledSubscriptions();

      expect(result).toEqual({
        updatedSubscriptions: 1,
      });

      expect(prisma.subscription.findMany).toHaveBeenCalledWith({
        where: {
          active: true,
          nextExecution: {
            lte: new Date(),
          },
        },
      });

      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          amount: subscription.amount,
          accountId: subscription.accountId,
          description: subscription.name,
          date: new Date(),
        },
      });

      expect(prisma.account.update).toHaveBeenCalledWith({
        where: {
          id: subscription.accountId,
        },
        data: {
          balance: 100,
        },
      });

      expect(prisma.subscription.update).toHaveBeenCalledWith({
        where: {
          id: subscription.id,
        },
        data: {
          lastExecution: new Date(),
          nextExecution: DateTime.local().plus({ months: 1 }).toJSDate(),
        },
      });
    });
  });
});
