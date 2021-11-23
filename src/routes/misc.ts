import { Router } from "express";
import { getCatalogsData } from "../controllers/misc";

const router = Router()

router.get("/catalogs", async (_req, res) => {
  const catalogs = await getCatalogsData()

  if (!catalogs.isSuccessful) {
    return res.sendStatus(500)
  }

  res.json(catalogs.result)
})

export default router