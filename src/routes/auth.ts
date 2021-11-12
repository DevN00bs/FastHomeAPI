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

//#region
/**
 * POST /api/auth/forgot
 * @summary Sends a "Password validation" email to the address provided
 * @tags Authentication
 * @param {ForgotPasswordData} request.body.required - Email address to send the message
 * @return 200 - Email was sent correctly
 * @return 404 - No account registered with this email was found
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example request - Email address
 * {
 *  "email": "test@example.net"
 * }
 */
//#endregion
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

//#region
/**
 * POST /api/auth/login
 * @summary Checks user's credentials and returns a token if they are correct
 * @tags Authentication
 * @param {LoginData} request.body.required - Should contain user credentials
 * @return {object} 200 - Returns a token that identifies the user. This should be saved until the user logs out
 * @return 401 - User credentials are wrong
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 * @example request - Example credentials
 * {
 *  "username": "testuser",
 *  "password": "testpass"
 * }
 * @example response - 200 - Authorization token
 * {
 *  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJwdXJwb3NlIjoiZm9yZ290IiwiaWF0IjoxNjM2NDc4OTc0LCJleHAiOjE2MzY0Nzk2MzR9.hMRnkOxiIxUgt-jlo-7W6GhmIxmsfBxQh4q_by8CVXA"
 * }
 */
//#endregion
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

//#region
/**
 * GET /api/auth/verify/{token}
 * @summary Verifies the email address of an account
 * @tags Authentication
 * @param {string} request.path.required - Verification token
 * @return 200 - Email was verified successfully
 * @return 401 - Link has expired and/or is invalid
 * @return 500 - Internal Server Error. If you see this ever, please tell us in the group
 */
//#endregion
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
