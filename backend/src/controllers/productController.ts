import type { Request, Response } from "express";
import * as queries from "../db/queries.ts"
import { getAuth } from "@clerk/express";
import { products } from "../db/schema.ts";


// Set up a type for the request parameters to ensure type safety when accessing the product ID from the request.
type productParams = {
    id: string;
}

// Get all products
export const getAllProducts = async (req:Request, res:Response) => {
    try {  
        const products = await queries.getAllProduct();
        res.status(200).json(products)
    } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({error: "Failed to get products"})
    }
}

// Get products by user
export const getMyProducts = async (req:Request<productParams>, res:Response) => {
    try {
        const { userId } = getAuth(req)
        if (!userId) return res.status(401).json({error: "Unathorized"})

        const products = await queries.getProductByUserId(userId)

        res.status(200).json(products)
    } catch (error) {
        console.log("Error Fetching products from user id", error);
        res.status(500).json({error: "Error getting products from user id"})
    }
}

// Get product by ID 
export const getProductById = async (req:Request<productParams>, res:Response) => {
    try {
        const { id } = req.params;
        const product = await queries.getProductById(id)

        if (!product) return res.status(404).json({Error: "Product not found"})

        res.status(200).json(product)
    } catch (error) {
        console.log("Error Fetching product", error);
        res.status(500).json({error: "Failed to get product"})
    }
}

// Create Product

export const createProduct = async (req:Request<productParams>, res:Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({error: "Unathorized"})

        const {title, description, imageUrl} = req.body;

        if(!title || !description || !imageUrl) {
            res.status(400).json({error: "Title, description and imageUrl required"})
            return;
        }

        const product = await queries.createProduct({
            title,
            description,
            imageUrl,
            userId
        })

        res.status(201).json(product)
    } catch (error) {
        console.error("Error Creating product", error)
        res.status(500).json({error: "Failed to create product"})
    }
    
}

// Update Product
export const updateProduct = async (req:Request<productParams>, res:Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({error: "Unathorized"});

        const { id } = req.params;
        const {title, description, imageUrl} = req.body;

        if (!title && !description && !imageUrl) {
            res.status(400).json({error: "At least one field (title, description, or imageUrl) required"});
            return;
        }

        // Check if product exists and belongs to user
        const existingProduct = await queries.getProductById(id);

        if (!existingProduct) {
            res.status(404).json({error: "Product not found"});
            return;
        }

        if (existingProduct.userId !== userId) {
            res.status(403).json({error: "Forbidden"});
            return
        }
        
        const updatedProduct = await queries.UpdateProduct(id, {
            title,
            description,
            imageUrl
        })
        res.status(200).json(updatedProduct)
        
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({error: "Failed to update product"})
    }
}

// Delete Product
export const deleteProduct = async (req:Request<productParams>, res:Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({error: "Unathorized"});

        const { id } = req.params;
        const existingProduct = await queries.getProductById(id);

        if (!existingProduct) return res.status(404).json({ error: "Product not found"})

        if (existingProduct.userId !== userId) {
            res.status(401).json({error: "Unathorized"});
            return;
        }

        await queries.deleteProduct(id);

        res.status(200).json({message: "Product deleted successfully"})


    } catch (error) {
        console.error("Error creating product", error);
        res.status(500).json({error: "Failed to delete product"})
    }
}