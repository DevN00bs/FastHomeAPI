import { Router } from "express";
import {
  checkIfUserExists,
  createUser,
  loginUser,
  sendPasswordEmail,
  sendVerifyMail,
} from "../controllers/auth";
import {
  ForgotPasswordData,
  LoginData,
  RegistrationData,
} from "../entities/auth";
import validation from "../middleware/validation";

const router = Router();

router.post("/register", validation(RegistrationData), async (req, res) => {
  const creation = await createUser(res.locals.data);

  if (!creation.isSuccessful) {
    return res.sendStatus(500);
  }

  const mail = await sendVerifyMail(res.locals.data.username);

  if (!mail.isSuccessful) {
    return res.sendStatus(500);
  }

  res.sendStatus(201);
});

router.post("/forgot", validation(ForgotPasswordData), async (req, res) => {
  const mail = await sendPasswordEmail(res.locals.data.email);

  if (!mail.isSuccessful) {
    return res.sendStatus(500);
  }

  if (!mail.result) {
    return res.sendStatus(404);
  }

  res.sendStatus(200);
});

router.post("/login", validation(LoginData), async (_req, res) => {
  const userCheck = await checkIfUserExists(res.locals.data.username);

  if (!userCheck.isSuccessful) {
    return res.sendStatus(500);
  }

  if (!userCheck.result) {
    return res.sendStatus(401);
  }

  const login = await loginUser(res.locals.data);

  if (!login.isSuccessful) {
    return res.sendStatus(500);
  }

  if (!login.result?.passwordsMatch) {
    return res.sendStatus(401);
  }

  res.json({ token: login.result.token });
});

export default router;
