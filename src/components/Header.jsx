"use client";
import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Phone from "@mui/icons-material/Phone";
import Close from "@mui/icons-material/Close";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MegaMenu from "./nav/MegaMenu";
import logo from "../assets/images/logo.webp";

const CTA = { label: "Get a Free Quote", href: "/contact" };
const PHONE = "+919177787635";
const PHONE_DISPLAY = "+91 91777 87635";

// Build the mega-menu column config from server-fetched menuData.
function buildMenus(menuData) {
  const d = menuData ?? {};

  return {
    tours: {
      columns: [
        {
          title: "International Tours",
          href: "/tours?scope=international",
          links: d.toursInternational ?? [],
        },
        {
          title: "Domestic Tours",
          href: "/tours?scope=domestic",
          links: d.toursDomestic ?? [],
        },
      ],
      footer: { name: "Browse all tours", href: "/tours" },
    },
    umrah: {
      columns: [
        {
          title: "Umrah Packages",
          href: "/umrah",
          links: [
            { name: "Economy Umrah", href: "/tours/umrah-economy-package-from-hyderabad" },
            { name: "Gold Umrah", href: "/tours/gold-umrah-package-2026" },
            { name: "Executive Umrah", href: "/tours/executive-umrah-package-2026-8-nights" },
            { name: "Deluxe Umrah", href: "/tours/deluxe-umrah-package-2026-8-nights" },
            { name: "VIP Umrah", href: "/tours/vip-umrah-package-2026" },
            { name: "Premium Umrah", href: "/umrah" },
            { name: "Hajj Packages", href: "/umrah" },
            { name: "Makkah & Madinah Ziyarat", href: "/umrah" },
            { name: "Ramadan Umrah", href: "/umrah/ramadan" },
          ],
        },
      ],
      footer: { name: "All Umrah Packages", href: "/umrah" },
    },
    services: {
      columns: [
        {
          title: "",
          links: [
            { name: "Air Ticketing", href: "/flights" },
            {
              name: "Visa Services",
              href: "/visas",
              // Rendered as an expandable row: clicking it unfolds the visa
              // dropdown inline instead of navigating.
              children: [
                { name: "Tourist Visa", href: "/visas?type=Tourist" },
                { name: "Business Visa", href: "/visas?type=Business" },
                { name: "Student Visa", href: "/visas?type=Student" },
                { name: "Transit Visa", href: "/visas?type=Transit" },
                { name: "Certificate Attestation", href: "/attestations" },
              ],
            },
            { name: "Attestations", href: "/attestations" },
            { name: "Hotels Booking", href: "/hotels" },
            { name: "Transport Booking", href: "/contact" },
          ],
        },
      ],
      footer: { name: "Get a Free Quote", href: "/contact" },
    },
  };
}

// Top-level nav. `mega` items open a panel keyed by `key`.
const NAV = [
  { name: "Home", href: "/" },
  { name: "Tours", href: "/tours", mega: "tours" },
  { name: "Umrah", href: "/umrah", mega: "umrah" },
  { name: "Services", href: "/visas", mega: "services" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Header = ({ menuData }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMega, setOpenMega] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  // Horizontal center (viewport px) of the hovered nav button; the mega panel
  // is centred on it. Panel left is measured/clamped after render.
  const [megaAnchorX, setMegaAnchorX] = useState(null);
  const [panelLeft, setPanelLeft] = useState(null);
  const panelRef = useRef(null);
  // Grace period before closing, so brushing just outside the header/panel
  // for a moment doesn't dismiss the menu.
  const closeTimerRef = useRef(null);
  const cancelMegaClose = () => clearTimeout(closeTimerRef.current);
  const scheduleMegaClose = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenMega(null), 200);
  };
  useEffect(() => () => clearTimeout(closeTimerRef.current), []);
  const pathname = usePathname();

  const menus = buildMenus(menuData);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close everything on route change.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- intentional reset on route change */
    setIsMobileMenuOpen(false);
    setOpenMega(null);
    setMobileExpanded(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  // Centre the open panel on the hovered button once its real width is known,
  // clamped so it never bleeds off either screen edge. Runs pre-paint, so the
  // panel is kept invisible until a position has been computed.
  useLayoutEffect(() => {
    if (!openMega || megaAnchorX == null || !panelRef.current) {
      setPanelLeft(null);
      return;
    }
    const margin = 16;
    const width = panelRef.current.offsetWidth;
    const left = Math.max(
      margin,
      Math.min(megaAnchorX - width / 2, window.innerWidth - margin - width),
    );
    setPanelLeft(left);
  }, [openMega, megaAnchorX]);

  const toggleDrawer = useCallback(
    (open) => (event) => {
      if (
        event?.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setIsMobileMenuOpen(open);
    },
    [],
  );

  const isActive = (item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  const navButtonSx = (active) => ({
    color: "common.white",
    bgcolor: "transparent",
    fontWeight: active ? 700 : 600,
    textTransform: "none",
    fontSize: { lg: "0.82rem", xl: "0.92rem" },
    px: { lg: 1.25, xl: 1.75 },
    py: { lg: 0.75, xl: 1 },
    borderRadius: 50,
    boxShadow: "none",
    minWidth: "auto",
    whiteSpace: "nowrap",
    opacity: active ? 1 : 0.9,
    transition: "all 0.25s ease",
    "&:hover": { bgcolor: "rgba(255,255,255,0.12)", opacity: 1 },
  });

  return (
    <AppBar
      position="fixed"
      elevation={0}
      onMouseEnter={cancelMegaClose}
      onMouseLeave={scheduleMegaClose}
      sx={{
        background:
          isScrolled || openMega
            ? "rgba(15, 23, 42, 0.96)"
            : "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        py: isScrolled ? { xs: 0.5, md: 0.75 } : { xs: 1, md: 1.5 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Toolbar
          disableGutters
          sx={{ justifyContent: "space-between", minHeight: { xs: 56, md: 64 } }}
        >
          {/* Logo */}
          <Box
            component={Link}
            href="/"
            sx={{ display: "flex", alignItems: "center", flexShrink: 0, mr: { lg: 2, xl: 3 } }}
          >
            <Box
              component="img"
              src={logo.src}
              alt="Origin Tours"
              width={420}
              height={100}
              sx={{ height: { xs: 28, sm: 32, md: 38, lg: 42 }, width: "auto" }}
            />
          </Box>

          {/* Desktop Nav */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              gap: { lg: 0.25, xl: 0.75 },
            }}
          >
            {NAV.map((item) =>
              item.mega ? (
                <Box
                  key={item.name}
                  onMouseEnter={(e) => {
                    cancelMegaClose();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMegaAnchorX(rect.left + rect.width / 2);
                    setOpenMega(item.mega);
                  }}
                >
                  <Button
                    component={Link}
                    href={item.href}
                    endIcon={
                      <KeyboardArrowDown
                        sx={{
                          transition: "transform 0.2s",
                          transform:
                            openMega === item.mega ? "rotate(180deg)" : "none",
                        }}
                      />
                    }
                    aria-haspopup="true"
                    aria-expanded={openMega === item.mega}
                    sx={navButtonSx(isActive(item))}
                  >
                    {item.name}
                  </Button>
                </Box>
              ) : (
                <Button
                  key={item.name}
                  component={Link}
                  href={item.href}
                  onMouseEnter={() => setOpenMega(null)}
                  aria-current={isActive(item) ? "page" : undefined}
                  sx={navButtonSx(isActive(item))}
                >
                  {item.name}
                </Button>
              ),
            )}
          </Box>

          {/* CTA + phone (desktop) & mobile toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1, md: 1.5 } }}>
            <Button
              href={`tel:${PHONE}`}
              startIcon={<Phone sx={{ color: "primary.light", fontSize: "1rem" }} />}
              sx={{
                display: { xs: "none", xl: "inline-flex" },
                color: "white",
                fontWeight: 600,
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                "&:hover": { color: "primary.light" },
              }}
            >
              {PHONE_DISPLAY}
            </Button>

            {/* Primary CTA — always visible */}
            <Button
              component={Link}
              href={CTA.href}
              variant="contained"
              color="primary"
              sx={{
                px: { xs: 1.5, sm: 2, lg: 2.5, xl: 3 },
                py: { xs: 0.6, lg: 0.75, xl: 1 },
                borderRadius: 50,
                boxShadow: "0 4px 14px rgba(0, 136, 204, 0.4)",
                textTransform: "none",
                fontWeight: 700,
                fontSize: { xs: "0.78rem", sm: "0.85rem", xl: "0.95rem" },
                whiteSpace: "nowrap",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(0, 136, 204, 0.6)",
                },
              }}
            >
              {CTA.label}
            </Button>

            <IconButton
              size="large"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ display: { xs: "flex", lg: "none" }, color: "white", p: { xs: 1, sm: 1.25 } }}
            >
              <MenuIcon sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Desktop mega-menu panel, centred under the hovered nav button */}
      <Box
        sx={{
          display: { xs: "none", lg: openMega ? "block" : "none" },
          position: "absolute",
          left: 0,
          right: 0,
          top: "100%",
        }}
      >
        {openMega && (
          <Box
            ref={panelRef}
            sx={{
              // Hoverable padding instead of a dead gap: crossing from the
              // nav button into the panel never leaves the header's hover
              // area, so the menu can't close mid-crossing.
              position: "absolute",
              top: 0,
              pt: "8px",
              left: panelLeft ?? 0,
              width: "max-content",
              maxWidth: `min(${
                openMega === "tours" ? 860 : openMega === "services" ? 640 : 360
              }px, calc(100vw - 32px))`,
              // Hide until useLayoutEffect has measured and positioned it.
              visibility: panelLeft == null ? "hidden" : "visible",
            }}
          >
            <MegaMenu
              key={openMega}
              columns={menus[openMega].columns}
              footer={menus[openMega].footer}
              onNavigate={() => setOpenMega(null)}
            />
          </Box>
        )}
      </Box>

      {/* Mobile / Tablet Drawer */}
      <Drawer
        anchor="right"
        open={isMobileMenuOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 360 },
            maxWidth: "100vw",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{ p: { xs: 2, sm: 3 }, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <Box component={Link} href="/" onClick={toggleDrawer(false)}>
            <Box
              component="img"
              src={logo.src}
              alt="Origin Tours"
              width={420}
              height={100}
              sx={{ height: 32, width: "auto" }}
            />
          </Box>
          <IconButton onClick={toggleDrawer(false)} aria-label="Close menu">
            <Close fontSize="large" />
          </IconButton>
        </Box>

        <List sx={{ px: { xs: 1, sm: 2 }, flexGrow: 1, overflowY: "auto" }}>
          {NAV.map((item) => {
            if (item.mega) {
              const expanded = mobileExpanded === item.mega;
              const cols = menus[item.mega].columns;
              const footer = menus[item.mega].footer;
              return (
                <React.Fragment key={item.name}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() =>
                        setMobileExpanded(expanded ? null : item.mega)
                      }
                      sx={{ borderRadius: 2, py: 1.25 }}
                    >
                      <ListItemText
                        primary={item.name}
                        primaryTypographyProps={{ fontWeight: 700, color: "primary.main" }}
                      />
                      {expanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <List disablePadding sx={{ pl: 2, pb: 1 }}>
                      {cols.map((col, colIdx) => (
                        <React.Fragment key={col.title || colIdx}>
                          {col.title && (
                            <ListItem disablePadding>
                              <ListItemButton
                                component={Link}
                                href={col.href ?? footer.href}
                                onClick={toggleDrawer(false)}
                                sx={{ py: 0.75 }}
                              >
                                <ListItemText
                                  primary={col.title}
                                  primaryTypographyProps={{
                                    fontWeight: 700,
                                    fontSize: "0.72rem",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.6,
                                    color: "text.secondary",
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          )}
                          {col.links.map((l) => (
                            <React.Fragment key={l.name + l.href}>
                              <ListItem disablePadding>
                                <ListItemButton
                                  component={Link}
                                  href={l.href}
                                  onClick={toggleDrawer(false)}
                                  sx={{ py: 0.75, pl: 3 }}
                                >
                                  <ListItemText
                                    primary={l.name}
                                    primaryTypographyProps={{ fontSize: "0.95rem" }}
                                  />
                                </ListItemButton>
                              </ListItem>
                              {l.children?.map((child) => (
                                <ListItem key={child.name + child.href} disablePadding>
                                  <ListItemButton
                                    component={Link}
                                    href={child.href}
                                    onClick={toggleDrawer(false)}
                                    sx={{ py: 0.6, pl: 5 }}
                                  >
                                    <ListItemText
                                      primary={child.name}
                                      primaryTypographyProps={{
                                        fontSize: "0.9rem",
                                        color: "text.secondary",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                      <ListItem disablePadding>
                        <ListItemButton
                          component={Link}
                          href={footer.href}
                          onClick={toggleDrawer(false)}
                          sx={{ py: 0.75 }}
                        >
                          <ListItemText
                            primary={footer.name}
                            primaryTypographyProps={{ fontWeight: 600, color: "primary.main" }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }
            return (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={toggleDrawer(false)}
                  selected={isActive(item)}
                  sx={{
                    borderRadius: 2,
                    py: 1.25,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                    },
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontWeight: 700,
                      color: isActive(item) ? "inherit" : "primary.main",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Persistent CTA in the drawer */}
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 1, mt: "auto" }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            component={Link}
            href={CTA.href}
            onClick={toggleDrawer(false)}
            size="large"
            sx={{ mb: 1.5, borderRadius: 50, py: 1.5, fontWeight: 700 }}
          >
            {CTA.label}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            href={`tel:${PHONE}`}
            size="large"
            startIcon={<Phone />}
            sx={{ borderRadius: 50, py: 1.25 }}
          >
            Call Us
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
