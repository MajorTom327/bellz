import zod from "zod";

export const AccountSchema = zod.object({
  id: zod.string(),
  ownerId: zod.string().min(1),

  name: zod.string().min(1),
  balance: zod.number(),
});

export type Account = zod.infer<typeof AccountSchema>;

export default Account;
