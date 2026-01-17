import { config } from 'dotenv'
config()
import { db } from './index'
import { sql } from 'drizzle-orm'

async function main() {
    try {
        console.log('Testing DB connection to:', process.env.DATABASE_URL?.split('@')[1]) // Log only host for safety
        const res = await db.execute(sql`SELECT 1 as connected`)
        console.log('DB Connection successful:', res)
    } catch (err) {
        console.error('DB Connection failed:', err)
    }
    process.exit(0)
}

main()
