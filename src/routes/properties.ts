import { Router } from "express";
import {
  getPropertiesList,
  getPropertyById,
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
 *   "propertyId": 1,
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
 *   "propertyId": 2,
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
 * @return {PropertyData} 200 - Everything went ok, and it returns property details. See example below
 * @return {string} 400 - You sent something that wasn't a number. Please check your request
 * @return {string} 404 - A property with the id provided does not exists on the database
 * @return {string} 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example response - 200 - An example of a property
 * {
 *   "propertyId": 1,
 *   "address": "158 Main Street",
 *   "description": "lol",
 *   "username": "testuser",
 *   "userRating": 4.5,
 *   "price": 8500,
 *   "currencySymbol": "$",
 *   "currencyCode": "MXN",
 *   "latitude": 28.661655,
 *   "longitude": -106.040184,
 *   "terrainHeight": 7.5,
 *   "terrainWidth": 9.25,
 *   "bedroomAmount": 1,
 *   "bathroomAmount": 1,
 *   "floorAmount": 1,
 *   "garageSize": 1,
 *   "contractType": 1
 * }
 */
// #endregion
router.get("/property/:id", async (req, res) => {
  let id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return res.sendStatus(400);
  }

  const response = await getPropertyById(id);

  if (!response.isSuccessful) {
    return res.sendStatus(500);
  }

  if (response.result!.length <= 0) {
    return res.sendStatus(404);
  }

  res.json(response.result![0]);
});

// #region Route docs
/**
 * POST /api/property
 * @tags Properties
 * @summary Create a new property with all the details
 * @deprecated
 * @param {PropertyRequest} request.body.required
 * @return {string} 201 - Everything went ok, the property was added
 * @return {string} 500 - Internal Server Error. If you see this ever, please tell us in the group
 */
// #endregion
router.post("/property", (req, res) => {
  postProperty(req, res);
});

// #region Route docs
/**
 * PUT /api/property/{id}
 * @tags Properties
 * @summary Edit the details of a property with the given ID
 * @deprecated
 * @param {integer} id.path.required Numeric Id of the property
 * @param {PropertyRequest} request.body.required
 * @return 204 - Everything went ok, the edition was successful
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
