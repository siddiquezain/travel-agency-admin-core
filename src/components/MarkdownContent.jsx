"use client";
import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ gfm: true, breaks: true });

export default function MarkdownContent({ content, sx }) {
    const html = useMemo(() => {
        const src = (content ?? "").toString();
        if (!src.trim()) return "";
        const rendered = marked.parse(src);
        return typeof window !== "undefined" ? DOMPurify.sanitize(rendered) : rendered;
    }, [content]);

    if (!html) return null;

    return (
        <Box
            dangerouslySetInnerHTML={{ __html: html }}
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
                "& ul li": { listStyleType: "disc" },
                "& ol li": { listStyleType: "decimal" },
                "& a": {
                    color: "primary.main",
                    textDecoration: "underline",
                    "&:hover": { color: "primary.dark" },
                },
                "& strong, & b": { color: "text.primary", fontWeight: 700 },
                "& em, & i": { fontStyle: "italic" },
                "& img": {
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: 2,
                    my: 2,
                    display: "block",
                },
                "& blockquote": {
                    borderLeft: 4,
                    borderColor: "primary.light",
                    pl: 2,
                    py: 0.5,
                    my: 2,
                    color: "text.secondary",
                    fontStyle: "italic",
                    bgcolor: "action.hover",
                    borderRadius: 1,
                },
                "& code": {
                    bgcolor: "action.hover",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 0.5,
                    fontFamily: "monospace",
                    fontSize: "0.9em",
                },
                "& pre": {
                    bgcolor: "action.hover",
                    p: 2,
                    borderRadius: 2,
                    overflow: "auto",
                    my: 2,
                    "& code": { bgcolor: "transparent", p: 0 },
                },
                "& hr": {
                    border: 0,
                    borderTop: 1,
                    borderColor: "divider",
                    my: 3,
                },
                "& table": {
                    width: "100%",
                    borderCollapse: "collapse",
                    my: 2,
                    "& th, & td": {
                        border: 1,
                        borderColor: "divider",
                        px: 1.5,
                        py: 1,
                        textAlign: "left",
                    },
                    "& th": { bgcolor: "action.hover", fontWeight: 600 },
                },
                ...sx,
            }}
        />
    );
}
