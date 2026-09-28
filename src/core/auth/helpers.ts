// src/core/auth/helpers.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/core/auth/nextauth'
import { NextResponse } from 'next/server'

export async function requireSession() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    }
    return { session, error: null }
}

export function toSlug(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function makeSlug(str: string): string {
    return `${toSlug(str)}-${Date.now().toString(36)}`
}

export function resolveSlug(input: string | undefined | null, fallback: string): string {
    const cleaned = (input ?? '').trim()
    return cleaned ? toSlug(cleaned) : makeSlug(fallback)
}

export function parseId(raw: string): number | null {
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : null
}

export function invalidIdResponse() {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
}

export function prismaErrorResponse(e: unknown): NextResponse | null {
    const code = (e as { code?: string })?.code
    if (code === 'P2002') return NextResponse.json({ error: 'Already exists' },              { status: 409 })
    if (code === 'P2025') return NextResponse.json({ error: 'Not found' },                   { status: 404 })
    if (code === 'P2003') return NextResponse.json({ error: 'Referenced record missing' },   { status: 400 })
    return null
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Partial<T> {
    const out: Partial<T> = {}
    for (const k of keys) {
        if (k in obj && obj[k] !== undefined) out[k] = obj[k]
    }
    return out
}
