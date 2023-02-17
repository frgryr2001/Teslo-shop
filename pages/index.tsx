import { Typography } from "@mui/material";
import { ShopLayout } from "../components/layouts";
import { ProductList } from "../components/products";
import { FullScreenLoading } from "../components/ui";
import { useProducts } from "../hooks";
import { IProduct } from "../interfaces/products";

export default function HomePage() {
  const { products, isLoading, isError } = useProducts<IProduct[]>("/products");

  return (
    <>
      <ShopLayout
        title={"Teslo-Shop"}
        pageDescription={
          "Clothing shop is is a fashion brand that offers the latest models today"
        }
      >
        <Typography variant="h1" component="h1">
          Store
        </Typography>
        <Typography variant="h2" sx={{ mb: 1 }}>
          All Products
        </Typography>
        {/* <FullScreenLoading /> */}

        {isLoading ? (
          <FullScreenLoading />
        ) : (
          <ProductList products={products} />
        )}
      </ShopLayout>
    </>
  );
}
