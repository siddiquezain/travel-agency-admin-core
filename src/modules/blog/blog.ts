/**
 * Shared publish-gating logic for blog posts.
 *
 * A blog post is publicly visible only when BOTH conditions hold:
 *   1. `isActive` is true  — the admin has not left it as a draft, and
 *   2. `publishedAt` has arrived — the scheduled publish instant is now or in the past.
 *
 * `publishedAt` is stored in UTC (Prisma persists `DateTime` as UTC). `new Date()`
 * evaluates to the server's current instant, which JS also represents in UTC, so the
 * comparison is timezone-safe regardless of the admin's or visitor's local timezone.
 *
 * A NULL `publishedAt` is treated as "not scheduled" and therefore never public —
 * the admin UI always sends a publish date, so this only affects intentional drafts.
 */

/**
 * Prisma `where` fragment that matches only posts that are live *right now*.
 * Must be called per-request so `new Date()` reflects the current time.
 *
 * Note: Prisma's `lte` comparison already excludes NULL `publishedAt` rows, so a
 * future-dated or unset post can never leak through a query that spreads this in.
 */
export function publishedBlogWhere() {
    return {
        isActive: true,
        publishedAt: { lte: new Date() },
    };
}

/** True when a post object (with `isActive` + `publishedAt`) is live right now. */
export function isBlogPostPublished(post: {
    isActive: boolean;
    publishedAt: Date | string | null;
}): boolean {
    if (!post.isActive || !post.publishedAt) return false;
    const publishAt =
        typeof post.publishedAt === "string"
            ? new Date(post.publishedAt)
            : post.publishedAt;
    return !Number.isNaN(publishAt.getTime()) && publishAt.getTime() <= Date.now();
}
