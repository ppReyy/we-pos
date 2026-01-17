import { config } from 'dotenv'
config()

import { auth } from '../lib/auth-server'

async function main() {
    console.log('Seeding database...')

    const users = [
        {
            username: 'admin',
            email: 'admin@pos.com',
            password: 'admin123',
            fullName: 'Admin User',
            role: 'admin',
        },
        {
            username: 'manager1',
            email: 'manager@pos.com',
            password: 'admin123',
            fullName: 'Manager User',
            role: 'manager',
        },
        {
            username: 'server1',
            email: 'server@pos.com',
            password: 'admin123',
            fullName: 'Server User',
            role: 'server',
        },
        {
            username: 'kitchen1',
            email: 'kitchen@pos.com',
            password: 'admin123',
            fullName: 'Kitchen User',
            role: 'kitchen',
        },
        {
            username: 'counter1',
            email: 'counter@pos.com',
            password: 'admin123',
            fullName: 'Counter User',
            role: 'counter',
        }
    ]

    for (const user of users) {
        try {
            console.log(`Creating user: ${user.username}...`)
            await auth.api.signUpEmail({
                body: {
                    email: user.email,
                    password: user.password,
                    name: user.fullName,
                    username: user.username,
                    role: user.role,
                },
            })
            console.log(`User ${user.username} created successfully.`)
        } catch (error) {
            console.log(`Failed to create user ${user.username}:`, JSON.stringify(error, null, 2))
        }
    }

    console.log('Seeding complete.')
    process.exit(0)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
