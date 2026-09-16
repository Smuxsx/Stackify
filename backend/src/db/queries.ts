import { logger } from "../utils/logger.ts";
import { db } from "./index.ts";
import { eq } from "drizzle-orm";

import {
  users,
  comments,
  products,
  type NewUser,
  type NewComment,
  type NewProduct,
} from "./schema.ts";

export type QueryContext = {
  requestId?: string;
  userId?: string | null;
};

const queryLogger = (
  operation: string,
  context: QueryContext = {}
) => {
  return logger.child({
    ...context,
    component: "Queries",
    operation,
  });
};


// --------------------------------
// USER QUERIES
// --------------------------------

export const createUser = async (
  data: NewUser,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "createUser",
    context
  );

  const user = await log.time(
    "Database operation",
    async () => {
      const [user] = await db
        .insert(users)
        .values(data)
        .returning();

      return user;
    }
  );

  return user;
};


export const getUserById = async (
  id: string,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "getUserById",
    context
  );

  return log.time(
    "Database operation",
    () =>
      db.query.users.findFirst({
        where: eq(users.id, id),
      })
  );
};


export const updateUser = async (
  id: string,
  data: Partial<NewUser>,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "updateUser",
    context
  );

  return log.time(
    "Database operation",
    async () => {
      const [user] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();

      return user;
    }
  );
};


export const upsertUser = async (
  data: NewUser,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "upsertUser",
    context
  );

  log.debug("Started");

  const existingUser =
    await getUserById(
      data.id,
      context
    );

  if (existingUser) {
    log.debug(
      "Existing user found, updating"
    );

    return updateUser(
      data.id,
      data,
      context
    );
  }

  log.debug(
    "User not found, creating"
  );

  return createUser(
    data,
    context
  );
};


// --------------------------------
// PRODUCT QUERIES
// --------------------------------

export const createProduct = async (
  data: NewProduct,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "createProduct",
    context
  );

  return log.time(
    "Database operation",
    async () => {
      const [product] = await db
        .insert(products)
        .values(data)
        .returning();

      return product;
    }
  );
};


export const getAllProduct = async (
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "getAllProduct",
    context
  );

  const result = await log.time(
    "Database operation",
    () =>
      db.query.products.findMany({
        with: {
          user: true,
        },

        orderBy: (
          products,
          { desc }
        ) => [
          desc(products.createdAt),
        ],
      })
  );

  log.debug("Products retrieved", {
    resultCount: result.length,
  });

  return result;
};


export const getProductById = async (
  id: string,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "getProductById",
    context
  );

  return log.time(
    "Database operation",
    () =>
      db.query.products.findFirst({
        where: eq(products.id, id),

        with: {
          user: true,

          comments: {
            with: {
              user: true,
            },

            orderBy: (
              comments,
              { desc }
            ) => [
              desc(
                comments.createdAt
              ),
            ],
          },
        },
      })
  );
};


export const getProductByUserId =
  async (
    userId: string,
    context: QueryContext = {}
  ) => {
    const log = queryLogger(
      "getProductByUserId",
      context
    );

    const result = await log.time(
      "Database operation",
      () =>
        db.query.products.findMany({
          where: eq(
            products.userId,
            userId
          ),

          with: {
            user: true,
          },

          orderBy: (
            products,
            { desc }
          ) => [
            desc(products.createdAt),
          ],
        })
    );

    log.debug("Products retrieved", {
      resultCount: result.length,
    });

    return result;
  };


export const updateProduct = async (
  id: string,
  data: Partial<NewProduct>,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "updateProduct",
    context
  );

  return log.time(
    "Database operation",
    async () => {
      const [product] = await db
        .update(products)
        .set(data)
        .where(eq(products.id, id))
        .returning();

      return product;
    }
  );
};


export const deleteProduct = async (
  id: string,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "deleteProduct",
    context
  );

  return log.time(
    "Database operation",
    async () => {
      const [deletedProduct] =
        await db
          .delete(products)
          .where(
            eq(products.id, id)
          )
          .returning();

      return deletedProduct;
    }
  );
};


export const upsertProduct = async (
  data: NewProduct,
  context: QueryContext = {}
) => {
  if (!data.id) {
    return createProduct(
      data,
      context
    );
  }

  const existingProduct =
    await getProductById(
      data.id,
      context
    );

  if (existingProduct) {
    return updateProduct(
      data.id,
      data,
      context
    );
  }

  return createProduct(
    data,
    context
  );
};


// --------------------------------
// COMMENT QUERIES
// --------------------------------

export const createComment = async (
  data: NewComment,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "createComment",
    context
  );

  return log.time(
    "Database operation",
    async () => {
      const [createdComment] =
        await db
          .insert(comments)
          .values(data)
          .returning();

      return createdComment;
    }
  );
};


export const deleteComment = async (
  id: string,
  context: QueryContext = {}
) => {
  const log = queryLogger(
    "deleteComment",
    context
  );

  return log.time(
    "Database operation",
    async () => {
      const [deletedComment] =
        await db
          .delete(comments)
          .where(
            eq(comments.id, id)
          )
          .returning();

      return deletedComment;
    }
  );
};


export const getCommentById =
  async (
    id: string,
    context: QueryContext = {}
  ) => {
    const log = queryLogger(
      "getCommentById",
      context
    );

    return log.time(
      "Database operation",
      () =>
        db.query.comments.findFirst({
          where: eq(
            comments.id,
            id
          ),

          with: {
            user: true,
          },
        })
    );
  };