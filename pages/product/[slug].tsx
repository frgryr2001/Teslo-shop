import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useState, useContext } from "react";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductSizes, ProductSlideShow } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct } from "../../interfaces";
import { dbProducts } from "../../database";
import { ISize } from "../../interfaces/products";
import { useRouter } from "next/router";
import { CartContext } from "../../context/cart/CartContext";

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    images: product.images[0],
    price: product.price,
    size: undefined,
    type: product.type,
    slug: product.slug,
    title: product.title,
    quantity: 1,
  });

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      size,
    }));
  };
  const onAddProduct = () => {
    if (!tempCartProduct.size) {
      return;
    }

    addProductToCart(tempCartProduct);
    router.push("/cart");
  };
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      return;
    }
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      quantity: newQuantity,
    }));
  };
  return (
    <ShopLayout title={product.title} pageDescription={"This is a product"}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* Slideshow */}
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display={"flex"} flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>

            <Typography variant="subtitle1" component="h2">
              {`$${product.price}`}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Quantity</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updateQuantity={updateQuantity}
                maxValue={product.inStock > 5 ? 5 : product.inStock}
              />
              <ProductSizes
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onSelectedSize={onSelectedSize}
              />
            </Box>
            {product.inStock > 0 ? (
              <Button
                color="secondary"
                className="circular-btn"
                onClick={onAddProduct}
              >
                {tempCartProduct.size ? "Add to cart" : "Select a size"}
              </Button>
            ) : (
              <Chip
                label="Nothing available"
                color="error"
                variant="outlined"
              />
            )}

            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = "" } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };

// getStaticPaths...

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productSlugs = await dbProducts.getAllProductSlugs();

  return {
    paths: productSlugs?.map(({ slug }) => ({
      params: {
        slug,
      },
    })),
    fallback: false,
  };
};
//getStaticProps...

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);
  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { product },
    revalidate: 60 * 60 * 24,
  };
};

export default ProductPage;
