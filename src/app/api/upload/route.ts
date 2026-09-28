import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
    const { error } = await requireSession();
    if (error) return error;

    const formData = await request.formData();
    const category = formData.get("category") as string;
    const files = formData.getAll("files") as File[];

    if (!["tours", "visas", "attestations", "hero", "blog", "destinations"].includes(category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (!files.length) {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const dir = path.join(UPLOAD_DIR, category);
    await mkdir(dir, { recursive: true });

    const urls: string[] = [];
    for (const file of files) {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF` }, { status: 400 });
        }
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: `File too large: ${file.name} (max 5MB)` }, { status: 400 });
        }

        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(dir, filename), buffer);
        urls.push(`/api/uploads/${category}/${filename}`);
    }

    return NextResponse.json({ urls });
}
