import { verifyAuthenticityToken } from "remix-utils";
import { sessionStorage } from "~/services.server/session";

export const ensureCsrf = async (request: Request) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  await verifyAuthenticityToken(request, session);
};

export default ensureCsrf;
