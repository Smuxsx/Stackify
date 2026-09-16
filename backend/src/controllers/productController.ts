import type {
  Request,
  Response,
} from "express";

import * as queries from "../db/queries.ts";

import { getAuth } from "@clerk/express";

import { logger } from "../utils/logger.ts";


type ProductParams = {
  id: string;
};


// --------------------------------
// GET ALL PRODUCTS
// --------------------------------

export const getAllProducts = async (
  req: Request,
  res: Response
) => {
  const { userId } = getAuth(req);

  const log = logger.child({
    requestId: req.requestId,
    userId,
    component:
      "ProductController",
    operation:
      "getAllProducts",
  });

  log.debug("Started");

  try {
    const products =
      await queries.getAllProduct({
        requestId:
          req.requestId,
        userId,
      });

    log.debug("Completed", {
      resultCount:
        products.length,
    });

    return res
      .status(200)
      .json(products);

  } catch (error) {
    log.error(
      "Failed to get products",
      {
        error,
      }
    );

    return res
      .status(500)
      .json({
        error:
          "Failed to get products",
      });
  }
};


// --------------------------------
// GET PRODUCTS FOR CURRENT USER
// --------------------------------

export const getMyProducts = async (
  req: Request<ProductParams>,
  res: Response
) => {
  const { userId } = getAuth(req);

  const log = logger.child({
    requestId: req.requestId,
    userId,
    component:
      "ProductController",
    operation:
      "getMyProducts",
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

    const products =
      await queries
        .getProductByUserId(
          userId,
          {
            requestId:
              req.requestId,
            userId,
          }
        );

    log.debug("Completed", {
      resultCount:
        products.length,
    });

    return res
      .status(200)
      .json(products);

  } catch (error) {
    log.error(
      "Failed to retrieve user products",
      {
        error,
      }
    );

    return res
      .status(500)
      .json({
        error:
          "Error getting products from user id",
      });
  }
};


// --------------------------------
// GET PRODUCT BY ID
// --------------------------------

export const getProductById =
  async (
    req: Request<ProductParams>,
    res: Response
  ) => {
    const { userId } =
      getAuth(req);

    const { id } = req.params;

    const log = logger.child({
      requestId:
        req.requestId,
      userId,
      component:
        "ProductController",
      operation:
        "getProductById",
      productId: id,
    });

    log.debug("Started");

    try {
      const product =
        await queries
          .getProductById(
            id,
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

      log.debug("Completed");

      return res
        .status(200)
        .json(product);

    } catch (error) {
      log.error(
        "Failed to fetch product",
        {
          error,
        }
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to get product",
        });
    }
  };


// --------------------------------
// CREATE PRODUCT
// --------------------------------

export const createProduct =
  async (
    req: Request<ProductParams>,
    res: Response
  ) => {
    const { userId } =
      getAuth(req);

    const log = logger.child({
      requestId:
        req.requestId,
      userId,
      component:
        "ProductController",
      operation:
        "createProduct",
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
        title,
        description,
        imageUrl,
      } = req.body;

      if (
        !title ||
        !description ||
        !imageUrl
      ) {
        log.warn(
          "Invalid request body"
        );

        return res
          .status(400)
          .json({
            error:
              "Title, description and imageUrl required",
          });
      }

      const product =
        await queries
          .createProduct(
            {
              title,
              description,
              imageUrl,
              userId,
            },

            {
              requestId:
                req.requestId,
              userId,
            }
          );

      log.debug("Completed", {
        productId:
          product?.id,
      });

      return res
        .status(201)
        .json(product);

    } catch (error) {
      log.error(
        "Failed to create product",
        {
          error,
        }
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to create product",
        });
    }
  };


// --------------------------------
// UPDATE PRODUCT
// --------------------------------

export const updateProduct =
  async (
    req: Request<ProductParams>,
    res: Response
  ) => {
    const { userId } =
      getAuth(req);

    const { id } = req.params;

    const log = logger.child({
      requestId:
        req.requestId,
      userId,
      component:
        "ProductController",
      operation:
        "updateProduct",
      productId: id,
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
        title,
        description,
        imageUrl,
      } = req.body;

      if (
        !title &&
        !description &&
        !imageUrl
      ) {
        log.warn(
          "No update fields provided"
        );

        return res
          .status(400)
          .json({
            error:
              "At least one field required",
          });
      }

      const existingProduct =
        await queries
          .getProductById(
            id,
            {
              requestId:
                req.requestId,
              userId,
            }
          );

      if (!existingProduct) {
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

      if (
        existingProduct.userId !==
        userId
      ) {
        log.warn(
          "Forbidden update attempt"
        );

        return res
          .status(403)
          .json({
            error:
              "Forbidden",
          });
      }

      const updatedProduct =
        await queries
          .updateProduct(
            id,
            {
              title,
              description,
              imageUrl,
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
        .json(updatedProduct);

    } catch (error) {
      log.error(
        "Failed to update product",
        {
          error,
        }
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to update product",
        });
    }
  };


// --------------------------------
// DELETE PRODUCT
// --------------------------------

export const deleteProduct =
  async (
    req: Request<ProductParams>,
    res: Response
  ) => {
    const { userId } =
      getAuth(req);

    const { id } = req.params;

    const log = logger.child({
      requestId:
        req.requestId,
      userId,
      component:
        "ProductController",
      operation:
        "deleteProduct",
      productId: id,
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

      const existingProduct =
        await queries
          .getProductById(
            id,
            {
              requestId:
                req.requestId,
              userId,
            }
          );

      if (!existingProduct) {
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

      if (
        existingProduct.userId !==
        userId
      ) {
        log.warn(
          "Forbidden delete attempt"
        );

        return res
          .status(403)
          .json({
            error:
              "Forbidden",
          });
      }

      await queries.deleteProduct(
        id,
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
            "Product deleted successfully",
        });

    } catch (error) {
      log.error(
        "Failed to delete product",
        {
          error,
        }
      );

      return res
        .status(500)
        .json({
          error:
            "Failed to delete product",
        });
    }
  };