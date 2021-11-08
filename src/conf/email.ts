import nodemailer from "nodemailer";

const mailer = nodemailer.createTransport({
  host: process.env.MAIL_HOST!,
  port: parseInt(process.env.MAIL_PORT!),
  secure: process.env.MAIL_PORT! === "486",
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default mailer;
