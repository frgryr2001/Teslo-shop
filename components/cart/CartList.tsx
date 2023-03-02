import {
  Typography,
  Grid,
  Link,
  CardActionArea,
  CardMedia,
  Box,
  Button,
} from '@mui/material';
import NextLink from 'next/link';
import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { ICartProduct } from '../../interfaces';

interface Props {
  editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {
  const { cart, updateProductInCart, removeProductInCart } =
    useContext(CartContext);

  const onNewProductQuantityInCart = (
    product: ICartProduct,
    quantity: number
  ) => {
    product.quantity = quantity;
    updateProductInCart(product);
  };

  return (
    <>
      {cart?.map((product) => (
        <Grid container key={product.slug + product.size} sx={{ mb: 1, mt: 1 }}>
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={`/products/${product.images}`}
                    component="img"
                    sx={{
                      borderRadius: '5px',
                    }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Size <strong>M</strong>
              </Typography>

              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={10}
                  updateQuantity={(value) =>
                    onNewProductQuantityInCart(product, value)
                  }
                />
              ) : (
                <Typography variant="h5">
                  {product.quantity} {product.quantity > 1 ? 'items' : 'item'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            alignItems={'center'}
            flexDirection="column"
          >
            <Typography variant="subtitle1">{`$${product.price}`}</Typography>
            {editable && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => removeProductInCart(product)}
              >
                Remove
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
