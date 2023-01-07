import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { ShopLayout } from "../../components/layouts/ShopLayout";

const AddressPage = () => {
  return (
    <ShopLayout
      title={"Address"}
      pageDescription={"Confirm Address of your order."}
    >
      <Typography variant="h1" component={"h1"}>
        Address
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField label="First name" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Last name" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Ma buu chinh */}
          <TextField label="Postal code" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField label="Address" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField label="Address 2 (option)" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Country</InputLabel>
            <Select variant="filled" label="Country" value={1}>
              <MenuItem value={1}>Ha noi</MenuItem>
              <MenuItem value={2}>HCM</MenuItem>
              <MenuItem value={3}>Da Nang</MenuItem>
              <MenuItem value={4}>An giang</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Ma buu chinh */}
          <TextField label="City" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          {/* Ma buu chinh */}
          <TextField label="Phone" variant="filled" fullWidth />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 5,
        }}
        display="flex"
        justifyContent="center"
      >
        <Button color="secondary" className="circular-btn" size="large">
          Order
        </Button>
      </Box>
    </ShopLayout>
  );
};

export default AddressPage;
