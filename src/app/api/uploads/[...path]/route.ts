import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MIME_TYPES: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
};

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const segments = await params;
    const safePath = segments.path.map(s => s.replace(/\.\./g, "")).join("/");
    const filePath = path.join(UPLOAD_DIR, safePath);

    if (!filePath.startsWith(UPLOAD_DIR)) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    try {
        const fileStat = await stat(filePath);
        if (!fileStat.isFile()) throw new Error("Not a file");

        const ext = path.extname(filePath).slice(1).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";
        const buffer = await readFile(filePath);

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new NextResponse("Not found", { status: 404 });
    }
}
