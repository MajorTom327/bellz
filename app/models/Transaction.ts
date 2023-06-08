import { identity, isNotNil, omit } from "ramda";
import { P, match } from "ts-pattern";
import zod from "zod";

export const TransactionSchema = zod
  .object({
    id: zod.string().optional(),
    accountId: zod.string().min(1),

    amount: zod.coerce.number().transform((val) => val * 100),
    description: zod.string(),
    isExpense: zod.coerce.boolean(),
    loanId: zod.string().nullable(),
    date: zod.coerce.date(),
  })
  .transform((val) => {
    const isExpense = match(val)
      .with({ loanId: P.when(isNotNil) }, () => true)
      .with({ isExpense: P.select() }, identity)
      .otherwise(() => false);

    return {
      ...omit(["isExpense"], val),
      amount: isExpense ? -val.amount : val.amount,
    };
  });

export type Transaction = zod.infer<typeof TransactionSchema>;

export default Transaction;
