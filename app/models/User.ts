import type { User } from "@prisma/client";

export type UserSession = Omit<User, "password">;
