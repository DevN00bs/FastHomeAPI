import { Router } from "express";
import { getUserDetails } from "../controllers/profiles";
import { getPropertiesList } from "../controllers/properties";
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

export default router;
