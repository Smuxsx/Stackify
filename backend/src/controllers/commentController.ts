import type {
  Request,
  Response,
} from "express";

import * as queries from "../db/queries.ts";

import { getAuth } from "@clerk/express";

import { logger } from "../utils/logger.ts";


type CommentParams = {
  id: string;
  productId: string;
  commentId: string;
};


// --------------------------------
// CREATE COMMENT
// --------------------------------

export const createComment =
  async (
    req: Request<CommentParams>,
    res: Response
  ) => {
    const { userId } =
      getAuth(req);

    const {
      productId,
    } = req.params;

    const log = logger.child({
      requestId:
        req.requestId,
      userId,
      component:
        "CommentController",
      operation:
        "createComment",
      productId,
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
            error:
              "Unauthorized",
          });
      }

      const {
        content,
      } = req.body;

      if (!content) {
        log.warn(
          "Comment content missing"
        );

        return res
          .status(400)
          .json({
            error:
              "Content of the comment required",
          });
      }

      const product =
        await queries
          .getProductById(
            productId,
            {
              requestId:
                req.requestId,
              userId,
            }
          );

      if (!product) {
        log.warn(
          "Product not found"
        );

        return res
          .status(404)
          .json({
            error:
              "Product not found",
          });
      }

      const comment =
        await queries.createComment(
          {
            content,
            productId,
            userId,
          },

          {
            requestId:
              req.requestId,
            userId,
          }
        );

      log.debug("Completed", {
        commentId:
          comment?.id,
      });

      return res
        .status(201)
        .json(comment);

    } catch (error) {
      log.error(
        "Failed to create comment",
        {
          error,
        }
      );

      return res
        .status(500)
        .json({
          error:
            "Error creating comment",
        });
    }
  };


// --------------------------------
// DELETE COMMENT
// --------------------------------

export const deleteComment =
  async (
    req: Request<CommentParams>,
    res: Response
  ) => {
    const { userId } =
      getAuth(req);

    const {
      commentId,
    } = req.params;

    const log = logger.child({
      requestId:
        req.requestId,
      userId,
      component:
        "CommentController",
      operation:
        "deleteComment",
      commentId,
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
            error:
              "Unauthorized",
          });
      }

      if (!commentId) {
        log.warn(
          "Comment ID missing"
        );

        return res
          .status(404)
          .json({
            error:
              "Comment not found",
          });
      }

      const comment =
        await queries
          .getCommentById(
            commentId,
            {
              requestId:
                req.requestId,
              userId,
            }
          );

      if (!comment) {
        log.warn(
          "Comment not found"
        );

        return res
          .status(404)
          .json({
            error:
              "Comment not found",
          });
      }

      if (
        comment.userId !== userId
      ) {
        log.warn(
          "Forbidden delete attempt"
        );

        return res
          .status(403)
          .json({
            error:
              "You can only delete your own comment",
          });
      }

      await queries.deleteComment(
        commentId,
        {
          requestId:
            req.requestId,
          userId,
        }
      );

      log.debug("Completed");

      return res
        .status(200)
        .json({
          message:
            "Comment deleted successfully",
        });

    } catch (error) {
      log.error(
        "Failed to delete comment",
        {
          error,
        }
      );

      return res
        .status(500)
        .json({
          error:
            "Error deleting comment",
        });
    }
  };