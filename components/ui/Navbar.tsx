import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
} from '@mui/material';
import React, { useContext, useState } from 'react';
import NextLink from 'next/link';
import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { useRouter } from 'next/router';
import { UiContext } from '../../context';
import { CartContext } from '../../context/cart/CartContext';

export const Navbar = () => {
  const router = useRouter();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { toggleSideMenu } = useContext(UiContext);
  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState<String>('');

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;

    router.push(`/search/${searchTerm}`);
  };

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

        <Box
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' },
          }}
        >
          <NextLink href="/category/men" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === '/category/men' ? 'primary' : 'info'}
              >
                Men
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === '/category/women' ? 'primary' : 'info'}
              >
                Women
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === '/category/kid' ? 'primary' : 'info'}
              >
                Kid
              </Button>
            </Link>
          </NextLink>
        </Box>
        <Box sx={{ flex: 1 }} />

        {isSearchVisible ? (
          <Input
            autoFocus
            sx={{
              display: { xs: 'none', sm: 'flex' },
            }}
            className="fadeIn"
            type="text"
            value={searchTerm}
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => (e.key === 'Enter' ? onSearchTerm() : null)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setIsSearchVisible(false)}
                  sx={{ xs: 'flex', sm: 'none' }}
                >
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton onClick={() => setIsSearchVisible(true)}>
            <SearchOutlined />
          </IconButton>
        )}

        {/* <IconButton sx={{ xs: "flex", sm: "none" }} onClick={toggleSideMenu}>
          <SearchOutlined />
        </IconButton> */}

        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge badgeContent={numberOfItems} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
