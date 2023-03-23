import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Chip,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React, { useContext } from 'react';
import { AuthLayout } from '../../components/layouts';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../context/auth/AuthContext';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};
const RegisterPage = () => {
  const { registerUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  const handleClickShowPassword = (
    passwordState: boolean,
    setPasswordState: any
  ) => setPasswordState(!passwordState);
  const handleMouseDownPassword = (
    passwordState: boolean,
    setPasswordState: any
  ) => setPasswordState(!passwordState);
  const onRegisterForm = async ({
    name,
    email,
    password,
    confirm_password,
  }: FormData) => {
    if (password !== confirm_password) {
      setError('Password and confirm password must be the same');
      return;
    }
    setError(null);

    const resp = await registerUser(email, password, name);

    if (resp.hasError) {
      setError(resp.message || 'Something went wrong');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    await signIn('credentials', { email, password });
  };
  return (
    <AuthLayout title="Register">
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 400, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Create a new your account
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                type={'email'}
                label="Email"
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
                label="Name"
                variant="filled"
                fullWidth
                {...register('name', {
                  required: 'Please enter a name',
                  minLength: {
                    value: 2,
                    message: 'Name must have at least 2 characters',
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="filled"
                fullWidth
                {...register('password', {
                  required: 'Please enter a password',
                  minLength: {
                    value: 6,
                    message: 'Password must have at least 6 characters',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword.bind(
                          null,
                          showPassword,
                          setShowPassword
                        )}
                        onMouseDown={handleMouseDownPassword.bind(
                          null,
                          showPassword,
                          setShowPassword
                        )}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirm password"
                variant="filled"
                fullWidth
                {...register('confirm_password', {
                  required: 'Please enter a password',
                  minLength: {
                    value: 6,
                    message: 'Password must have at least 6 characters',
                  },
                })}
                error={!!errors.confirm_password}
                helperText={errors.confirm_password?.message}
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword.bind(
                          null,
                          showConfirmPassword,
                          setShowConfirmPassword
                        )}
                        onMouseDown={handleMouseDownPassword.bind(
                          null,
                          showConfirmPassword,
                          setShowConfirmPassword
                        )}
                      >
                        {showConfirmPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                Create
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent={'end'}>
              <NextLink href={'/auth/login'} passHref legacyBehavior>
                <Link underline="always">Login</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  const { p = '/' } = query;
  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default RegisterPage;
