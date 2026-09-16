import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { getAuth } from "@clerk/express";
import { logger } from "../utils/logger.ts";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = performance.now();

  const { userId } = getAuth(req);

  const log = logger.child({
    requestId: req.requestId,
    userId,
    component: "HTTP",
    method: req.method,
    endpoint: req.originalUrl,
  });

  res.once("finish", () => {
    const durationMs =
      performance.now() - startTime;

    log.info("Request completed", {
      statusCode: res.statusCode,
      durationMs: Number(
        durationMs.toFixed(2)
      ),
    });
  });

  next();
};