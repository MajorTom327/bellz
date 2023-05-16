import type { User } from "@prisma/client";
import { isNil } from "ramda";
import type { loader } from "~/root";

import type { UserSession } from "~/models/User";

import { useMatchesData } from "./useMatchesData";

export function useOptionalUser(): UserSession | undefined {
  const data = useMatchesData<typeof loader>("root");
  if (!data || isNil(data.user)) {
    return undefined;
  }
  return data.user;
}
