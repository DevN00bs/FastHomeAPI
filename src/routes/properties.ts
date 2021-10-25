import { Router } from "express";
import {
  getProperties,
  getId,
  postProperty,
  updatePropertie,
  delProperty,
} from "../controllers/properties";

const router = Router();

router.get("/v1/properties", (req, res) => {
  getProperties(res);
});

router.get("/v1/properties/:propertyId", (req, res) => {
  let id = req.params.propertyId;
  getId(res, id);
});

router.post("/v1/properties", (req, res) => {
  postProperty(req, res);
});

router.put("/v1/properties/:propertyId", (req, res) => {
  let id = req.params.propertyId;
  updatePropertie(req, res, id);
});

router.delete("/v1/properties/:propertyId", (req, res) => {
  let id = req.params.propertyId;
  delProperty(req, id, res);
});

export default router;
