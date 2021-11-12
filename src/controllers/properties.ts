import { BasicPropertyData, PropertyData, PropertyRequest } from "../entities/properties";
import { ControllerResponse } from "../entities/controller";
import pool from "../conf/db";

export async function getPropertiesList(): Promise<ControllerResponse<BasicPropertyData[]>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const result: BasicPropertyData[] = await conn.query(
      "SELECT * FROM BasicPropertyData"
    );
    return { isSuccessful: true, result} ;
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
};

export async function getPropertyById(id: number): Promise<ControllerResponse<PropertyData[]>> {
  let conn;

  try {
    conn = await pool.getConnection();
    const result: PropertyData[] = await conn.query(
      "SELECT * FROM PropertyData WHERE propertyId = ?",
      [id]
    );
    return { isSuccessful: true, result } ;
  } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
};

export async function postProperty(data: PropertyRequest) {
  let conn;
  
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO Properties(address,description,price,latitude,longitude,terrainHeight,terrainWidth,bedroomAmount,bathroomAmount,floorAmount,garageSize,vendorUserId,buyerUserId,contractType,currencyId) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`,[
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
        data.currencyId
      ]
      );
    return { isSuccessful: result.affectedRows === 1 };
    } catch (e) {
    console.error("Something went wrong", e);
    return { isSuccessful: false };
  } finally {
    conn?.release();
  }
};

export async function updateProperty(req: any, res: any, id: any) {
  let conn;
  let address = req.body.address;
  let description = req.body.description;
  let price = req.body.price;
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;
  let terrainHeight = req.body.terrainHeight;
  let terrainWidth = req.body.terrainWidth;
  let bedroomAmount = req.body.bedroomAmount;
  let bathroomAmount = req.body.bathroomAmount;
  let floorAmount = req.body.floorAmount;
  let garageSize = req.body.garageSize;


  try {
    conn = await pool.getConnection();
    const result: PropertyData[] = await conn.query(
      `UPDATE Properties SET address= "${address}",description="${description}",price=${price}, latitude=${latitude},longitude=${longitude},terrainHeight=${terrainHeight},terrainWidth=${terrainWidth},bedroomAmount= ${bedroomAmount},bathroomAmount=${bathroomAmount}, floorAmount=${floorAmount},garageSize=${garageSize} WHERE propertyId="${id}"`
      );
    res.send(result);
    return { success: true, result} ;
  } catch (e) {
    console.error("Something went wrong", e);
    return { success: false };
  } finally {
    conn?.release();
  }
};

export async function delProperty(req: any, id: any, res: any) {
  let conn;
  
  res.send(`Property with id = ${id} deleted`)
  
  try {
    conn = await pool.getConnection();
    const result: PropertyData[] = await conn.query(
      `DELETE FROM Properties WHERE propertyId="${id}"`
      );
    res.send(result);
    return { success: true, result} ;
  } catch (e) {
    console.error("Something went wrong", e);
    return { success: false };
  } finally {
    conn?.release();
  }
};

