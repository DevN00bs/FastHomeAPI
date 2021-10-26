import { ControllerResponse, RegistrationData } from "../db/entities";
import pool from "../db/pool";
import bcrypt from "bcrypt";

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
