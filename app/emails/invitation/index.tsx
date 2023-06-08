import zod from "zod";

import { EmailRenderer } from "../EmailRenderer";
import { InvitationHtml } from "./InvitationHtml";
import { InvitationText } from "./InvitationText";

export type InvitationEmailParams = {
  acceptLink: string;
};

export class InvitationEmail extends EmailRenderer<InvitationEmailParams> {
  subject = "You've been invited to join a team";
  text = InvitationText;
  html = InvitationHtml;

  private schema = zod.object({
    acceptLink: zod.string().url(),
  });

  protected verifyParams(
    params: InvitationEmailParams | null
  ): InvitationEmailParams | null {
    return this.schema.parse(params);
  }
}

export default InvitationEmail;
