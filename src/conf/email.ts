import nodemailer from "nodemailer";
import hbs, { HbsTransporter } from "nodemailer-express-handlebars";
import path from "path";

const mailer: HbsTransporter = nodemailer
  .createTransport({
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
  })
  .use(
    "compile",
    hbs({
      viewEngine: {
        defaultLayout: "password.handlebars",
        layoutsDir: path.join(__dirname, "..", "views"),
      },
      viewPath: path.join(__dirname, "..", "views"),
    })
  );

export default mailer;
