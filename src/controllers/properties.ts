import {
  BasicPropertyData,
  PropertyData,
  PropertyRequest,
} from "../entities/properties";
import { ControllerResponse } from "../entities/controller";
import pool from "../conf/db";

export async function getPropertiesList(): Promise<
  ControllerResponse<BasicPropertyData[]>
> {
  let conn;
  try {
    conn = await pool.getConnection();
    const result: BasicPropertyData[] = await conn.query(
      "SELECT * FROM BasicPropertyData"
    );
    return { isSuccessful: true, result };
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function getPropertyById(
  id: number
): Promise<ControllerResponse<PropertyData[]>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const result: PropertyData[] = await conn.query(
      "SELECT * FROM PropertyData WHERE propertyId = ?",
      [id]
    );
    return { isSuccessful: true, result };
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function postProperty(data: PropertyRequest) {
  let conn;

  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO Properties(address,description,price,latitude,longitude,terrainHeight,terrainWidth,bedroomAmount,bathroomAmount,floorAmount,garageSize,vendorUserId,buyerUserId,contractType,currencyId) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.address,
        data.description,
        data.price,
        data.latitude,
        data.longitude,
        data.terrainHeight,
        data.terrainWidth,
        data.bedroomAmount,
        data.bathroomAmount,
        data.floorAmount,
        data.garageSize,
        data.contractType,
        data.currencyId,
      ]
    );
    return { isSuccessful: result.affectedRows === 1 };
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function updateProperty(data: PropertyRequest, id: number) {
  let conn;

  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `UPDATE Properties SET address= ?,description= ?,price= ?, latitude= ?,longitude= ?,terrainHeight= ?,terrainWidth= ?,bedroomAmount= ?,bathroomAmount= ?, floorAmount= ?,garageSize= ? WHERE propertyId= ?`,
      [
        data.address,
        data.description,
        data.price,
        data.latitude,
        data.longitude,
        data.terrainHeight,
        data.terrainWidth,
        data.bedroomAmount,
        data.bathroomAmount,
        data.floorAmount,
        data.garageSize,
        id
      ]
    );
    return { isSuccessful: true, result };
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function delProperty(id: number) {
  let conn;

  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `DELETE FROM Properties WHERE propertyId= ?`,
      [id]
    );
    return { isSuccessful: true, result };
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}
