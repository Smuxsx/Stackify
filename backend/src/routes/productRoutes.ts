import { Router } from "express";
import * as productController from "../controllers/productController.ts"
import { requireAuth } from "@clerk/express";

const router = Router();

// GET /api/products =>  get all products (public)
router.get("/", productController.getAllProducts)

// GET /api/products/my =>  get all the users products (protected)
router.get("/my", requireAuth(), productController.getMyProducts)

// GET /api/products/:id => get product by id (public)
router.get("/:id", productController.getProductById)

// POST /api/products/ => creates a product with user authentication
router.post("/", requireAuth(), productController.createProduct)  

// PUT /api/products/:id => updates a product with user authentication
router.put("/:id", requireAuth(), productController.updateProduct)

// DELETE /api/products/:id => Deletes a product with user authentication
router.delete("/:id", requireAuth(), productController.deleteProduct)

export default router;
