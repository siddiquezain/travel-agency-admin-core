"use client";
import { useState, useEffect } from "react";

type Destination = { id: number; name: string; slug: string; country: { name: string; code: string } };

export function useDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/public/destinations")
            .then(res => res.json())
            .then(data => setDestinations(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { destinations, loading };
}
