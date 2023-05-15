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
    });
  }
}

export default UserController;
