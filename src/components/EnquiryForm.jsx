"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useRecaptcha } from "@/components/RecaptchaProvider";

const EnquiryForm = ({
  packageTitle,
  currentUrl,
  selectedPackage,
  packages,
  redirectTo,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    travelDate: "",
    adults: 1,
    children: 0,
  });
  const [submitStatus, setSubmitStatus] = useState(null); // null | "loading" | "success" | "error"
  const { executeRecaptcha } = useRecaptcha();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");

    const messageBody = [
      formData.message,
      formData.travelDate && `Travel Date: ${formData.travelDate}`,
      `Adults: ${formData.adults}, Children: ${formData.children}`,
      formData.selectedPackage && `Package: ${formData.selectedPackage}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const recaptchaToken = await executeRecaptcha("enquiry");
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          message: messageBody || undefined,
          serviceType: packageTitle || undefined,
          recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setFormData({ name: "", phone: "", email: "", message: "", travelDate: "", adults: 1, children: 0 });
      const base = redirectTo || "/thank-you";
      router.push(base + (packageTitle ? "?pkg=" + encodeURIComponent(packageTitle) : ""));
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <Paper
      id="enquiry-form"
      elevation={4}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
          p: { xs: 2, sm: 2.5, md: 3 },
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "white" }}
        >
          Need Assistance?
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, color: "white" }}>
          Reach Out to Us for Custom Packages
        </Typography>

        {selectedPackage && (
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              mt: 2,
              p: 1.5,
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                opacity: 0.8,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Selected Option
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 0.5 }}>
              {selectedPackage.title}{" "}
              <Box component="span" sx={{ opacity: 0.7 }}>
                •
              </Box>{" "}
              {selectedPackage.roomType}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#FFD700", fontWeight: "bold", mt: 0.5 }}
            >
              ₹{parseInt(selectedPackage.price).toLocaleString()}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "background.paper" }}
      >
        <Stack spacing={3}>
          {/* Hidden Fields for Context */}
          <input type="hidden" name="package_title" value={packageTitle} />
          <input type="hidden" name="page_url" value={currentUrl} />
          <input
            type="hidden"
            name="selected_package_details"
            value={selectedPackage ? JSON.stringify(selectedPackage) : ""}
          />

          {packageTitle && (
            <TextField
              fullWidth
              label="Package Name"
              value={packageTitle}
              variant="outlined"
              size="small"
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
              sx={{ bgcolor: "action.hover" }}
            />
          )}

          {packages && packages.length > 0 && (
            <TextField
              select
              fullWidth
              label="Interested Package & Room"
              name="selectedPackage"
              value={formData.selectedPackage || ""}
              onChange={handleChange}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">
                <em>None (General Enquiry)</em>
              </MenuItem>
              {packages.flatMap((pkg) =>
                pkg.roomPrices?.map((room, idx) => (
                  <MenuItem
                    key={`${pkg.packageTitle}-${idx}`}
                    value={`${pkg.packageTitle} - ${room.roomType}`}
                  >
                    {pkg.packageTitle} - {room.roomType} (₹{room.price})
                  </MenuItem>
                )),
              )}
            </TextField>
          )}

          <TextField
            fullWidth
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            required
            size="small"
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            variant="outlined"
            required
            type="tel"
            size="small"
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            required
            type="email"
            size="small"
          />

          <TextField
            fullWidth
            label="Travel Date (Tentative)"
            name="travelDate"
            type="date"
            value={formData.travelDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            size="small"
          />

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Adults (12+ yrs)"
              name="adults"
              type="number"
              value={formData.adults}
              onChange={handleChange}
              variant="outlined"
              size="small"
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              label="Children (2-11 yrs)"
              name="children"
              type="number"
              value={formData.children}
              onChange={handleChange}
              variant="outlined"
              size="small"
              inputProps={{ min: 0 }}
            />
          </Stack>

          <TextField
            fullWidth
            label="Message / Requirements"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={3}
            variant="outlined"
            size="small"
          />

          {submitStatus === "error" && (
            <Alert severity="error" onClose={() => setSubmitStatus(null)}>
              Something went wrong. Please try again or call us directly.
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            size="large"
            disabled={submitStatus === "loading"}
            endIcon={submitStatus === "loading" ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 50,
              boxShadow: "0 8px 16px rgba(15, 118, 110, 0.2)",
            }}
          >
            {submitStatus === "loading" ? "Sending…" : "Send Enquiry"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default EnquiryForm;

