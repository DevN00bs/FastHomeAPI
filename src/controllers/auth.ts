import {
  RegistrationData,
  LoginData,
  LoginResult,
  PasswordRestoreData,
} from "../entities/auth";
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
    return { isSuccessful: result.affectedRows === 2 };
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
    if (error instanceof TypeError) {
      return { isSuccessful: true, result: false };
    }

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
      return { isSuccessful: true, result: { passwordsMatch: false } };
    }

    return {
      isSuccessful: true,
      result: {
        passwordsMatch: true,
        token:
          "Bearer " +
          jwt.sign({ userId: userData[0].userId }, process.env.SECRET!),
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
      template: "verify",
      context: {
        username,
        link: await createURL("verify", userData[0].userId),
      },
      attachments: [
        {
          filename: "logo.png",
          path: path.resolve(__dirname, "..", "..", "assets", "logo.png"),
          cid: "logo@fasthome",
        },
      ],
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
  token: string
): Promise<ControllerResponse<boolean>> {
  let conn, payload, id;

  try {
    payload = jwt.verify(token, process.env.SECRET!) as jwt.JwtPayload;
    if (payload?.purpose !== "verify") {
      return { isSuccessful: true, result: false };
    }

    conn = await pool.getConnection();
    const dbToken = await conn.query(
      "SELECT token FROM Users WHERE userId = ?",
      payload.userId
    );
    if (token.substring(token.length - 20) !== dbToken[0].token) {
      return { isSuccessful: true, result: false };
    }

    const query = await conn.query(
      "UPDATE Users SET emailVerified = 1 WHERE userId = ?",
      payload.userId
    );
    return { isSuccessful: true, result: query.affectedRows === 1 };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      id = (jwt.decode(token) as jwt.JwtPayload).userId;
      return { isSuccessful: true, result: false };
    }

    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
    invalidateToken(!payload ? id : payload.userId);
  }
}

export async function sendPasswordEmail(
  email: string
): Promise<ControllerResponse<boolean>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const userData = await conn.query(
      "SELECT userId, username FROM Users WHERE email = ?",
      [email]
    );

    if (userData.length <= 0) {
      return { isSuccessful: true, result: false };
    }

    const mail = await mailer.sendMail({
      from: '"FastHome" <' + process.env.MAIL_USER + ">",
      to: email,
      subject: "Password restoration",
      template: "password",
      context: {
        username: userData[0].username,
        link: await createURL("forgot", userData[0].userId),
      },
      attachments: [
        {
          filename: "logo.png",
          path: path.resolve(__dirname, "..", "..", "assets", "logo.png"),
          cid: "logo@fasthome",
        },
      ],
    });
    return { isSuccessful: mail.accepted[0] === email, result: true };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

async function invalidateToken(userId: number) {
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE Users SET token = NULL WHERE userId = ?", userId);
  } catch (error) {
    console.error("Something went wrong", error);
  } finally {
    conn?.release();
  }
}

async function createURL(purpose: string, userId: number): Promise<string> {
  const token = jwt.sign({ userId, purpose }, process.env.SECRET!, {
    expiresIn: "11m",
  });

  const conn = await pool.getConnection();
  conn.query("UPDATE Users SET token = ? WHERE userId = ?", [
    token.substring(token.length - 20),
    userId,
  ]);
  conn.release();

  return `${process.env.FRONT}/${purpose}/${token}`;
}

export async function restorePassword(
  data: PasswordRestoreData
): Promise<ControllerResponse<boolean>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const payload = jwt.verify(
      data.token,
      process.env.SECRET!
    ) as jwt.JwtPayload;

    if (!payload.purpose || payload.purpose !== "forgot") {
      throw new jwt.JsonWebTokenError("Token not valid");
    }

    const dbToken = await conn.query(
      "SELECT token FROM Users WHERE userId = ?",
      payload.userId
    );
    if (data.token.substring(data.token.length - 20) !== dbToken[0].token) {
      return { isSuccessful: true, result: false };
    }

    const hash = await bcrypt.hash(data.password, 10);
    await conn.query("UPDATE Users SET encPassword = ? WHERE userId = ?", [
      hash,
      payload.userId,
    ]);

    invalidateToken(payload.userId);
    return { isSuccessful: true, result: true };
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return { isSuccessful: true, result: false };
    }

    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}
