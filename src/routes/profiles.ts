import { Router } from "express";
import { getUserDetails, updateUserDetails } from "../controllers/profiles";
import { getPropertiesList } from "../controllers/properties";
import { UserDetailsRequest } from "../entities/profiles";
import { PropertyFilters } from "../entities/properties";
import auth from "../middleware/auth";
import validation from "../middleware/validation";

const router = Router();

// #region Route docs
/**
 * GET /api/profile/properties
 * @tags Profiles
 * @summary Returns a list of properties that the logged user published
 * @security TokenAuth
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
  auth(),
  validation(PropertyFilters, "query"),
  async (_req, res) => {
    res.locals.data.userId = res.locals.auth.userId;

    const userProperties = await getPropertiesList(res.locals.data);

    if (!userProperties.isSuccessful) {
      return res.sendStatus(500);
    }

    res.json(userProperties.result);
  }
);

/**
 * GET /api/profile/details
 * @tags Profiles
 * @summary Get user's details. Use on the profiles page only
 * @security TokenAuth
 * @return {UserDetails} 200 - Everything went ok, and we return the user's details
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example response - 200 - User's details example
 * {
 *  "userId": 1,
 *  "phone": "8715555555",
 *  "email": "contact@example.net",
 *  "fbLink": "https://facebook.com/example",
 *  "instaLink": null,
 *  "twitLink": "https://twitter.com/example"
 * }
 */
router.get("/details", auth(), async (_req, res) => {
  const details = await getUserDetails(res.locals.auth.userId);

  if (!details.isSuccessful) {
    return res.sendStatus(500);
  }

  if (!details.result) {
    return res.json({
      userId: res.locals.auth.userId,
      phone: null,
      email: null,
      fbLink: null,
      instaLink: null,
      twitLink: null,
    });
  }

  res.json(details.result);
});

//#region
/**
 * PUT /api/profile/details
 * @tags Profiles
 * @summary Endpoint used to modify user's profile details
 * @security TokenAuth
 * @param {UserDetails} request.body.required - The details that you want to edit
 * @return 204 - Everything went ok, the edition was successful
 * @return {ValidationData} 400 - Some data is invalid, and we return an object detailing the error
 * @return 403 - Token not delivered, so the user is probably not logged in
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example request - Update email and phone (Partial)
 * {
 *  "email": "test@example.net",
 *  "phone": "+17885458"
 * }
 * @example request - Update facebook link (Partial)
 * {
 *  "fbLink": "https://facebook.com/ExamplePerson"
 * }
 * @example request - Update mail and Twitter link (Full)
 * {
 *  "phone": "+528715555555",
 *  "email": "newemail@example.net",
 *  "fbLink": "https://facebook.com/example",
 *  "instaLink": null,
 *  "twitLink": "https://twitter.com/UpdatedProfile"
 * }
 * @example response - 400 - Invalid phone number
 * {
 *  "missing": [],
 *  "invalid": [
 *    "phone"
 *  ]
 * }
 */
//#endregion
router.put(
  "/details",
  auth(),
  validation(UserDetailsRequest),
  async (_req, res) => {
    const putDetails = await updateUserDetails(
      res.locals.data,
      res.locals.auth.userId
    );

    if (!putDetails.isSuccessful) {
      return res.sendStatus(500);
    }

    res.sendStatus(204);
  }
);

export default router;
