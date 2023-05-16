import { unauthorized } from "remix-utils";

import getUserFromRequest from "../getUserFromRequest";

export const ensureUser = async (req: Request) => {
  const request = req.clone();

  const user = await getUserFromRequest(request);

  if (!user) throw unauthorized({ message: "Unauthorized" });
  return user;
};

export default ensureUser;
