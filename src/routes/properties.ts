import { Router } from "express";
import {
  getPropertiesList,
  getId,
  postProperty,
  updatePropertie,
  delProperty,
} from "../controllers/properties";

const router = Router();

router.get("/properties", async (req, res) => {
  const response = await getPropertiesList();

  if (!response.isSuccessful) {
    return res.sendStatus(500);
  }

  res.json(response.result);
});

router.get("/property/:id", (req, res) => {
  let id = req.params.id;
  getId(res, id);
});

router.post("/property", (req, res) => {
  postProperty(req, res);
});

router.put("/property/:id", (req, res) => {
  let id = req.params.id;
  updatePropertie(req, res, id);
});

router.delete("/property/:id", (req, res) => {
  let id = req.params.id;
  delProperty(req, id, res);
});

export default router;
