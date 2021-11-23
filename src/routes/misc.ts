import { Router } from "express";
import { getCatalogsData } from "../controllers/misc";

const router = Router();

/**
 * GET /api/misc/catalogs
 * @tags Miscellaneous
 * @summary Get the available data directly from the database
 * @return {CatalogsData} 200 - An object with all the catalogs available
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example response - 200 - Catalogs data
 * {
 *  "currencies": [
 *    {
 *     "id": 1,
 *     "currency": "Mexican Peso - MXN"
 *    },
 *    {
 *     "id": 2,
 *     "currency": "US Dollars - USD"
 *    }
 *  ],
 *  "contracts": [
 *    {
 *     "id": 1,
 *     "contract": "Purchase"
 *    },
 *    {
 *     "id": 2,
 *     "contract": "Lease"
 *    }
 *  ]
 * }
 */
router.get("/catalogs", async (_req, res) => {
  const catalogs = await getCatalogsData();

  if (!catalogs.isSuccessful) {
    return res.sendStatus(500);
  }

  res.json(catalogs.result);
});

export default router;
