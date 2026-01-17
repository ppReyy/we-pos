import { config } from 'dotenv'
config()

import { eq } from 'drizzle-orm'
import { auth } from '../lib/auth-server'
import { db } from './index'
import { users as usersSchema } from './schema'

async function main() {
    console.log('Seeding (Final Fix attempt)...')

    // Define users
    const users = [
        { username: 'admin', email: 'admin@pos.com', password: 'admin123', fullName: 'Admin User', role: 'admin' },
        { username: 'manager1', email: 'manager@pos.com', password: 'admin123', fullName: 'Manager User', role: 'manager' },
        { username: 'server1', email: 'server@pos.com', password: 'admin123', fullName: 'Server User', role: 'server' },
        { username: 'kitchen1', email: 'kitchen@pos.com', password: 'admin123', fullName: 'Kitchen User', role: 'kitchen' },
        { username: 'counter1', email: 'counter@pos.com', password: 'admin123', fullName: 'Counter User', role: 'counter' },
    ]

    for (const user of users) {
        try {
            console.log(`Creating user: ${user.username}`)
            await auth.api.signUpEmail({
                body: {
                    email: user.email,
                    password: user.password,
                    name: user.fullName,
                    username: user.username,
                }
            })
            console.log('User created.')
        } catch (e: any) {
            // If error is about existing user, we move on to update role
            console.log(`Note: User ${user.username} might already exist or validation failed.`)
            // console.log('Error details:', e.message)
        }

        try {
            // Always try to update role
            if (user.role !== 'server') {
                console.log(`Updating role for ${user.username} to ${user.role}...`)
                await db.update(usersSchema)
                    .set({ role: user.role as any })
                    .where(eq(usersSchema.username, user.username))
                console.log('Role updated.')
            }
        } catch (e: any) {
            console.log(`Failed to update role for ${user.username}:`, e.message)
        }
    }
    process.exit(0)
}

main()
