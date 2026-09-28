import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/tours/:path*',
        '/api/visas/:path*',
        '/api/attestations/:path*',
        '/api/blog/:path*',
        '/api/countries/:path*',
        '/api/destinations/:path*',
        '/api/visa-types/:path*',
        '/api/attestation-types/:path*',
        '/api/tour-categories/:path*',
        '/api/currencies/:path*',
        '/api/document-types/:path*',
        '/api/service-types/:path*',
        '/api/users/:path*',
        '/api/stats',
        '/api/admin/:path*',
    ],
}
