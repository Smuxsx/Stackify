// This is where we are going to create all of the methods (query products, add products, add user, etc) in our app.

import { db } from "./index";
import { eq } from 'drizzle-orm';
import { users, comments, products, type NewUser, type NewComment, type NewProduct} from './schema';

// User queries

export const createUser = async (data: NewUser) => {
    const [user] = await db.insert(users).values(data).returning()
    return user;
};

export const getUserById = async (id: string) => {
    return db.query.users.findFirst({where: eq(users.id, id)})
}

export const UpdateUser = async (id: string, data:Partial<NewUser>) => {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
}

// upsert => create or update
export const upsertUser = async(data: NewUser) => {
    const existingUser = await getUserById(data.id);
    if(existingUser) return UpdateUser(data.id, data);

    return createUser(data)
}

// Product Queries


// Create product
export const createProduct = async (data: NewProduct) => {
    const [product] = await db.insert(products).values(data).returning();
    return product
}

// Get All Products
export const getAllProduct = async () => {
    return db.query.products.findMany({
        with:{ user: true },
    orderBy: (products, {desc}) => [desc(products.createdAt)] // You will see the latest created product first, square brackets are required because Drizzle ORM's orderBy expects an array.
    })
}


// Get product by its ID
export const getProductById = async (id: string) => {
    return await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            user: true, 
            comments: {
                with: {user: true},
                orderBy: (comments, {desc}) => [desc(comments.createdAt)]
            }
        }
    
    })
}

// Get Product By the user ID
export const getProductByUserId = async (userId: string) => {
    return db.query.products.findMany({
        where: eq(products.userId, userId),
        with: {
            user: true
        },
        orderBy: (products, {desc}) => [desc(products.createdAt)] 
    })
}


// Update the product
export const UpdateProduct = async (id: string, data:Partial<NewProduct>) => {
    const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning()
    return product
}

// Delete the Product
export const deleteProduct = async (id: string) => {
    const [deletedProduct] = await db.delete(products).where(eq(products.id, id)).returning();
    return deletedProduct;
    
}

export const upsertProduct = async (data: NewProduct) => {
    const existingProduct = await getProductById(data.id!);

    if (existingProduct) return UpdateProduct(data.id!, data) 

    return createProduct(data)

};

// COMMENT QUERIES

// Create Comment
export const createComment = async (data:NewComment) => {
    const  [createdComment] = await db.insert(comments).values(data).returning();
    return createdComment;
}

// Delete Commment

export const deleteComment = async (id: string) => {
    const [deletedCommment] = await db.delete(comments).where(eq(comments.id, id)).returning();
    return deleteComment;
}

// Get Comment By comment Id

export const getCommentById = async (id: string) => {
    return await db.query.comments.findFirst({
        where: eq(comments.id, id),
        with: {
            user: true
        }
    })
};