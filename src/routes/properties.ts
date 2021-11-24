import { Router } from "express";
import upload from "../conf/images";
import {
  getPropertiesList,
  getPropertyById,
  postProperty,
  updateProperty,
  delProperty,
  savePhotos,
} from "../controllers/properties";
import { IDRequest } from "../entities/controller";
import {
  PropertyRequest,
  PartialPropertyRequest,
  PropertyFilters,
} from "../entities/properties";
import auth from "../middleware/auth";
import validation from "../middleware/validation";

const router = Router();

// #region Route docs
/**
 * GET /api/properties
 * @tags Properties
 * @summary Returns a list of properties that should be displayed on a list
 * @param {integer} bedrooms.query - Specify the number of bedrooms that a house needs. The number 5 refers to five or more bedrooms - enum:0,1,2,3,4,5
 * @param {integer} bathrooms.query - Specify the number of bathrooms that a house needs. The number 6 refers to three or more bedrooms - enum:0,1,2,3,4,5,6
 * @param {integer} garage.query - Specify the number of cars that a garage needs. The number 4 refers to four or more cars - enum:0,1,2,3,4
 * @param {integer} floors.query - Specify the number of floors that a house needs. The number 3 refers to three or more floors - enum:0,1,2,3
 * @param {integer} currency.query - Send the ID of the currency you want to filter
 * @return {array<BasicPropertyData>} 200 - Everything went ok, and we return a list of properties. See example below
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
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
router.get(
  "/properties",
  validation(PropertyFilters, "query"),
  async (_req, res) => {
    const response = await getPropertiesList(res.locals.data);

    if (!response.isSuccessful) {
      return res.sendStatus(500);
    }

    res.json(response.result);
  }
);

// #region Route docs
/**
 * GET /api/property/{id}
 * @tags Properties
 * @summary Return details of one selected property based on the ID
 * @param {integer} id.path.required Numeric Id of the property
 * @return {PropertyData} 200 - Everything went ok, and it returns property details. See example below
 * @return 400 - You sent something that wasn't a number. Please check your request
 * @return 404 - A property with the id provided does not exists on the database
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example response - 200 - An example of a property
 * {
 *   "photos": [
 *      {
 *        "url": "https://i.imgur.com/9y2CCs7.jpeg",
 *        "description": null
 *      },
 *      {
 *        "url": "https://i.imgur.com/WGx7R7J.jpeg",
 *        "description": "Has a big, beautiful bathroom!1!! Buy NOW!"
 *      }
 *    ],
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
router.get(
  "/property/:id",
  validation(IDRequest, "params"),
  async (_req, res) => {
    const response = await getPropertyById(res.locals.data.id);

    if (!response.isSuccessful) {
      return res.sendStatus(500);
    }

    if (!response.result) {
      return res.sendStatus(404);
    }

    res.json(response.result);
  }
);

// #region Route docs
/**
 * POST /api/property
 * @tags Properties
 * @summary Create a new property with all the details
 * @security TokenAuth
 * @param {PropertyRequest} request.body.required
 * @return {IDRequest} 201 - Everything went ok, the property was added and we return the property's ID
 * @return {ValidationData} 400 - Some data is missing and/or invalid, and we return an object detailing the error
 * @return 403 - The token is missing or it is invalid
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example request - An example property
 * {
 *   "address": "158 Main Street",
 *   "description": "lol",
 *   "price": 8500,
 *   "latitude": 28.661655,
 *   "longitude": -106.040184,
 *   "terrainHeight": 7.5,
 *   "terrainWidth": 9.25,
 *   "bedroomAmount": 1,
 *   "bathroomAmount": 1,
 *   "floorAmount": 1,
 *   "garageSize": 1,
 *   "contractType": 1,
 *   "currencyId": 1
 * }
 * @example response - 201 - ID of the created property
 * {
 *  "id": 5
 * }
 * @example response - 400 - Missing address
 * {
 *  "invalid": [],
 *  "missing": [
 *    "address"
 *  ]
 * }
 * @example response - 400 - Invalid longitude and missing terrain height
 * {
 *  "invalid": [
 *    "longitude"
 *  ],
 *  "missing": [
 *    "terrainHeight"
 *  ]
 * }
 */
// #endregion
router.post(
  "/property",
  auth(),
  validation(PropertyRequest),
  async (_req, res) => {
    const newProp = await postProperty(res.locals.data, res.locals.auth.userId);

    if (!newProp.isSuccessful) {
      return res.sendStatus(500);
    }

    res.status(201).json({ id: newProp.result });
  }
);

// #region Route docs
/**
 * PUT /api/property/{id}
 * @tags Properties
 * @summary Edit the details of a property with the given ID
 * @security TokenAuth
 * @param {integer} id.path.required ID of the property to edit
 * @param {PropertyRequest} request.body.required - The API supports partial upgrades, so you can send only the changes made to the property or send the whole object
 * @return 204 - Everything went ok, the edition was successful
 * @return {ValidationData} 400 - Some data is invalid, and we return an object detailing the error
 * @return 403 - The property specified does not belong to the user logged in, or you are not logged in
 * @return 404 - The property specified was not found in the database
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example request - Update price and description (Partial)
 * {
 *  "price": 780000,
 *  "description": "New description"
 * }
 * @example request - Update latitude and longitude (Partial)
 * {
 *  "latitude": -28.156954,
 *  "longitude": -105.227741
 * }
 * @example request - Update terrain dimentions (Full)
 * {
 *   "address": "158 Main Street",
 *   "description": "lol",
 *   "price": 8500,
 *   "latitude": 28.661655,
 *   "longitude": -106.040184,
 *   "terrainHeight": 11,
 *   "terrainWidth": 12,
 *   "bedroomAmount": 1,
 *   "bathroomAmount": 1,
 *   "floorAmount": 1,
 *   "garageSize": 1,
 *   "contractType": 1,
 *   "currencyId": 1
 * }
 * @example response - 400 - Invalid latitude
 * {
 *  "missing": [],
 *  "invalid": [
 *    "latitude"
 *  ]
 * }
 */
// #endregion
router.put(
  "/property/:id",
  auth(),
  validation(PartialPropertyRequest),
  async (req, res) => {
    if (Number.isNaN(req.params.id)) {
      return res.status(400).json({ invalid: ["id"] });
    }

    const update = await updateProperty(
      res.locals.data,
      parseInt(req.params.id),
      res.locals.auth.userId
    );

    if (!update.isSuccessful) {
      return res.sendStatus(500);
    }

    if (!update.result?.canModify) {
      return res.sendStatus(403);
    }

    if (!update.result.modified) {
      return res.sendStatus(500);
    }

    res.sendStatus(204);
  }
);

// #region Route docs
/**
 * DELETE /api/property/{id}
 * @tags Properties
 * @summary Delete a property using its ID
 * @security TokenAuth
 * @param {integer} id.path.required ID of the property
 * @return 204 - Everything went ok, the deletion was successful
 * @return {ValidationData} 400 - Some data is invalid, and we return an object detailing the error
 * @return 403 - The property specified does not belong to the user logged in, or you are not logged in
 * @return 404 - The property specified was not found in the database
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 */
// #endregion
router.delete(
  "/property/:id",
  auth(),
  validation(IDRequest, "params"),
  async (_req, res) => {
    const del = await delProperty(res.locals.data.id, res.locals.auth.userId);

    if (!del.isSuccessful) {
      return res.sendStatus(500);
    }

    if (!del.result?.canModify) {
      return res.sendStatus(403);
    }

    if (!del.result.modified) {
      return res.sendStatus(500);
    }

    res.sendStatus(204);
  }
);

//#region
/**
 * POST /api/property/{id}/images
 * @summary Route to upload a property's photos. Remember, any property without at least the main photo won't show on the list
 * @tags Properties
 * @security TokenAuth
 * @param {integer} id.path.required - The ID of the property to upload the photos to
 * @param {PropertyPhotos} request.body.required - The photos to upload - multipart/form-data
 * @return 201 - Everything went ok, the upload was successful
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 */
//#endregion
router.post(
  "/property/:id/images",
  upload.fields([
    { name: "main", maxCount: 1 },
    { name: "photos", maxCount: 5 },
  ]),
  async (req, res) => {
    const parsed = req.files as {
      main: Express.Multer.File[];
      photos: Express.Multer.File[];
    };
    const save = await savePhotos(parsed, parseInt(req.params.id));

    if (!save.isSuccessful) {
      return res.sendStatus(500);
    }

    res.sendStatus(201);
  }
);

export default router;
