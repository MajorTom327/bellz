import type { Account } from "@prisma/client";
import { pathOr } from "ramda";
import type AccountType from "~/refs/AccountType";
import { prisma } from "~/services.server/db";

import type Transaction from "~/models/Transaction";

export class AccountController {
  deleteAccount(accountId: string, id: string) {
    return prisma.account.deleteMany({
      where: {
        id: accountId,
        owner: {
          id,
        },
      },
    });
  }
  updateAccount(
    accountId: string,
    id: string,
    cleanData: { name: string; accountType: AccountType }
  ) {
    return prisma.account.updateMany({
      where: {
        id: accountId,
        owner: {
          id,
        },
      },
      data: {
        name: cleanData.name,
        type: cleanData.accountType,
      },
    });
  }

  getAccount(accountId: string) {
    return prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });
  }
  createAccount(data: {
    label: string;
    balance: number;
    userId: string;
    type: AccountType;
  }) {
    return prisma.account.create({
      data: {
        name: data.label,
        balance: data.balance,
        type: data.type,
        owner: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  }

  getAccountsForUser(userId: string): Promise<Account[]> {
    return prisma.account.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  getTransactionsForAccount(accountId: string): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: {
        accountId,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  addTransactionToAccount(
    accountId: string,
    transaction: Omit<Transaction, "accountId">
  ): Promise<Transaction> {
    return prisma.$transaction(async (tx) => {
      const tr = await tx.transaction.create({
        data: {
          accountId,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
        },
      });

      // * Get the new balance for the account
      const totalAccountValue = await tx.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          accountId,
        },
      });

      const sumValue = totalAccountValue._sum.amount || 0;
      await tx.account.update({
        where: {
          id: accountId,
        },
        data: {
          balance: sumValue,
        },
      });

      return tr;
    });
  }
}
