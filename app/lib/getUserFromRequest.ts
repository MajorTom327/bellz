import { getSession } from "~/services.server/session";

import type { UserSession } from "~/models/User";

export const getUserFromRequest = async (req: Request) => {
  const request = req.clone();

  const session = await getSession(request.headers.get("Cookie"));
  const user: UserSession | undefined = session?.get("user");

  return user;
};

export default getUserFromRequest;
