"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Box, Typography, Stack, Divider, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Plane icon (from design assets) used as the scroll indicator, tinted to the
// given colour and inlined as a data URI so it needs no extra request.
const planeIcon = (color) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.82383 0.0119619C6.87461 0.00600002 6.92558 0.00211009 6.97666 0.000313067C7.33602 -0.0111879 7.62767 0.296125 7.78085 0.60293C8.33767 1.71821 8.17047 3.03613 8.20442 4.24821C8.35884 4.32271 8.71549 4.5696 8.87162 4.67193L10.2966 5.61562L12.9744 7.3807C13.3155 7.60592 13.6594 7.81802 13.9964 8.05055C14.0022 8.3838 13.9991 8.72568 13.9996 9.05966L9.91992 7.92922C9.33204 7.76339 8.64724 7.60707 8.07193 7.41324C8.08538 8.28254 7.97251 9.18676 7.95934 10.0596C7.9518 10.5585 7.94367 11.0564 7.90517 11.5539C7.95328 11.5982 8.00158 11.6494 8.04591 11.6979C8.54098 12.2401 9.0418 12.7766 9.54155 13.3141C9.61855 13.397 9.63465 13.4707 9.64566 13.582C9.65748 13.7014 9.67476 13.8909 9.59757 13.9874C9.49584 14.0119 7.66739 13.1765 7.45885 13.0535C7.41184 13.3523 7.39305 13.4515 7.22636 13.7022C7.15181 13.7847 7.10271 13.8094 7.00938 13.8656C6.69505 13.6836 6.59958 13.4705 6.55812 13.1134C6.09852 13.2955 5.63161 13.538 5.17438 13.7323C5.0057 13.804 4.68262 13.9704 4.51839 14L4.48042 13.9679C4.41602 13.8152 4.43978 13.6296 4.44713 13.4625C4.54377 13.2824 4.74062 13.1113 4.8735 12.9542C5.23676 12.5247 5.75971 12.0601 6.10048 11.6299C6.05042 10.9073 6.04701 10.2558 6.02395 9.53576C6.00149 8.8345 5.92436 8.13091 5.92652 7.42388C5.70886 7.49313 5.46946 7.55673 5.24776 7.61502C3.50341 8.0737 1.76545 8.60129 0.0196403 9.05103C0.000204709 8.70376 -0.00770118 8.3978 0.00940792 8.04933C0.218444 7.871 0.877154 7.47216 1.13846 7.30013L4.54021 5.05021C4.66903 4.96436 5.76951 4.27836 5.77516 4.20629C5.84715 3.28549 5.70925 2.35192 5.93008 1.43525C6.0537 0.922188 6.27828 0.201094 6.82383 0.0119619Z" fill="${color}"/></svg>`,
  )}")`;

const PLANE_SIZE = 12;
const RAIL_WIDTH = 14;
const MAX_HEIGHT = 270; // ~6 rows visible; the rest scroll

// Shared row styling: text row that becomes a solid primary pill on hover.
const itemSx = {
  display: "block",
  px: 1.5,
  py: 1.25,
  borderRadius: "12px",
  color: "text.primary",
  fontSize: "0.95rem",
  fontWeight: 400,
  textDecoration: "none",
  transition: "background-color 0.15s ease, color 0.15s ease",
  "&:hover": {
    bgcolor: "primary.main",
    color: "common.white",
    fontWeight: 600,
  },
};

/**
 * Scroll container with a custom scroll indicator: a plane that flies the
 * full length of a 0.5px rail. The native scrollbar thumb only spans its
 * proportional range, so it's hidden and the plane position is driven from
 * scroll progress instead — 0% scroll = top of the line, 100% = bottom.
 */
function PlaneScrollArea({ children }) {
  const theme = useTheme();
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const planeRef = useRef(null);
  const dragRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);

  const movePlane = () => {
    const el = scrollRef.current;
    const plane = planeRef.current;
    if (!el || !plane) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    const progress = el.scrollTop / maxScroll;
    plane.style.top = `${progress * (el.clientHeight - PLANE_SIZE)}px`;
  };

  // Re-measure when the content resizes too (e.g. an expandable row opens),
  // not just on mount — the rail has to appear/scale to the new height.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const content = contentRef.current;
    if (!el || !content) return;
    const measure = () => {
      setOverflowing(el.scrollHeight - el.clientHeight > 1);
      movePlane();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(content);
    return () => ro.disconnect();
  }, [children]);

  // Dragging the plane scrolls the list: pointer capture keeps the drag
  // alive even when the cursor strays off the rail mid-drag.
  const onPlanePointerDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, startTop: el.scrollTop };
  };
  const onPlanePointerMove = (e) => {
    const drag = dragRef.current;
    const el = scrollRef.current;
    if (!drag || !el) return;
    const travel = el.clientHeight - PLANE_SIZE;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (travel <= 0) return;
    el.scrollTop = drag.startTop + ((e.clientY - drag.startY) / travel) * maxScroll;
  };
  const onPlanePointerEnd = () => {
    dragRef.current = null;
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={scrollRef}
        onScroll={movePlane}
        data-plane-scroll
        sx={{
          maxHeight: MAX_HEIGHT,
          overflowY: "auto",
          // Reaching the top/bottom of the list must not scroll the page
          // behind the dropdown.
          overscrollBehavior: "contain",
          pr: overflowing ? `${RAIL_WIDTH + 6}px` : 0.5,
          // Native scrollbar hidden in all engines; the rail replaces it.
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack
          ref={contentRef}
          spacing={0.25}
          sx={{
            // Hairline separator between destinations.
            "& > *:not(:last-of-type)": {
              borderBottom: "0.3px solid",
              borderBottomColor: "divider",
            },
          }}
        >
          {children}
        </Stack>
      </Box>

      {overflowing && (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: RAIL_WIDTH,
            pointerEvents: "none", // the plane re-enables its own events
            // The 0.5px guide line the plane travels along.
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "0.5px",
              transform: "translateX(-50%)",
              bgcolor: "divider",
            },
          }}
        >
          <Box
            ref={planeRef}
            onPointerDown={onPlanePointerDown}
            onPointerMove={onPlanePointerMove}
            onPointerUp={onPlanePointerEnd}
            onPointerCancel={onPlanePointerEnd}
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: PLANE_SIZE,
              height: PLANE_SIZE,
              backgroundImage: planeIcon(theme.palette.primary.main),
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              pointerEvents: "auto",
              cursor: "grab",
              touchAction: "none",
              userSelect: "none",
              "&:active": { cursor: "grabbing" },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

/**
 * Row that owns a side submenu (e.g. "Visa Services"): looks identical to
 * every other row, plus a right arrow. Hover or click opens the submenu as
 * an extra column beside this one.
 */
function SubmenuRow({ link, open, onOpen, onToggle }) {
  return (
    <Box
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onMouseEnter={onOpen}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      sx={{
        ...itemSx,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        cursor: "pointer",
        userSelect: "none",
        // Stay highlighted like a hovered row while the submenu is open.
        ...(open && {
          bgcolor: "primary.main",
          color: "common.white",
          fontWeight: 600,
        }),
      }}
    >
      {link.name}
      <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
    </Box>
  );
}

/**
 * Presentational desktop mega-menu panel.
 * Styling follows the "dropdown with hover effect" design: rounded card,
 * items become a solid primary pill on hover, title/footer links in brand
 * colour with arrows.
 *
 * @param {{title:string, href?:string, links:{name:string,href:string,children?:{name:string,href:string}[]}[]}[]} columns
 * @param {{name:string, href:string}} [footer]  Optional "view all" link row.
 * @param {() => void} [onNavigate]  Called after a link click (to close the panel).
 */
export default function MegaMenu({ columns = [], footer, onNavigate }) {
  const rootRef = useRef(null);
  // Name of the link whose side submenu is open (e.g. "Visa Services").
  const [expanded, setExpanded] = useState(null);
  const expandedLink = columns
    .flatMap((c) => c.links)
    .find((l) => l.children?.length && l.name === expanded);
  const columnCount = columns.length + (expandedLink ? 1 : 0);

  // Wheel over the panel must never scroll the page behind it. Scrolling
  // inside the destination lists ([data-plane-scroll]) is left alone — their
  // overscroll-behavior already stops chaining; everywhere else the default
  // (page) scroll is cancelled. Native listener because React registers
  // wheel handlers as passive, where preventDefault is a no-op.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.target instanceof Element && e.target.closest("[data-plane-scroll]")) return;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <Box
      ref={rootRef}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderRadius: "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        overflow: "hidden",
        minWidth: 320,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(columnCount, 4)}, minmax(200px, 1fr))`,
          gap: { lg: 4, xl: 5 },
          px: 3,
          pt: 3,
          pb: 2,
        }}
      >
        {columns.map((col, colIdx) => (
          <Box key={col.title || colIdx}>
            {!col.title ? null : col.href ? (
              <Box
                component={Link}
                href={col.href}
                onClick={onNavigate}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  mb: 1.5,
                  px: 1.5,
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  "&:hover": { color: "primary.dark" },
                }}
              >
                {col.title}
                <ArrowForwardIcon sx={{ fontSize: 15 }} />
              </Box>
            ) : (
              <Typography
                sx={{
                  mb: 1.5,
                  px: 1.5,
                  color: "text.secondary",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {col.title}
              </Typography>
            )}

            <PlaneScrollArea>
              {col.links.length === 0 ? (
                <Typography variant="body2" color="text.disabled" sx={{ px: 1.5 }}>
                  Coming soon
                </Typography>
              ) : (
                col.links.map((l) =>
                  l.children?.length ? (
                    <SubmenuRow
                      key={l.name + l.href}
                      link={l}
                      open={expanded === l.name}
                      onOpen={() => setExpanded(l.name)}
                      onToggle={() =>
                        setExpanded((cur) => (cur === l.name ? null : l.name))
                      }
                    />
                  ) : (
                    <Box
                      key={l.name + l.href}
                      component={Link}
                      href={l.href}
                      onClick={onNavigate}
                      onMouseEnter={() => setExpanded(null)}
                      sx={itemSx}
                    >
                      {l.name}
                    </Box>
                  ),
                )
              )}
            </PlaneScrollArea>
          </Box>
        ))}

        {/* Side submenu: an extra column identical to the others, opened by
            the row that owns it (e.g. Visa Services → visa types). */}
        {expandedLink && (
          <Box>
            <Box
              component={Link}
              href={expandedLink.href}
              onClick={onNavigate}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                mb: 1.5,
                px: 1.5,
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                textDecoration: "none",
                "&:hover": { color: "primary.dark" },
              }}
            >
              {expandedLink.name}
              <ArrowForwardIcon sx={{ fontSize: 15 }} />
            </Box>
            <PlaneScrollArea>
              {expandedLink.children.map((child) => (
                <Box
                  key={child.name + child.href}
                  component={Link}
                  href={child.href}
                  onClick={onNavigate}
                  sx={itemSx}
                >
                  {child.name}
                </Box>
              ))}
            </PlaneScrollArea>
          </Box>
        )}
      </Box>

      {footer && (
        <>
          <Divider sx={{ mx: 3 }} />
          <Box sx={{ px: 3, py: 2 }}>
            <Box
              component={Link}
              href={footer.href}
              onClick={onNavigate}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                color: "primary.main",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                transition: "opacity 0.15s ease",
                "&:hover": { opacity: 0.7 },
              }}
            >
              {footer.name}
              <ArrowForwardIcon sx={{ fontSize: 15 }} />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
