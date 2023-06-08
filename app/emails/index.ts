import type { InvitationEmailParams } from "./invitation";
import InvitationEmail from "./invitation";

export { InvitationEmail } from "./invitation";
export type { InvitationEmailParams } from "./invitation";

const emails = {
  invitation: InvitationEmail,
};

export type EmailId = keyof typeof emails;

export type EmailOptions = {
  emailId: "invitation";
  params: InvitationEmailParams;
};

export default emails;
