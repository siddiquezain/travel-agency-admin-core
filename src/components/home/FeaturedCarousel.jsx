"use client";
import React, { useRef } from "react";
import { Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import ServiceCard from "../../components/ServiceCard";

// Continuous marquee: autoplay delay 0 + a long linear transition makes the
// slides glide left at a constant speed instead of stepping slide-by-slide.
const MARQUEE_SPEED = 7000; // ms it takes one slide-width to scroll past

export default function FeaturedCarousel({
  items,
  type,
  variant,
  autoplay,
  loop,
  pauseOnHover,
  slidesPerViewDesktop,
  onSwiper,
}) {
  const swiperRef = useRef(null);
  const marquee = autoplay && items.length >= 2;

  // Swiper's loop mode needs more slides than are visible at once, so short
  // lists (e.g. 3 Umrah packages with 3 per view) are repeated until the
  // marquee has room to glide seamlessly.
  let slides = items;
  if (marquee && items.length <= slidesPerViewDesktop * 2) {
    slides = [];
    while (slides.length <= slidesPerViewDesktop * 2) slides = slides.concat(items);
  }

  // Swiper's own pauseOnMouseEnter lets the in-flight transition finish
  // (several seconds at marquee speed) before pausing. Instead, freeze the
  // track at its exact current pixel position the moment the mouse enters.
  const handlePointerEnter = (e) => {
    if (e.pointerType !== "mouse" || !marquee || !pauseOnHover) return;
    const s = swiperRef.current;
    if (!s || s.destroyed) return;
    s.autoplay.stop();
    s.translateTo(s.getTranslate(), 0);
    // Cancelling the CSS transition means its transitionend never fires, so
    // Swiper's `animating` flag stays true — and with loop enabled,
    // slideNext() silently refuses to move (loopPreventsSliding), leaving the
    // marquee dead after the mouse leaves. Clear it by hand.
    s.animating = false;
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType !== "mouse" || !marquee || !pauseOnHover) return;
    const s = swiperRef.current;
    if (!s || s.destroyed || s.autoplay.running) return;
    s.autoplay.start();
  };

  return (
    <Box
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      sx={{
        "& .swiper": { pb: { xs: 2, md: 3 }, overflow: "visible" },
        "& .swiper-slide": { height: "auto" },
        "& .swiper-slide > *": { height: "100%" },
        // Constant-speed glide; without this the default ease makes the
        // marquee pulse (speed up / slow down) on every slide boundary.
        ...(marquee && {
          "& .swiper-wrapper": { transitionTimingFunction: "linear" },
        }),
      }}
    >
      <Swiper
        modules={[Autoplay, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          600: { slidesPerView: 2, spaceBetween: 24 },
          900: { slidesPerView: slidesPerViewDesktop, spaceBetween: 32 },
        }}
        speed={marquee ? MARQUEE_SPEED : 600}
        autoplay={
          marquee
            ? { delay: 0, disableOnInteraction: false, pauseOnMouseEnter: false }
            : false
        }
        loop={loop && slides.length > slidesPerViewDesktop}
        onSwiper={(s) => {
          swiperRef.current = s;
          onSwiper?.(s);
        }}
        a11y={{ enabled: true }}
      >
        {slides.map((item, i) => (
          <SwiperSlide key={`${item.id}-${i}`}>
            <ServiceCard item={item} type={type} variant={variant} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
