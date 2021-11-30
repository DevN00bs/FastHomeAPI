import jwt from "jsonwebtoken";
import { RequestHandler } from "express";

export default function auth(): RequestHandler {
  return async (req, res, next) => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.startsWith("Bearer")
    ) {
      return res.sendStatus(403);
    }

    if (req.headers.authorization.startsWith("Bearer Bearer")) {
      return res
        .status(400)
        .send(
          "Hello Swagger user (hopefully you're seeing this while using Swagger). Please, in the 'Authenticate' dialog box put only the token without the 'Bearer' thing, Swagger adds it automatically. Thank you and have a good day!"
        );
    }

    try {
      const payload = jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.SECRET!
      ) as jwt.JwtPayload;

      if (payload.purpose) {
        return res.sendStatus(403);
      }

      res.locals.auth = payload;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.sendStatus(403);
      }

      return res.sendStatus(500);
    }
  };
}
