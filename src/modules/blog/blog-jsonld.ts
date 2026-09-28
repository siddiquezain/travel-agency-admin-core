const SITE_URL = "https://origintoursandtravels.com";
const SITE_NAME = "Origin Tours and Travels";

function absoluteUrl(maybeRelative: string | null | undefined): string | null {
    if (!maybeRelative) return null;
    if (maybeRelative.startsWith("http")) return maybeRelative;
    return `${SITE_URL}${maybeRelative.startsWith("/") ? "" : "/"}${maybeRelative}`;
}

export function blogPostingJsonLd(args: {
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    publishedAt?: Date | string | null;
    updatedAt?: Date | string | null;
    authorName?: string | null;
}) {
    const url = `${SITE_URL}/travel-resources/${args.slug}`;
    const image = absoluteUrl(args.featuredImage) ?? `${SITE_URL}/og-default.jpg`;
    const datePublished = args.publishedAt ? new Date(args.publishedAt).toISOString() : undefined;
    const dateModified = args.updatedAt
        ? new Date(args.updatedAt).toISOString()
        : datePublished;

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: args.title.slice(0, 110),
        ...(args.excerpt ? { description: args.excerpt.slice(0, 280) } : {}),
        image,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        author: args.authorName
            ? { "@type": "Person", name: args.authorName }
            : { "@type": "Organization", name: SITE_NAME },
        publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/og-default.jpg`,
            },
        },
    };
}
