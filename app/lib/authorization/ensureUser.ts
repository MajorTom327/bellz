import { redirect } from "@remix-run/node";

import getUserFromRequest from "../getUserFromRequest";

export const ensureUser = async (req: Request) => {
  const request = req.clone();

  const user = await getUserFromRequest(request);

  if (!user) throw redirect("/login");
  return user;
};

export default ensureUser;
