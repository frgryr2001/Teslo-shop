import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React, { FC, useMemo, useState } from "react";
import { IProduct } from "../../interfaces";

interface Props {
  product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const productImage = useMemo(() => {
    if (isHovered) {
      return `/products/${product.images[1]}`;
    }
    return `/products/${product.images[0]}`;
  }, [isHovered, product.images]);

  return (
    <Grid
      item
      xs={6}
      sm={4}
      key={product.slug}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink
          href={`/product/${product.slug}`}
          legacyBehavior
          passHref
          prefetch={false}
        >
          <Link>
            <CardActionArea>
              {product.inStock === 0 && (
                <Chip
                  color="primary"
                  label="Product not available"
                  sx={{
                    position: "absolute",
                    zIndex: 99,
                    top: "10px",
                    left: "10px",
                  }}
                />
              )}

              <CardMedia
                component={"img"}
                className="fadeIn"
                image={productImage}
                alt={product.title}
                onLoad={() => setIsImageLoading(true)}
              ></CardMedia>
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>

      <Box
        sx={{ mt: 1, display: isImageLoading ? "block" : "none" }}
        className="fadeIn"
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{`$${product.price}`}</Typography>
      </Box>
    </Grid>
  );
};
