import { Typography } from "@mui/material";
import { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const MenPage: NextPage = () => {
  const { products, isLoading, isError } = useProducts("/products?gender=men");

  return (
    <>
      <ShopLayout
        title={"Teslo-Shop - Mens"}
        pageDescription={
          "Clothing shop is is a fashion brand that offers the latest models today"
        }
      >
        <Typography variant="h1" component="h1">
          Men
        </Typography>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Product for the men
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
export default MenPage;
