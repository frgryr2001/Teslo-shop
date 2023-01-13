import { Typography } from "@mui/material";
import { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const WomenPage: NextPage = () => {
  const { products, isLoading, isError } = useProducts(
    "/products?gender=women"
  );

  return (
    <>
      <ShopLayout
        title={"Teslo-Shop - Women"}
        pageDescription={
          "Clothing shop is is a fashion brand that offers the latest models today"
        }
      >
        <Typography variant="h1" component="h1">
          Women
        </Typography>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Product for the women
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
};
export default WomenPage;
