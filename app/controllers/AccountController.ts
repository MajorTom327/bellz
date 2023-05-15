import type { Account } from "@prisma/client";
import { prisma } from "~/services.server/db";

import type Transaction from "~/models/Transaction";

export class AccountController {
  getAccountsForUser(userId: string): Promise<Account[]> {
    return prisma.account.findMany({
      where: {
        ownerId: userId,
      },
    });
  }

  getTransactionsForAccount(accountId: string): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: {
        accountId,
      },
    });
  }

  addTransactionToAccount(
    accountId: string,
    transaction: Transaction
  ): Promise<Transaction> {
    return prisma.transaction.create({
      data: {
        accountId,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
      },
    });
  }
}
