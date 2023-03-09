import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Chip,
} from '@mui/material';
import React from 'react';
import { AuthLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { validations } from '../../utils';
import requestApi from '../../api/requestApi';
import { ErrorOutline } from '@mui/icons-material';
type FormData = {
  email: string;
  password: string;
};
const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = async ({
    email,
    password,
  }: FormData) => {
    try {
      setError(null);
      const { data } = await requestApi.post(
        '/user/login',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { token, user } = data;
      console.log(token, user);
    } catch (error: any) {
      setError(error.response.data.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }

    // To do something with the data
  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Login
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                type={'email'}
                label="Username"
                variant="filled"
                fullWidth
                {...register('email', {
                  required: 'Please enter an email',
                  validate: (val) => validations.isEmail(val),
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('password', {
                  required: 'Please enter a password',
                  minLength: {
                    value: 6,
                    message: 'Password must have at least 6 characters',
                  },
                })}
                label="Password"
                type="password"
                variant="filled"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              {error && (
                <Chip
                  label={error}
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                  style={{
                    marginBottom: '10px',
                    width: '100%',
                    display: error ? 'flex' : 'none',
                    justifyContent: 'start',
                  }}
                />
              )}
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Login
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent={'end'}>
              <NextLink href={'/auth/register'} passHref legacyBehavior>
                <Link underline="always">Do not have an account? Register</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
