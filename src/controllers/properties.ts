import {
  BasicPropertyData,
  BEDROOM_FILTERS,
  PartialPropertyRequest,
  PropertyData,
  PropertyRequest,
  SortOrder,
  sortOrder,
  ModificationData,
} from "../entities/properties";
import { ControllerResponse } from "../entities/controller";
import pool from "../conf/db";
import { PoolConnection } from "mariadb";
import { createInsertQuery, createUpdateQuery } from "./db";

export async function getPropertiesList(
  order: SortOrder,
  filter: number
): Promise<ControllerResponse<BasicPropertyData[]>> {
  let conn;
  try {
    conn = await pool.getConnection();

    const result: BasicPropertyData[] = await conn.query(
      `SELECT * FROM BasicPropertyData WHERE ${
        BEDROOM_FILTERS[filter]
      } ORDER BY ${conn.escapeId(sortOrder[order])}`
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

export async function postProperty(
  data: PropertyRequest,
  id: number
): Promise<ControllerResponse<number>> {
  let conn;
  const merged = { ...data, vendorUserId: id };

  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      createInsertQuery("Properties", merged),
      Object.values(merged)
    );
    return { isSuccessful: result.affectedRows === 1, result: result.insertId };
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function updateProperty(
  data: PartialPropertyRequest,
  id: number,
  userId: number
): Promise<ControllerResponse<ModificationData>> {
  let conn;

  try {
    conn = await pool.getConnection();

    const ownerData = await conn.query(
      "SELECT vendorUserId FROM Properties WHERE propertyId = ?",
      id
    );
    if (userId !== ownerData[0].vendorUserId) {
      return {
        isSuccessful: true,
        result: { canModify: false, modified: false },
      };
    }

    const result = await conn.query(
      `${createUpdateQuery("Properties", data)} WHERE propertyId = ?`,
      [...Object.values(data), id]
    );
    return {
      isSuccessful: true,
      result: { canModify: true, modified: result.affectedRows === 1 },
    };
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function delProperty(
  id: number,
  userId: number
): Promise<ControllerResponse<ModificationData>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const ownerData = await conn.query(
      "SELECT vendorUserId FROM Properties WHERE propertyId = ?",
      id
    );
    if (userId !== ownerData[0].vendorUserId) {
      return {
        isSuccessful: true,
        result: { canModify: false, modified: false },
      };
    }

    const result = await conn.query(
      "DELETE FROM Properties WHERE propertyId = ?",
      id
    );
    return {
      isSuccessful: true,
      result: { canModify: true, modified: result.affectedRows === 1 },
    };
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}

export async function savePhotos(
  files: {
    main: Express.Multer.File[];
    photos?: Express.Multer.File[];
  },
  id: number
): Promise<ControllerResponse<boolean>> {
  let conn: PoolConnection | undefined;

  if (!files.main) {
    return { isSuccessful: true, result: false };
  }

  try {
    conn = await pool.getConnection();

    await conn.query(
      "INSERT INTO Photos (photoURL, isMainPhoto, propertyId) VALUES (?, 1, ?)",
      [files.main[0].filename, id]
    );
    files.photos?.forEach(async (file) => {
      await conn!.query(
        "INSERT INTO Photos (photoURL, propertyId) VALUES (?, ?)",
        [file.filename, id]
      );
    });
    return { isSuccessful: true, result: true };
  } catch (error) {
    console.error("Something went wrong", error);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
}
