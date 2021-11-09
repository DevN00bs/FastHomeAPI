import { RegistrationData, LoginData, LoginResult } from "../entities/auth";
import { ControllerResponse } from "../entities/controller";
import pool from "../conf/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailer from "../conf/email";
import crypto from "crypto";
import path from "path";

export async function createUser(
  data: RegistrationData
): Promise<ControllerResponse<void>> {
  let conn;

  const encPassword = await bcrypt.hash(data.password, 10);

  try {
    conn = await pool.getConnection();
    const result = await conn.query("CALL CreateUser(?, ?, ?)", [
      data.username,
      data.email,
      encPassword,
    ]);
    return { isSuccessful: result.affectedRows === 1 };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function checkIfUserExists(
  username: string
): Promise<ControllerResponse<boolean>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const userData = await conn.query(
      "SELECT emailVerified FROM Users WHERE username = ?",
      [username]
    );
    return { isSuccessful: true, result: Boolean(userData[0].emailVerified) };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function loginUser(
  data: LoginData
): Promise<ControllerResponse<LoginResult>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const userData = await conn.query(
      "SELECT userId, encPassword FROM Users WHERE username = ?",
      [data.username]
    );

    if (!(await bcrypt.compare(data.password, userData[0].encPassword))) {
      return { isSuccessful: false, result: { passwordsMatch: false } };
    }

    return {
      isSuccessful: true,
      result: {
        passwordsMatch: true,
        token: jwt.sign(userData[0].userId, process.env.SECRET!),
      },
    };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function sendVerifyMail(
  username: string
): Promise<ControllerResponse<void>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const userData = await conn.query(
      "SELECT userId, email FROM Users WHERE username = ?",
      [username]
    );

    await mailer.sendMail({
      from: '"FastHome" <' + process.env.MAIL_USER + ">",
      to: userData[0].email,
      subject: "Verify your email address",
      text:
        username +
        ", welcome to FastHome!\nVerify your account with this link:\nhttp://localhost:5000/verify/" +
        userData[0].userId +
        crypto.createHash("md5").update(userData[0].email).digest("hex"),
    });

    return { isSuccessful: true };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function verifyMail(
  id: string
): Promise<ControllerResponse<boolean>> {
  let conn;

  if (id.length < 33) {
    return { isSuccessful: true, result: false };
  }

  const parsedId = parseInt(id.substr(0, id.length - 32));

  try {
    conn = await pool.getConnection();
    const query = await conn.query(
      "UPDATE Users SET emailVerified = 1 WHERE userId = ?",
      [parsedId]
    );
    return { isSuccessful: true, result: query.affectedRows === 1 };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function sendPasswordEmail(
  email: string
): Promise<ControllerResponse<boolean>> {
  let conn;
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 10);

  try {
    conn = await pool.getConnection();
    const userData = await conn.query(
      "SELECT userId, username FROM Users WHERE email = ?",
      [email]
    );

    const mail = await mailer.sendMail({
      from: '"FastHome" <' + process.env.MAIL_USER + ">",
      to: email,
      subject: "Password restoration",
      template: "password",
      context: {
        username: userData[0].username,
        link: process.env.FRONT + "/forgot/" + userData[0].userId,
      },
      attachments: [
        {
          filename: "logo.png",
          path: path.resolve(__dirname, "..", "..", "assets", "logo.png"),
          cid: "logo@fasthome",
        },
      ],
    });
    return { isSuccessful: true, result: mail.accepted[0] === email };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}
