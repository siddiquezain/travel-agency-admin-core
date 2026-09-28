"use client";

import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import { Youtube } from "@tiptap/extension-youtube";
import { Box, Stack, IconButton, Tooltip, Divider } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import ImageIcon from "@mui/icons-material/Image";
import UploadIcon from "@mui/icons-material/Upload";
import CircularProgress from "@mui/material/CircularProgress";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CodeIcon from "@mui/icons-material/Code";
import TableChartIcon from "@mui/icons-material/TableChart";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import TableRowsIcon from "@mui/icons-material/TableRows";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type Props = {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
};

function ToolbarButton({
    title,
    active,
    disabled,
    onClick,
    children,
}: {
    title: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <Tooltip title={title}>
            <span>
                <IconButton
                    size="small"
                    onClick={onClick}
                    disabled={disabled}
                    sx={{
                        bgcolor: active ? "primary.main" : "transparent",
                        color: active ? "common.white" : "inherit",
                        borderRadius: 1,
                        "&:hover": { bgcolor: active ? "primary.dark" : "action.hover" },
                    }}
                >
                    {children}
                </IconButton>
            </span>
        </Tooltip>
    );
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false, autolink: true }),
            Image,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Youtube.configure({ nocookie: true, controls: true, width: 640, height: 360 }),
        ],
        content: value || "",
        immediatelyRender: false,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "tiptap-content",
                "data-placeholder": placeholder ?? "",
            },
        },
    });

    // Keep editor content in sync when parent value changes (e.g. opening modal for a different post)
    useEffect(() => {
        if (!editor) return;
        if (editor.getHTML() !== (value || "")) {
            editor.commands.setContent(value || "", { emitUpdate: false });
        }
    }, [value, editor]);

    // Raw-HTML editing mode. The textarea binds directly to `value`; the sync
    // effect above keeps the (hidden) TipTap editor in step on every keystroke,
    // so toggling back to the visual editor needs no extra work.
    const [htmlMode, setHtmlMode] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    if (!editor) return null;

    const setLink = () => {
        const previous = editor.getAttributes("link").href ?? "";
        const url = window.prompt("URL", previous);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt("Image URL");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const uploadImage = async (file: File) => {
        setUploadError("");
        setUploading(true);
        const fd = new FormData();
        fd.append("category", "blog");
        fd.append("files", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) {
                setUploadError(data.error || "Upload failed");
            } else if (data.urls?.[0]) {
                editor.chain().focus().setImage({ src: data.urls[0] }).run();
            }
        } catch {
            setUploadError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const insertTable = () =>
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

    const addYoutube = () => {
        const url = window.prompt("YouTube video URL");
        if (url) editor.commands.setYoutubeVideo({ src: url });
    };

    const Btn = ToolbarButton;

    return (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1.5, overflow: "hidden" }}>
            <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
                sx={{
                    p: 1,
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "background.default",
                    flexWrap: "wrap",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flexWrap: "wrap",
                        flex: 1,
                        opacity: htmlMode ? 0.4 : 1,
                        pointerEvents: htmlMode ? "none" : "auto",
                    }}
                >
                <Btn
                    title="Bold"
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <FormatBoldIcon fontSize="small" />
                </Btn>
                <Btn
                    title="Italic"
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <FormatItalicIcon fontSize="small" />
                </Btn>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <Btn
                    title="Heading 2"
                    active={editor.isActive("heading", { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Box component="span" sx={{ fontWeight: 700, px: 0.5 }}>H2</Box>
                </Btn>
                <Btn
                    title="Heading 3"
                    active={editor.isActive("heading", { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Box component="span" sx={{ fontWeight: 700, px: 0.5 }}>H3</Box>
                </Btn>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <Btn
                    title="Bullet list"
                    active={editor.isActive("bulletList")}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <FormatListBulletedIcon fontSize="small" />
                </Btn>
                <Btn
                    title="Numbered list"
                    active={editor.isActive("orderedList")}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <FormatListNumberedIcon fontSize="small" />
                </Btn>
                <Btn
                    title="Blockquote"
                    active={editor.isActive("blockquote")}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <FormatQuoteIcon fontSize="small" />
                </Btn>
                <Btn
                    title="Horizontal rule"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <HorizontalRuleIcon fontSize="small" />
                </Btn>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <Btn title="Link" active={editor.isActive("link")} onClick={setLink}>
                    <LinkIcon fontSize="small" />
                </Btn>
                <Btn
                    title="Remove link"
                    disabled={!editor.isActive("link")}
                    onClick={() => editor.chain().focus().unsetLink().run()}
                >
                    <LinkOffIcon fontSize="small" />
                </Btn>
                <Btn title="Insert image (URL)" onClick={addImage}>
                    <ImageIcon fontSize="small" />
                </Btn>
                <Btn
                    title="Upload image"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <CircularProgress size={18} />
                    ) : (
                        <UploadIcon fontSize="small" />
                    )}
                </Btn>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    style={{ display: "none" }}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file);
                    }}
                />
                <Btn title="Insert table" onClick={insertTable}>
                    <TableChartIcon fontSize="small" />
                </Btn>
                <Btn title="Embed YouTube video" onClick={addYoutube}>
                    <OndemandVideoIcon fontSize="small" />
                </Btn>
                {editor.isActive("table") && (
                    <>
                        <Btn
                            title="Add column"
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                        >
                            <ViewColumnIcon fontSize="small" />
                        </Btn>
                        <Btn
                            title="Add row"
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                        >
                            <TableRowsIcon fontSize="small" />
                        </Btn>
                        <Btn
                            title="Delete table"
                            onClick={() => editor.chain().focus().deleteTable().run()}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </Btn>
                    </>
                )}
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <Btn
                    title="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <UndoIcon fontSize="small" />
                </Btn>
                <Btn
                    title="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <RedoIcon fontSize="small" />
                </Btn>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <Btn
                    title={htmlMode ? "Back to visual editor" : "Edit HTML source"}
                    active={htmlMode}
                    onClick={() => setHtmlMode((v) => !v)}
                >
                    <CodeIcon fontSize="small" />
                </Btn>
            </Stack>

            {uploadError && (
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        bgcolor: "error.light",
                        color: "error.contrastText",
                        fontSize: 13,
                    }}
                >
                    {uploadError}
                </Box>
            )}

            {htmlMode ? (
                <Box sx={{ p: 0 }}>
                    <textarea
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        spellCheck={false}
                        placeholder="<p>Edit raw HTML…</p>"
                        style={{
                            width: "100%",
                            minHeight: 320,
                            boxSizing: "border-box",
                            border: "none",
                            outline: "none",
                            resize: "vertical",
                            padding: 16,
                            fontFamily:
                                "ui-monospace, SFMono-Regular, Menlo, monospace",
                            fontSize: 13,
                            lineHeight: 1.6,
                            background: "transparent",
                            color: "inherit",
                        }}
                    />
                </Box>
            ) : (
            <Box
                sx={{
                    p: 2,
                    minHeight: 320,
                    "& .tiptap-content": { outline: "none", minHeight: 280 },
                    "& .tiptap-content p.is-editor-empty:first-of-type::before": {
                        content: "attr(data-placeholder)",
                        color: "text.disabled",
                        float: "left",
                        height: 0,
                        pointerEvents: "none",
                    },
                    "& h1, & h2, & h3, & h4": { fontWeight: 700, mt: 2, mb: 1 },
                    "& h2": { fontSize: "1.5rem" },
                    "& h3": { fontSize: "1.25rem" },
                    "& p": { mb: 1.5, lineHeight: 1.7 },
                    "& ul, & ol": { pl: 3, mb: 1.5 },
                    "& blockquote": {
                        borderLeft: 4,
                        borderColor: "primary.main",
                        pl: 2,
                        color: "text.secondary",
                        fontStyle: "italic",
                    },
                    "& a": { color: "primary.main", textDecoration: "underline" },
                    "& img": { maxWidth: "100%", height: "auto", borderRadius: 1 },
                    "& .tableWrapper": { overflowX: "auto", my: 2 },
                    "& table": {
                        borderCollapse: "collapse",
                        width: "100%",
                        tableLayout: "fixed",
                        "& td, & th": {
                            border: 1,
                            borderColor: "divider",
                            p: 1,
                            minWidth: 60,
                            verticalAlign: "top",
                            position: "relative",
                        },
                        "& th": { bgcolor: "action.hover", fontWeight: 700, textAlign: "left" },
                        "& .selectedCell": { bgcolor: "action.selected" },
                    },
                    "& div[data-youtube-video]": { my: 2 },
                    "& iframe": {
                        width: "100%",
                        aspectRatio: "16 / 9",
                        height: "auto",
                        maxWidth: "100%",
                        border: 0,
                        borderRadius: 1,
                    },
                }}
            >
                <EditorContent editor={editor} />
            </Box>
            )}
        </Box>
    );
}
