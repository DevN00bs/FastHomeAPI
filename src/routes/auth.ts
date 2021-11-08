import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Router } from "express";
import { createUser } from "../controllers/auth";
import { RegistrationData } from "../entities/auth";

const router = Router();

router.post("/register", async (req, res) => {
  const data = plainToClass(RegistrationData, req.body);
  const errors = await validate(data);

  if (errors.length > 0) {
    return res.status(400).json({
      invalid: errors
        .filter((error) => error.value !== undefined)
        .map((error) => error.property),
      missing: errors
        .filter((error) => error.value === undefined)
        .map((error) => error.property),
    });
  }

  const creation = await createUser(req.body);

  if (!creation.isSuccessful) {
    return res.sendStatus(500);
  }

  res.sendStatus(201);
});

export default router;
