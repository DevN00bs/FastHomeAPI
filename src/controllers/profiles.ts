import pool from "../conf/db";
import { ControllerResponse } from "../entities/controller";
import { UserDetails } from "../entities/profiles";

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
    console.dir(result)
    return { isSuccessful: true, result: result[0] };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}
