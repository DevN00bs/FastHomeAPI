import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { RequestHandler } from "express";

export default function validation(type: any): RequestHandler {
  return async (req, res, next) => {
    const data = plainToClass(type, req.body);
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
