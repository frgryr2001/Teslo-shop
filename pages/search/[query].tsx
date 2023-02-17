import { NextPage } from "next";
import { GetServerSideProps } from "next";
import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";
import { IProduct } from "../../interfaces/";
import { dbProducts } from "../../database";

interface Props {
  products: IProduct[];
  foundProduct: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProduct, query }) => {
  return (
    <>
      <ShopLayout
        title={"Teslo-Shop - Search"}
        pageDescription={
          "Clothing shop is is a fashion brand that offers the latest models today"
        }
      >
        <Typography variant="h1" component="h1">
          Store
        </Typography>
        {foundProduct ? (
          <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">
            Search results for: {query}
          </Typography>
        ) : (
          <Typography variant="h2" sx={{ mb: 1 }}>
            No products found for: {query}
          </Typography>
        )}
        {/* <FullScreenLoading /> */}
        <ProductList products={products} />
      </ShopLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };
  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  let products = await dbProducts.getProductsByTerm(query);
  const foundProduct = products.length > 0;

  if (!foundProduct) {
    // products = await dbProducts.getAllProducts();
  }

  return {
    props: { products, foundProduct, query },
  };
};

export default SearchPage;
