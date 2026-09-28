"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import { MapPin, Clock, Star, Globe, Heart } from "lucide-react";

export default function DestinationCard({ destination }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [liked, setLiked] = useState(false);
  const location = [destination.region, destination.country?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="relative h-full">
      <Link
        href={`/destinations/${destination.slug}`}
        className={`group h-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}
      >
        {/* Photo */}
        <div className="relative h-52 flex-shrink-0 bg-gray-200">
          {destination.heroImage ? (
            <img
              src={destination.heroImage}
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A428A] to-[#2AB0E5]">
              <Globe size={56} className="text-white/85" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {destination.bestTimeShort && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <Clock size={11} strokeWidth={2.5} />
              <span>{destination.bestTimeShort}</span>
            </div>
          )}

          {destination.featured && (
            <div className="absolute top-3 right-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <Star size={11} className="fill-amber-400 text-amber-400" strokeWidth={2} />
              <span>Featured</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <h3
              className={`font-bold text-base leading-tight ${
                isDark ? "text-slate-100" : "text-gray-900"
              }`}
            >
              {destination.name}
            </h3>
            {location && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} className="text-[#2AB0E5] flex-shrink-0" strokeWidth={2.5} />
                <span className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  {location}
                </span>
              </div>
            )}
          </div>

          {destination.description && (
            <p
              className={`text-sm leading-relaxed line-clamp-3 ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {destination.description}
            </p>
          )}

          {destination.country?.name && (
            <div className="flex flex-wrap gap-1.5">
              <div
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                  isDark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"
                }`}
              >
                <Globe size={10} strokeWidth={2} />
                <span>{destination.country.name}</span>
              </div>
            </div>
          )}

          <span className="mt-auto w-full bg-[#1A428A] group-hover:bg-[#2AB0E5] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150 text-center">
            Explore Guide
          </span>
        </div>
      </Link>

      <button
        type="button"
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => setLiked((v) => !v)}
        className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
      >
        <Heart
          size={14}
          strokeWidth={2}
          className={liked ? "fill-rose-500 text-rose-500" : "text-gray-400"}
        />
      </button>
    </div>
  );
}
