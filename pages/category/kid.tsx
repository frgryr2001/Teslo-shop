import { Typography } from "@mui/material";
import { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { IProduct } from "../../interfaces/products";
import { useProducts } from "../../hooks";

const KidPage: NextPage = () => {
  const { products, isLoading, isError } = useProducts<IProduct[]>(
    "/products?gender=kid"
  );

  return (
    <>
      <ShopLayout
        title={"Teslo-Shop - Kids"}
        pageDescription={
          "Clothing shop is is a fashion brand that offers the latest models today"
        }
      >
        <Typography variant="h1" component="h1">
          Kid
        </Typography>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Product for the kid
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
export default KidPage;
