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
} from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { countries } from '../../utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { CartContext } from '../../context/cart/CartContext';

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
};
const getAddressFromCookies = (): FormData => {
  return {
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    address: Cookies.get('address') || '',
    address2: Cookies.get('address2') || '',
    zip: Cookies.get('zip') || '',
    city: Cookies.get('city') || '',
    country: Cookies.get('country') || '',
    phone: Cookies.get('phone') || '',
  };
};

const AddressPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);
  const [country, setCountry] = useState(
    Cookies.get('country') || countries[0].code
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getAddressFromCookies(),
  });

  const onSubmit = (data: FormData) => {
    updateAddress(data);
    router.push('/checkout/summary');
  };

  return (
    <ShopLayout
      title={'Address'}
      pageDescription={'Confirm Address of your order.'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h1" component={'h1'}>
          Address
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First name"
              variant="filled"
              fullWidth
              {...register('firstName', {
                required: 'Please enter an first name',
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last name"
              variant="filled"
              fullWidth
              {...register('lastName', {
                required: 'Please enter an last name',
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Ma buu chinh */}
            <TextField
              label="Postal code"
              variant="filled"
              fullWidth
              {...register('zip', {
                required: 'Please enter a zip code',
              })}
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Address"
              variant="filled"
              fullWidth
              {...register('address', {
                required: 'Please enter an address',
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Address 2 (option)"
              variant="filled"
              fullWidth
              {...register('address2')}
              error={!!errors.address2}
              helperText={errors.address2?.message}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                select
                variant="filled"
                label="Country"
                // defaultValue={Cookies.get('country') || countries[0].code}
                value={country}
                {...register('country', {
                  required: 'Please enter a country',
                })}
                error={!!errors.country}
                helperText={errors.country?.message}
                onChange={(e) => setCountry(e.target.value)}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Ma buu chinh */}
            <TextField
              label="City"
              variant="filled"
              fullWidth
              {...register('city', {
                required: 'Please enter a city',
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Ma buu chinh */}
            <TextField
              label="Phone"
              variant="filled"
              fullWidth
              {...register('phone', {
                required: 'Please enter a phone',
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 5,
          }}
          display="flex"
          justifyContent="center"
        >
          <Button
            color="secondary"
            className="circular-btn"
            size="large"
            type="submit"
          >
            Order
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

export default AddressPage;
