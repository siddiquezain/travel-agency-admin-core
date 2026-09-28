"use client";
import { useState, useEffect } from "react";

type TourCategory = { id: number; name: string; slug: string; icon: string | null };

export function useTourCategories() {
    const [categories, setCategories] = useState<TourCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/public/tour-categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { categories, loading };
}
