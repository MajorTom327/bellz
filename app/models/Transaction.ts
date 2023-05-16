import zod from "zod";

export const TransactionSchema = zod.object({
  id: zod.string().optional(),
  accountId: zod.string().min(1),

  amount: zod.coerce.number().transform((val) => val * 100),
  description: zod.string(),
  date: zod.coerce.date(),
});

export type Transaction = zod.infer<typeof TransactionSchema>;

export default Transaction;
