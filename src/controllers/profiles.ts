import pool from "../conf/db";
import { ControllerResponse } from "../entities/controller";
import { UserDetails, UserDetailsRequest } from "../entities/profiles";
import { createUpdateQuery } from "./db";

export async function getUserDetails(
  id: number
): Promise<ControllerResponse<UserDetails>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      "SELECT * FROM UserDetails WHERE userId = ?",
      id
    );
    console.dir(result);
    return { isSuccessful: true, result: result[0] };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function updateUserDetails(
  data: UserDetailsRequest,
  id: number
): Promise<ControllerResponse<void>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `${createUpdateQuery("ContactDetails", data)} WHERE userId = ?`,
      [...Object.values(data), id]
    );
    return { isSuccessful: result.affectedRows === 1 };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}
