"use client";
import React, { useMemo } from "react";
import { Box } from "@mui/material";
import DOMPurify from "dompurify";

// Only allow embedded iframes from these video hosts. Any other iframe src is
// stripped to prevent XSS / clickjacking via injected embeds.
const ALLOWED_IFRAME_HOSTS =
    /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

// Register the iframe allowlist hook once (DOMPurify is a singleton). Guarded by
// `window` so it never runs during SSR where DOMPurify has no DOM to operate on.
if (typeof window !== "undefined" && !window.__rhcIframeHook) {
    DOMPurify.addHook("uponSanitizeElement", (node, data) => {
        if (data.tagName === "iframe") {
            const src = node.getAttribute("src") || "";
            if (!ALLOWED_IFRAME_HOSTS.test(src)) node.parentNode?.removeChild(node);
        }
    });
    window.__rhcIframeHook = true;
}

// Sanitised renderer for HTML produced by the admin TipTap editor.
// Mirrors MarkdownContent's styling so the article body looks the same
// whichever source the content came from.
export default function RichHtmlContent({ html, sx }) {
    const safe = useMemo(() => {
        const src = (html ?? "").toString();
        if (!src.trim()) return "";
        if (typeof window === "undefined") return src;
        return DOMPurify.sanitize(src, {
            ADD_TAGS: ["iframe"],
            ADD_ATTR: [
                "allow",
                "allowfullscreen",
                "frameborder",
                "scrolling",
                "data-youtube-video",
            ],
        });
    }, [html]);

    if (!safe) return null;

    return (
        <Box
            dangerouslySetInnerHTML={{ __html: safe }}
            sx={{
                color: "text.secondary",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                wordBreak: "break-word",
                "& h1, & h2, & h3, & h4": {
                    color: "text.primary",
                    fontWeight: 700,
                    mt: 3,
                    mb: 1.5,
                    lineHeight: 1.3,
                },
                "& h1": { fontSize: { xs: "1.5rem", md: "1.75rem" } },
                "& h2": { fontSize: { xs: "1.3rem", md: "1.5rem" } },
                "& h3": { fontSize: { xs: "1.15rem", md: "1.25rem" } },
                "& h4": { fontSize: "1.1rem" },
                "& p": { mb: 2 },
                "& ul, & ol": { pl: 3.5, mb: 2.5 },
                "& li": { mb: 0.75 },
                "& a": {
                    color: "primary.main",
                    textDecoration: "underline",
                    "&:hover": { color: "primary.dark" },
                },
                "& blockquote": {
                    borderLeft: 4,
                    borderColor: "primary.main",
                    pl: 2,
                    py: 0.5,
                    my: 2,
                    color: "text.secondary",
                    fontStyle: "italic",
                },
                "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: 1.5,
                    my: 2,
                },
                "& .tableWrapper": { overflowX: "auto", my: 2.5 },
                "& table": {
                    borderCollapse: "collapse",
                    width: "100%",
                    "& td, & th": {
                        border: 1,
                        borderColor: "divider",
                        p: 1.25,
                        verticalAlign: "top",
                    },
                    "& th": { bgcolor: "action.hover", fontWeight: 700, textAlign: "left" },
                },
                "& div[data-youtube-video], & iframe": { my: 2.5 },
                "& iframe": {
                    width: "100%",
                    aspectRatio: "16 / 9",
                    height: "auto",
                    maxWidth: "100%",
                    border: 0,
                    borderRadius: 1.5,
                    display: "block",
                },
                "& code": {
                    bgcolor: "action.hover",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.5,
                    fontSize: "0.95em",
                },
                "& pre": {
                    bgcolor: "grey.900",
                    color: "common.white",
                    p: 2,
                    borderRadius: 1.5,
                    overflowX: "auto",
                    mb: 2,
                    "& code": { bgcolor: "transparent", color: "inherit", p: 0 },
                },
                ...sx,
            }}
        />
    );
}
