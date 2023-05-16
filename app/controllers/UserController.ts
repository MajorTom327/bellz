import type { Profile } from "@prisma/client";
import crypto from "node:crypto";
import { prisma } from "~/services.server/db";

export class UserController {
  hashPassword(password: string) {
    const hash = crypto.createHash("sha256");

    hash.update(password);
    const hashedPassword = hash.digest("hex");
    return hashedPassword;
  }

  createUser({ email, password }: Record<"email" | "password", string>) {
    return prisma.user.create({
      data: {
        email,
        password: this.hashPassword(password),
      },
    });
  }

  getUserByEmailAndPassword({
    email,
    password,
  }: Record<"email" | "password", string>) {
    return prisma.user.findFirstOrThrow({
      where: {
        email,
        password: this.hashPassword(password),
      },
      include: {
        profile: true,
      },
    });
  }

  getUserById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    });
  }

  setProfile(userId: string, profile: Omit<Profile | "id", "userId">) {
    console.log("setProfile", { userId, profile });

    return prisma.profile.upsert({
      where: {
        userId,
      },
      update: {
        ...profile,
        userId,
      },
      create: {
        ...profile,
        userId,
      },
    });
  }
}

export default UserController;
