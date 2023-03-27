import { AppBar, Toolbar, Typography, Link, Box, Button } from '@mui/material';
import React, { useContext } from 'react';
import NextLink from 'next/link';
import { UiContext } from '../../context';

export const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UiContext);
  return (
    <AppBar>
      <Toolbar>
        <NextLink href={'/'} passHref legacyBehavior>
          <Link
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box sx={{ flex: 1 }} />
        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
