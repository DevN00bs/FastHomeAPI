import { Router } from "express";
import { createUser } from "../controllers/auth";

const router = Router();

router.post("/register", async (req, res) => {
  const creation = await createUser(req.body);

  if (!creation.isSuccessful) {
    return res.sendStatus(500);
  }

  res.sendStatus(201);
});

export default router;
