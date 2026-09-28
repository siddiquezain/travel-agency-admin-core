import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { radius, shadow, sectionColors } from "../../config/designSystem";

/**
 * Responsive grid of icon feature cards for service pages.
 *
 * @param {{icon:React.ElementType,title:string,desc?:string,color?:object}[]} items
 * @param {object} [size]  MUI Grid size object (defaults to 3-up on desktop).
 */
const FeatureGrid = ({ items = [], size = { xs: 12, sm: 6, md: 3 } }) => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {items.map((item, i) => {
        const color = item.color || sectionColors.blue;
        const Icon = item.icon;
        return (
          <Grid size={size} key={i}>
            <Box
              sx={{
                height: "100%",
                borderRadius: radius.card,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                p: { xs: 3, md: 3.5 },
                textAlign: "center",
                boxShadow: shadow.card,
                transition: "all 0.3s ease-out",
                "&:hover": {
                  boxShadow: shadow.cardHover,
                  transform: "translateY(-6px)",
                  borderColor: color.text + "33",
                },
              }}
            >
              {Icon && (
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.icon,
                    background: color.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    boxShadow: color.shadow,
                  }}
                >
                  <Icon sx={{ fontSize: 26, color: "white" }} />
                </Box>
              )}
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: item.desc ? 1 : 0, color: "text.primary" }}
              >
                {item.title}
              </Typography>
              {item.desc && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {item.desc}
                </Typography>
              )}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default FeatureGrid;
