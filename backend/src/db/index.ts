import 'dotenv/config'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from "./schema.ts"
import { ENV } from '../config/env.ts'

if(!ENV.DB_URL) {
    throw new Error("DB_URL is not set in environment variables")
}

// Initialize PostgreSQL connection pool

const pool = new Pool({connectionString: ENV.DB_URL});

// Log when first connection is made

pool.on("connect", () => {
    console.log("Database connected succesfully");
});

// Log when an error occurs

pool.on("error", () => {
    console.log("Database connection error");
});

export const db = drizzle({client: pool, schema}); 