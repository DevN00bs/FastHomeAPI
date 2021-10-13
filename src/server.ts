import pool from "./db/pool";

/**
 * Temporal function to verify database connectivity
 */

async function testDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM Properties");
    return rows
  } catch (e) {
    return { message: "Database connection failed ", err: e }
  }
}

testDatabase().then((res) => {
  console.dir(res.meta ? "Success!" : res)
})
