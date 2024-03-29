import type {
  Account,
  Prisma,
  PrismaClient,
  Transaction,
} from "@prisma/client";
import Bluebird from "bluebird";
import { isNotNil } from "ramda";
import type AccountType from "~/refs/AccountType";
import type CurrencyEnum from "~/refs/CurrencyEnum";
import { prisma } from "~/services.server/db";

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
    currency: CurrencyEnum;
  }) {
    return prisma.account.create({
      data: {
        name: data.label,
        balance: data.balance,
        type: data.type,
        currency: data.currency,
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
    transaction: Omit<
      Transaction,
      "id" | "accountId" | "createdAt" | "updatedAt"
    >
  ): Promise<Transaction> {
    return prisma.$transaction(async (tx) => {
      const tr = await tx.transaction.create({
        data: {
          accountId,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
          loanId: transaction.loanId,
        },
      });

      if (isNotNil(transaction.loanId)) {
        // * If this is a loan, we need to update the loan balance
        await tx.loan.update({
          where: {
            id: transaction.loanId,
          },
          data: {
            refunded: {
              increment: Math.abs(transaction.amount),
            },
          },
        });
      }

      // * Get the new balance for the account
      await this.updateAccountBalance(accountId, tx);

      return tr;
    });
  }

  async updateAccountBalance(
    accountId: string,
    tx: Omit<
      PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
    >
  ) {
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
  }

  removeAccountFromAllTeams(accountId: string) {
    return prisma.$transaction(async (tx) => {
      const teams = await tx.team.findMany({
        where: {
          accounts: {
            some: {
              id: accountId,
            },
          },
        },
      });

      return Bluebird.mapSeries(teams, async (team) => {
        await tx.team.update({
          where: {
            id: team.id,
          },
          data: {
            accounts: {
              disconnect: {
                id: accountId,
              },
            },
          },
        });
      });
    });
  }
}
