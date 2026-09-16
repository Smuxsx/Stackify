import type {
  Request,
  Response,
} from "express";

import * as queries from "../db/queries.ts";

import { getAuth } from "@clerk/express";

import { logger } from "../utils/logger.ts";


export async function syncUser(
  req: Request,
  res: Response
) {
  const { userId } = getAuth(req);

  const log = logger.child({
    requestId: req.requestId,
    userId,
    component: "UserController",
    operation: "syncUser",
  });

  log.debug("Started");

  try {
    if (!userId) {
      log.warn(
        "Unauthorized request"
      );

      return res
        .status(401)
        .json({
          error: "Unauthorized",
        });
    }

    const {
      email,
      name,
      imageUrl,
    } = req.body;

    if (!email || !name) {
      log.warn(
        "Invalid request body"
      );

      return res
        .status(400)
        .json({
          error:
            "Email and name are required",
        });
    }

    const user =
      await queries.upsertUser(
        {
          id: userId,
          email,
          name,
          imageUrl:
            imageUrl || null,
        },

        {
          requestId:
            req.requestId,
          userId,
        }
      );

    log.debug("Completed");

    return res
      .status(200)
      .json(user);

  } catch (error) {
    log.error(
      "Failed to sync user",
      {
        error,
      }
    );

    return res
      .status(500)
      .json({
        error:
          "Failed to sync user",
      });
  }
}