import { Router } from "express";
import {
  getPropertiesList,
  getId,
  postProperty,
  updatePropertie,
  delProperty,
} from "../controllers/properties";

const router = Router();

// #region Route docs
/**
 * GET /api/properties
 * @tags Properties
 * @summary Returns a list of properties that should be displayed on a list
 * @return {array<BasicPropertyData>} 200 - Everything went ok, and we return a list of properties. See example below
 * @return {string} 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example response - 200 - An example list of properties
 * [
 * {
 *   "photoURL": "https://i.imgur.com/9y2CCs7.jpeg",
 *   "address": "158 Main Street",
 *   "username": "testuser",
 *   "terrainHeight": 7,
 *   "terrainWidth": 9,
 *   "price": 850000,
 *   "currencySymbol": "$",
 *   "currencyCode": "MXN",
 *   "contractType": 1,
 *   "bedroomAmount": 1,
 *   "bathroomAmount": 1,
 *   "floorAmount": 1,
 *   "garageSize": 1
 * },
 * {
 *   "photoURL": "https://i.imgur.com/ZgS3j4H.jpeg",
 *   "address": "877 Vanilla Avenue",
 *   "username": "testuser",
 *   "terrainHeight": 9.5,
 *   "terrainWidth": 7,
 *   "price": 750000,
 *   "currencySymbol": "$",
 *   "currencyCode": "MXN",
 *   "contractType": 1,
 *   "bedroomAmount": 2,
 *   "bathroomAmount": 1.5,
 *   "floorAmount": 2,
 *   "garageSize": 2
 * }
 *]
 */
// #endregion
router.get("/properties", async (req, res) => {
  const response = await getPropertiesList();

  if (!response.isSuccessful) {
    return res.sendStatus(500);
  }

  res.json(response.result);
});

// #region Route docs
/**
 * GET /api/property/{id}
 * @tags Properties
 * @summary Return details of one selected property based on the ID
 * @param {integer} id.path.required Numeric Id of the property
 * @return {array<PropertyData>} 200 - Everything went ok, and it returns property details. See example below
 * @return {string} 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example response - 200 - An example of a property
 * [{
      "propertyId": 1,
      "address": "158 Main Street",
      "description": "lol",
      "price": 8500,
      "latitude": 0,
      "longitude": 0,
      "terrainHeight": 7,
      "terrainWidth": 9,
      "bedroomAmount": 1,
      "bathroomAmount": 1,
      "floorAmount": 1,
      "garageSize": 1,
      "vendorUserId": 1,
      "buyerUserId": null,
      "contractType": 1,
      "currencyId": 1
   }]
 */
// #endregion

router.get("/property/:id", async (req, res) => {
  let id = req.params.id;

  const response = await getId(res, id);

  if (!response.success) {
    return res.sendStatus(500);
  }

  res.json(response.result);
});

// #region Route docs
/**
 * POST /api/property
 * @tags Properties
 * @summary Create a new property with all the details
 * @param {array<InfoProperty>} request.body.required
 * @return {array} 200 - Everything went ok, and it returns property details. See example below
 * @return {string} 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example response - 200 - Response from the API
  {
    "affectedRows":1,
    "insertedId":"#id"
  }
 */
// #endregion

router.post("/property", (req, res) => {
  postProperty(req, res);
});

// #region Route docs
/**
 * PUT /api/property/:id
 * @tags Properties
 * @summary Edit the details of a property with the given ID
 * @param {integer} id.path.required Numeric Id of the property
 * @param {array<InfoProperty>} request.body.required
 * @return {array<InfoProperty>} 200 - Everything went ok, and it returns property details. See example below
 * @return {string} 500 - Internal Server Error. If you see this ever, please tell us in the group
 */
// #endregion

router.put("/property/:id", (req, res) => {
  let id = req.params.id;
  updatePropertie(req, res, id);
});

router.delete("/property/:id", (req, res) => {
  let id = req.params.id;
  delProperty(req, id, res);
});

export default router;
