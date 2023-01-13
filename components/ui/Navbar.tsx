import {
  AppBar,
  Toolbar,
  Typography,
  Link,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import React from "react";
import NextLink from "next/link";
import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import { useRouter } from "next/router";

export const Navbar = () => {
  const router = useRouter();

  return (
    <AppBar>
      <Toolbar>
        <NextLink href={"/"} passHref legacyBehavior>
          <Link
            sx={{
              display: "flex",
              alignItems: "center",
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
            textAlign: "center",
            display: { xs: "none", sm: "block" },
          }}
        >
          <NextLink href="/category/men" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === "/category/men" ? "primary" : "info"}
              >
                Men
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === "/category/women" ? "primary" : "info"}
              >
                Women
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref legacyBehavior>
            <Link>
              <Button
                color={router.asPath === "/category/kid" ? "primary" : "info"}
              >
                Kid
              </Button>
            </Link>
          </NextLink>
        </Box>
        <Box sx={{ flex: 1 }} />

        <IconButton>
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge badgeContent={2} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
