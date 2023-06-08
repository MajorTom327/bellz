import type { Transporter } from "nodemailer";
import nodeMailer from "nodemailer";
import zod from "zod";
import type { EmailOptions } from "~/emails";
import emails from "~/emails";

type SendMailOptions = {
  from?: string;
  to: string;
  cc?: string[];
  bcc?: string[];
} & EmailOptions;

export class Mailer {
  transport: Transporter;

  constructor() {
    const { MAILER_HOST, MAILER_PORT, MAILER_USER, MAILER_PASS } = zod
      .object({
        MAILER_HOST: zod.string().min(1),
        MAILER_PORT: zod.string(),
        MAILER_USER: zod.string(),
        MAILER_PASS: zod.string(),
      })
      .parse(process.env);

    this.transport = nodeMailer.createTransport({
      // @ts-expect-error
      host: MAILER_HOST,
      port: MAILER_PORT,
      secure: false,
      auth: {
        user: MAILER_USER,
        pass: MAILER_PASS,
      },
    });
  }

  sendMail(options: SendMailOptions) {
    const { from, to, cc, bcc, params, emailId } = options;

    const email = new emails[emailId]();

    const renderedEmail = email.render(params);

    return this.transport.sendMail({
      from: from || process.env.MAILER_FROM,
      to,
      cc,
      bcc,
      subject: renderedEmail.subject,
      text: renderedEmail.text,
      html: renderedEmail.html,
    });
  }
}

export default Mailer;
