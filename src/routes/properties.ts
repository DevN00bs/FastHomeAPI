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
import { PropertyRequest } from "../entities/properties";
import validation from "../middleware/validation";

const router = Router();

// #region Route docs
/**
 * GET /api/properties
 * @tags Properties
 * @summary Returns a list of properties that should be displayed on a list
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
 * @return 400 - You sent something that wasn't a number. Please check your request
 * @return 404 - A property with the id provided does not exists on the database
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
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
router.get(
  "/property/:id",
  validation(IDRequest, "params"),
  async (_req, res) => {
    const response = await getPropertyById(res.locals.data.id);

    if (!response.isSuccessful) {
      return res.sendStatus(500);
    }

    if (response.result!.length <= 0) {
      return res.sendStatus(404);
    }

    res.json(response.result![0]);
  }
);

// #region Route docs
/**
 * POST /api/property
 * @tags Properties
 * @summary Create a new property with all the details
 * @deprecated
 * @param {PropertyRequest} request.body.required
 * @return 201 - Everything went ok, the property was added and we return the property's ID
 * @return {ValidationData} 400 - Some data is missing and/or invalid, and we return an object detailing the error
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 */
// #endregion
router.post("/property", validation(PropertyRequest), async (_req, res) => {
  const newProp = await postProperty(res.locals.data);

  if (!newProp.isSuccessful) {
    return res.sendStatus(500);
  }

  res.status(201).json({ id: newProp.result });
});

// #region Route docs
/**
 * PUT /api/property/{id}
 * @tags Properties
 * @summary Edit the details of a property with the given ID
 * @deprecated
 * @param {integer} id.path.required Numeric Id of the property
 * @param {PropertyRequest} request.body.required
 * @return 201 - Everything went ok, the edition was successful
 * @return {ValidationData} 400 - Some data is invalid, and we return an object detailing the error
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example response - 400 - Invalid latitude
 * {
 *  "missing": [],
 *  "invalid": [
 *    "latitude"
 *  ]
 * }
 */
// #endregion
router.put("/property/:id", validation(PropertyRequest), async (req, res) => {
  if (Number.isNaN(req.params.id)) {
    return res.status(400).json({ invalid: ["id"] });
  }

  const update = await updateProperty(res.locals.data, parseInt(req.params.id));

  if (!update.isSuccessful) {
    return res.sendStatus(500);
  }

  res.sendStatus(201);
});

// #region Route docs
/**
 * DELETE /api/property/{id}
 * @tags Properties
 * @summary Return details of one selected property based on the ID
 * @param {integer} id.path.required Numeric Id of the property
 * @return 204 - Property successfully deleted
 * @return 400 - ID must be an integer. Please, try again
 * @return 404 - A property with the id provided does not exists on the database
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 */
// #endregion
router.delete(
  "/property/:id",
  validation(IDRequest, "params"),
  async (_req, res) => {
    const del = await delProperty(res.locals.data.id);

    if (!del.isSuccessful) {
      return res.sendStatus(500);
    }

    if (del.result!.length <= 0) {
      return res.sendStatus(404);
    }

    res.sendStatus(204);
  }
);

//#region
/**
 * POST /api/property/{id}/images
 * @summary Route to upload a property's photos
 * @tags Properties
 * @deprecated
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
