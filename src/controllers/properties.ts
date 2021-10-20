import { BasicPropertyData } from "../db/entities";
import pool from "../db/pool";

export async function getProperties() {
  let conn;

  try {
    conn = await pool.getConnection();
    const result: BasicPropertyData[] = await conn.query(
      "SELECT * FROM BasicPropertyData"
    );
    return { success: true, result };
  } catch (e) {
    console.error("Something went wrong", e);
    return { success: false };
  } finally {
    conn?.release();
  }
}
