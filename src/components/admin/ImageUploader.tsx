"use client";
import React, { useCallback, useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

type Props = {
    images: string[];
    onChange: (images: string[]) => void;
    category: "tours" | "visas" | "attestations" | "hero" | "blog" | "destinations";
    maxFiles?: number;
};

export function ImageUploader({ images, onChange, category, maxFiles = 10 }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [dragOver, setDragOver] = useState(false);

    const upload = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files);
        if (!fileArray.length) return;

        if (images.length + fileArray.length > maxFiles) {
            setError(`Maximum ${maxFiles} images allowed`);
            return;
        }

        setUploading(true);
        setError("");

        const fd = new FormData();
        fd.append("category", category);
        fileArray.forEach(f => fd.append("files", f));

        try {
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Upload failed");
            } else {
                onChange([...images, ...data.urls]);
            }
        } catch {
            setError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }, [images, onChange, category, maxFiles]);

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
    }

    function remove(idx: number) {
        onChange(images.filter((_, i) => i !== idx));
    }

    return (
        <div className="space-y-3">
            {/* Drop zone */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors ${
                    dragOver
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-300 hover:border-emerald-400 hover:bg-slate-50"
                }`}
            >
                {uploading ? (
                    <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                ) : (
                    <Upload className="h-8 w-8 text-slate-400" />
                )}
                <p className="text-sm text-slate-600">
                    {uploading ? "Uploading..." : "Click or drag images here"}
                </p>
                <p className="text-xs text-slate-400">JPEG, PNG, WebP, GIF (max 5MB each)</p>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={e => e.target.files && upload(e.target.files)}
                />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Thumbnails */}
            {images.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((url, i) => (
                        <div key={url + i} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of arbitrary uploaded image URLs */}
                            <img
                                src={url}
                                alt={`Image ${i + 1}`}
                                className="w-full h-full object-cover"
                                onError={e => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                                }}
                            />
                            <div className="hidden absolute inset-0 flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-slate-300" />
                            </div>
                            {i === 0 && (
                                <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    HERO
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
