import type { Loan } from "@prisma/client";
import zod from "zod";
import CurrencyEnum from "~/refs/CurrencyEnum";
import { prisma } from "~/services.server/db";

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
