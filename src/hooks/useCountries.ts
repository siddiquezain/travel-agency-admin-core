"use client";
import { useState, useEffect } from "react";

type Country = { id: number; name: string; code: string; flag: string | null };

export function useCountries() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/public/countries")
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return { countries, loading };
}
