import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

export const FullScreenLoading = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems={"center"}
      height="calc(100vh - 200px)"
      flexDirection={"column"}
    >
      <Typography sx={{ mb: 3 }} variant="h2" fontWeight={200}>
        Loading...
      </Typography>
      <CircularProgress thickness={2} />
    </Box>
  );
};
