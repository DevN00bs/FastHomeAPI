import { Router } from "express";
import { createUser, sendPasswordEmail } from "../controllers/auth";
import { RegistrationData } from "../entities/auth";
import validation from "../middleware/validation";

const router = Router();

router.post("/register", validation(RegistrationData), async (req, res) => {
  const creation = await createUser(res.locals.data);

  if (!creation.isSuccessful) {
    return res.sendStatus(500);
  }

  res.sendStatus(201);
});

router.post("/forgot", async (req, res) => {
  const mail = await sendPasswordEmail(req.body.email);

  if (!mail.isSuccessful) {
    return res.sendStatus(500);
  }

  res.sendStatus(200);
});

export default router;
