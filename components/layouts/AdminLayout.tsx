import React, { FC } from 'react';
import { SideMenu } from '../ui';
import { AdminNavbar } from '../admin';
import { Box, Typography } from '@mui/material';

interface Props {
  children?: React.ReactNode;
  title: string;
  pageDescription: string;
  icon?: JSX.Element;
}

export const AdminLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  icon,
}) => {
  return (
    <>
      <nav>
        <AdminNavbar />
      </nav>

      <SideMenu />

      <main
        style={{
          margin: '80px auto',
          maxWidth: '1400px',
          padding: ' 0 30px',
        }}
      >
        <Box>
          <Typography variant="h1" component={'h1'}>
            {icon}
            {title}
          </Typography>
          <Typography variant="h2" sx={{ mb: 1 }}>
            {pageDescription}
          </Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
      </main>

      <footer>{/* footer */}</footer>
    </>
  );
};
