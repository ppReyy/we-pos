import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'

// Remove channel_binding from URL if present as it can cause issues with node-postgres
const connectionString = process.env.DATABASE_URL?.replace('&channel_binding=require', '')

const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false } // Neon typically works with this or true
})

export const db = drizzle(pool, { schema })
