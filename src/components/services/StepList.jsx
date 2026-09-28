import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { radius, shadow } from "../../config/designSystem";

/**
 * Numbered process steps for service pages ("How to Book", visa
 * process, etc.). Steps render left-to-right on desktop.
 *
 * @param {{title:string,desc?:string}[]} steps
 */
const StepList = ({ steps = [] }) => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {steps.map((step, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 12 / Math.min(steps.length, 4) }} key={i}>
          <Box
            sx={{
              height: "100%",
              borderRadius: radius.card,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              p: { xs: 3, md: 3.5 },
              boxShadow: shadow.card,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #1A428A 0%, #2AB0E5 100%)",
                color: "common.white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.1rem",
                mb: 2,
              }}
            >
              {i + 1}
            </Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: step.desc ? 1 : 0, color: "text.primary" }}
            >
              {step.title}
            </Typography>
            {step.desc && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                {step.desc}
              </Typography>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default StepList;
