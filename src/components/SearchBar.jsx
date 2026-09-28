"use client";
import React, { useState } from "react";
import { Box, InputBase, Paper, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setTourFilter } from "../store/slices/filterSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setTourFilter({ search: searchTerm }));
    router.push("/tours");
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      elevation={3}
      sx={{
        p: { xs: "6px 8px", sm: "8px 16px" },
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: 50,
        bgcolor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box
        sx={{
          p: { xs: "6px", sm: "10px" },
          color: "primary.main",
          display: "flex",
          alignItems: "center",
        }}
        aria-hidden="true"
      >
        <LocationOnIcon />
      </Box>

      <InputBase
        sx={{
          ml: 0.5,
          flex: 1,
          fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
          color: "text.primary",
        }}
        placeholder="Where do you want to go?"
        inputProps={{ "aria-label": "search tours" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          borderRadius: 50,
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 1, sm: 1.25, md: 1.5 },
          fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
          boxShadow: "0 4px 15px rgba(33, 150, 243, 0.3)",
          minWidth: "auto",
          whiteSpace: "nowrap",
        }}
      >
        Search
      </Button>
    </Paper>
  );
};

export default SearchBar;

