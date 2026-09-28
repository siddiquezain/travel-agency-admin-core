// src/core/auth/nextauth.ts
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/core/lib/prisma'
import bcrypt from 'bcryptjs'
import { isLockedOut, recordFailure, clearFailures } from '@/core/auth/login-rate-limit'

const sessionMaxAge = 60 * 60 * 8 // 8 hours

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email:    { label: 'Email',    type: 'email',    placeholder: 'admin@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('[auth] login failed: missing credentials')
                    return null
                }

                const xff = req?.headers?.['x-forwarded-for']
                const ip  = (Array.isArray(xff) ? xff[0] : xff)?.split(',')[0].trim() || 'unknown'
                const emailKey = `email:${credentials.email.toLowerCase()}`
                const ipKey    = `ip:${ip}`

                if (isLockedOut(emailKey) || isLockedOut(ipKey)) {
                    console.warn('[auth] login blocked: too many failed attempts', { ip })
                    return null
                }

                const user = await prisma.user.findUnique({ where: { email: credentials.email } })

                if (!user) {
                    recordFailure(emailKey)
                    recordFailure(ipKey)
                    console.log('[auth] login failed')
                    return null
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

                if (!isPasswordValid) {
                    recordFailure(emailKey)
                    recordFailure(ipKey)
                    console.log('[auth] login failed')
                    return null
                }

                clearFailures(emailKey)
                clearFailures(ipKey)

                return { id: user.id.toString(), email: user.email, name: user.name, role: user.role }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt', maxAge: sessionMaxAge },
    jwt: { maxAge: sessionMaxAge },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = (user as { role?: string }).role
            return token
        },
        async session({ session, token }) {
            if (token?.sub)  (session.user as { id?: string }).id     = token.sub
            if (token?.role) (session.user as { role?: string }).role = token.role as string
            return session
        },
    },
    pages: { signIn: '/login' },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
