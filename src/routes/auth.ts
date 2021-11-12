import { Router } from "express";
import {
  checkIfUserExists,
  createUser,
  loginUser,
  sendPasswordEmail,
  sendVerifyMail,
  verifyMail,
} from "../controllers/auth";
import {
  ForgotPasswordData,
  LoginData,
  LinkData,
  RegistrationData,
} from "../entities/auth";
import validation from "../middleware/validation";

const router = Router();

//#region
/**
 * POST /api/auth/register
 * @summary Creates a new user and sends the account validation email
 * @tags Authentication
 * @param {RegistrationData} request.body.required - New user information
 * @return 201 - User was successfully created
 * @return {object} 400 - Some data is missing and/or invalid, and we return an object detailing the error
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example request - New user data
 * {
 *  "username": "testuser",
 *  "password": "testpass",
 *  "email": "test@example.net"
 * }
 * @example response - 400 - Missing password
 * {
 *  "invalid": [],
 *  "missing": [
 *    "password"
 *  ]
 * }
 * @example response - 400 - Invalid email and missing username
 * {
 *  "invalid": [
 *    "email"
 *  ],
 *  "missing": [
 *    "username"
 *  ]
 * }
 */
//#endregion
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

router.get(
  "/verify/:token",
  validation(LinkData, "params"),
  async (_req, res) => {
    const verify = await verifyMail(res.locals.data.token);

    if (!verify.isSuccessful) {
      return res.sendStatus(500);
    }

    if (!verify.result) {
      return res.sendStatus(401);
    }

    res.sendStatus(200);
  }
);

export default router;
