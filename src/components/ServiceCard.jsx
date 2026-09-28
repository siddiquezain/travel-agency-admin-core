"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import {
  MapPin,
  Star,
  Clock,
  Heart,
  Plane,
  Hotel,
  ShieldCheck,
  Calendar,
  FileCheck,
  Compass,
} from "lucide-react";
import { formatVisaFeeShort } from "../lib/tour-utils";

// Local assets for placeholders
import tourPlaceholder from "../assets/images/hero/tours_hero.png";
import visaPlaceholder from "../assets/images/hero/visas_hero.png";
import attestPlaceholder from "../assets/images/hero/attestations_hero.png";

// Umrah Islamic Luxury Design Palette
const umrahPalette = {
  emerald: "#065F46",
  emeraldDark: "#064E3B",
  gold: "#D4AF37",
};

const BRAND_BLUE = "#1A428A";
const BRAND_CYAN = "#2AB0E5";

const toNumber = (value) => {
  if (value === null || value === undefined) return null;
  // First number in the string ("AED 370 (~₹8,500)" → 370), commas allowed.
  const match = String(value).match(/[0-9][0-9,]*(?:\.[0-9]+)?/);
  if (!match) return null;
  const n = parseFloat(match[0].replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
};

const featureIcon = (feature) => {
  const lower = feature.toLowerCase();
  if (lower.includes("flight") || lower.includes("air") || lower.includes("ticket"))
    return Plane;
  if (lower.includes("hotel") || lower.includes("stay") || lower.includes("accommodation"))
    return Hotel;
  return Compass;
};

const ServiceCard = ({ item, type = "tour", variant }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isUmrah = variant === "umrah";
  const [liked, setLiked] = useState(false);

  const getValues = () => {
    if (type === "tour") {
      const details = item.tourDetails ?? {};
      const priceNum = toNumber(details.price);
      const originalNum = toNumber(details.originalPrice);
      return {
        title: item.title,
        image: item.featuredImage?.node?.sourceUrl || tourPlaceholder,
        price: priceNum ? `₹${priceNum.toLocaleString("en-IN")}` : null,
        priceNum,
        originalPrice: originalNum ? `₹${originalNum.toLocaleString("en-IN")}` : null,
        originalNum,
        duration: details.durationDaysNights,
        rating: details.rating,
        reviews: details.reviewsCount,
        link: `/tours/${item.slug}`,
        location: details.holidayCountry?.nodes?.[0]?.name || (isUmrah ? "Saudi Arabia" : null),
        tags: (details.features || []).slice(0, 2).map((f) => ({ label: f, icon: featureIcon(f) })),
        cta: "Explore Trip",
      };
    } else if (type === "visa") {
      const details = item.visaDetails ?? {};
      const tags = [];
      const visaType = item.visasType?.nodes?.[0]?.name;
      if (visaType) tags.push({ label: `${visaType} Visa`, icon: FileCheck });
      if (details.validityDuration)
        tags.push({ label: `Valid ${details.validityDuration}`, icon: Calendar });
      return {
        title: item.title,
        image: item.featuredImage?.node?.sourceUrl || visaPlaceholder,
        price: details.fees ? formatVisaFeeShort(details.fees) : null,
        priceNum: toNumber(details.fees),
        originalPrice: details.originalFee ? formatVisaFeeShort(details.originalFee) : null,
        originalNum: toNumber(details.originalFee),
        duration: details.processingTime,
        rating: details.rating,
        reviews: details.reviewsCount,
        link: `/visas/${item.slug}`,
        location: item.countries?.nodes?.[0]?.name,
        tags,
        cta: "Explore Visa",
      };
    } else if (type === "attestation") {
      const details = item.attestations ?? {};
      return {
        title: item.title,
        image: item.featuredImage?.node?.sourceUrl || attestPlaceholder,
        price: details.price ? formatVisaFeeShort(details.price) : null,
        priceNum: toNumber(details.price),
        originalPrice: details.originalFee ? formatVisaFeeShort(details.originalFee) : null,
        originalNum: toNumber(details.originalFee),
        duration: "2–5 Days",
        rating: details.rating,
        reviews: details.reviewsCount,
        link: `/attestations/${item.slug}`,
        location: item.countries?.nodes?.[0]?.name || "Global",
        tags: [{ label: "Ministry Verified", icon: ShieldCheck }],
        cta: "Explore Service",
      };
    }
    return {};
  };

  const {
    title,
    image,
    price,
    priceNum,
    originalPrice,
    originalNum,
    duration,
    rating,
    reviews,
    link,
    location,
    tags = [],
    cta,
  } = getValues();

  const discount =
    priceNum && originalNum && originalNum > priceNum
      ? Math.round((1 - priceNum / originalNum) * 100)
      : null;

  // Umrah cards share the site-wide blue buttons; only the small feature
  // icons keep the gold accent.
  const accent = BRAND_BLUE;
  const accentHover = BRAND_CYAN;

  return (
    <div className="relative h-full">
      <Link
        href={link}
        className={`group h-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${
          isDark ? "bg-slate-800" : "bg-white"
        }`}
      >
        {/* Photo */}
        <div className="relative h-52 flex-shrink-0 bg-gray-200">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {duration && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <Clock size={11} strokeWidth={2.5} />
              <span>{duration}</span>
            </div>
          )}

          {rating != null && (
            <div className="absolute top-3 right-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <Star size={11} className="fill-amber-400 text-amber-400" strokeWidth={2} />
              <span>{Number(rating).toFixed(1)}</span>
              {reviews != null && (
                <span className="text-gray-400 font-normal">({reviews})</span>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <h3
              className={`font-bold text-base leading-tight line-clamp-2 ${
                isDark ? "text-slate-100" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
            {location && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin
                  size={12}
                  className="flex-shrink-0"
                  style={{ color: BRAND_CYAN }}
                  strokeWidth={2.5}
                />
                <span className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                  {location}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {price ? (
              <>
                <span className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>
                  {price}
                </span>
                {originalPrice && (
                  <span className={`text-sm line-through ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                    {originalPrice}
                  </span>
                )}
              </>
            ) : (
              <span className={`text-sm font-semibold ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                Price on request
              </span>
            )}
            {discount != null && (
              <span
                className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
                  isDark ? "text-emerald-400 bg-emerald-950" : "text-emerald-600 bg-emerald-50"
                }`}
              >
                -{discount}%
              </span>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <div
                  key={tag.label}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                    isDark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <tag.icon size={10} strokeWidth={2} />
                  <span>{tag.label}</span>
                </div>
              ))}
            </div>
          )}

          <span
            className="mt-auto w-full text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150 text-center"
            style={{ backgroundColor: accent }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accent)}
          >
            {cta}
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
};

export default ServiceCard;
