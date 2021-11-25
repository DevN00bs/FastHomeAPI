import { Router } from "express";
import { getPropertiesList } from "../controllers/properties";
import { PropertyFilters } from "../entities/properties";
import auth from "../middleware/auth";
import validation from "../middleware/validation";

const router = Router();

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

export default router;
