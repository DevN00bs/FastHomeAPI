import pool from "../conf/db";
import { ControllerResponse } from "../entities/controller";

export async function getCatalogsData(): Promise<ControllerResponse<object>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const currencies = await conn.query("SELECT * FROM AvailableCurrencies");
    const contracts = await conn.query("SELECT * FROM AvailableContracts");

    return {
      isSuccessful: true,
      result: {
        currencies: [
          "---",
          ...currencies.map((currency: any) => currency.currencies),
        ],
        contracts: [
          "---",
          ...contracts.map((contract: any) => contract.contractName),
        ],
      },
    };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}
