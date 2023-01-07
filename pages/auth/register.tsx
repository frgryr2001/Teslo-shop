import { Box, Button, Grid, TextField, Typography, Link } from "@mui/material";
import React from "react";
import { AuthLayout } from "../../components/layouts";
import NextLink from "next/link";

const RegisterPage = () => {
  return (
    <AuthLayout title="Login">
      <Box sx={{ width: 400, padding: "10px 20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1" component="h1">
              Create a new your account
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField label="Fullname" variant="filled" fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField label="Username" variant="filled" fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              variant="filled"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Confirm password"
              type="password"
              variant="filled"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              color="secondary"
              className="circular-btn"
              size="large"
              fullWidth
            >
              Create
            </Button>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent={"end"}>
            <NextLink href={"/auth/login"} passHref legacyBehavior>
              <Link underline="always">Login</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
