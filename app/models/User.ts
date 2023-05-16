import type { Profile, User } from "@prisma/client";

export type UserSession = Omit<User, "password"> & { profile?: Profile };
