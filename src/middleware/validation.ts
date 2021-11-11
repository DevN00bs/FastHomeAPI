import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

type source = "body" | "params";

export default function validation(type: any, source: source = "body"): RequestHandler {
  return async (req, res, next) => {
    const data = plainToClass(type, req[source]);
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

    res.locals.data = data;
    next();
  };
}
