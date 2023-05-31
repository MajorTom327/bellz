import type { Loan } from "@prisma/client";
import Bluebird from "bluebird";
import { evolve } from "ramda";
import zod from "zod";
import CurrencyEnum from "~/refs/CurrencyEnum";
import { prisma } from "~/services.server/db";

import FinanceApi from "~/lib/finance";

export class LoanController {
  getLoansForUser(userId: string) {
    return prisma.loan.findMany({
      where: {
        owner: {
          id: userId,
        },
      },
    });
  }

  async getLoansSummaryForUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    return prisma.loan
      .findMany({
        where: {
          owner: {
            id: userId,
          },
        },
      })
      .then((loans) => {
        const currency =
          (user?.profile?.currency as CurrencyEnum) ?? CurrencyEnum.EUR;
        const finance = new FinanceApi();

        return Bluebird.reduce(
          loans,
          async (acc, loan) => {
            const exchangeRate = await finance.getExchangeRate(
              loan.currency as CurrencyEnum,
              currency
            );

            const amount = exchangeRate * loan.amount;
            const refunded = exchangeRate * loan.refunded;

            return evolve({
              amount: (v) => v + amount,
              refunded: (v) => v + refunded,
            })(acc);
          },
          { amount: 0, refunded: 0 }
        ).then((summary) => summary);
      });
  }

  createLoan(userId: string, input: Partial<Loan>) {
    const inputLoan = zod
      .object({
        label: zod.string().min(1).max(255),
        amount: zod
          .number()
          .min(0)
          .transform((v) => Math.round(v * 100)),
        currency: zod.nativeEnum(CurrencyEnum),
      })
      .parse(input);

    return prisma.loan.create({
      data: {
        ...inputLoan,
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}

export default LoanController;
