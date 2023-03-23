import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Chip,
  Divider,
} from '@mui/material';
import React from 'react';
import { AuthLayout } from '../../components/layouts';
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { validations } from '../../utils';
import { getSession, signIn, getProviders } from 'next-auth/react';
import { ErrorOutline, GitHub } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type FormData = {
  email: string;
  password: string;
};
const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [error, setError] = React.useState<string | null>(null);
  const [providers, setProviders] = React.useState<any>({});

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  const onSubmit: SubmitHandler<FormData> = async ({
    email,
    password,
  }: FormData) => {
    // setError(null);
    await signIn('credentials', { email, password });
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
                label="Password"
                type="password"
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
              <NextLink
                href={
                  router.query.p
                    ? `/auth/register?p=${router.query.p}`
                    : '/auth/register'
                }
                passHref
                legacyBehavior
              >
                <Link underline="always">Do not have an account? Register</Link>
              </NextLink>
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              flexDirection={'column'}
              justifyContent={'end'}
            >
              <Divider sx={{ width: '100%', mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === 'credentials') {
                  return <div key={providers.id + provider.name}></div>;
                }

                return (
                  <Button
                    key={providers.id + provider.name}
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{ mb: 1 }}
                    startIcon={<GitHub />}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                );
              })}
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
  console.log({ session });

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

export default LoginPage;
