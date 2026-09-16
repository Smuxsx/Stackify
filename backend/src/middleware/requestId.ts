import { randomUUID } from "node:crypto";
import type {
  Request,
  Response,
  NextFunction,
} from "express";

export const requestId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = randomUUID();

  req.requestId = id;

  res.setHeader("X-Request-Id", id);

  next();
};