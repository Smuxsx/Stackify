import express from "express";
import cors from "cors";
import { ENV } from "./config/env.ts";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/userRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";
import commentRoutes from "./routes/commentRoutes.ts";

const app = express()

app.use(cors({origin: ENV.FRONTEND_URL})) // Enable CORS for the frontend URL specified in the environment variables. This allows our frontend to make requests to this backend without CORS issues.
app.use(clerkMiddleware()) // Auth obj will be available in req.auth after this middleware.
app.use(express.json()) // parses JSON request bodies.
app.use(express.urlencoded({extended: true})); // parses form data (Like HTML forms).


app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Stockify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            comments: "/api/comments"
        }
    })
})

app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/comments", commentRoutes)

app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`)
})