import type { Transporter } from "nodemailer";
import nodeMailer from "nodemailer";
import zod from "zod";

type SendMailOptions = {
  from: string;
  to: string;
  subject: string;
  cc?: string[];
  bcc?: string[];
  text?: string;
  html?: string;
};

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
    console.log("Sending mail...");

    return this.transport.sendMail({
      from: options.from,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }
}

export default Mailer;
