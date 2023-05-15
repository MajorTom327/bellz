import type Account from "~/models/Account";
import type Transaction from "~/models/Transaction";

export class AccountController {
  getAccountsForUser(userId: string): Promise<Account[]> {
    return Promise.resolve([
      {
        id: "1",
        ownerId: userId,
        name: "Checking",
        balance: 100,
      },
      {
        id: "2",
        ownerId: userId,
        name: "Savings",
        balance: 1000,
      },
    ]);
  }

  getTransactionsForAccount(accountId: string): Promise<Transaction[]> {
    return Promise.resolve([
      {
        id: "1",
        accountId,
        amount: 10000,
        description: "Paycheck",
        date: new Date(),
      },
      {
        id: "2",
        accountId,
        amount: -5000,
        description: "Groceries",
        date: new Date(),
      },
    ]);
  }

  addTransactionToAccount(
    accountId: string,
    transaction: Transaction
  ): Promise<Transaction> {
    return Promise.resolve(transaction);
  }
}
