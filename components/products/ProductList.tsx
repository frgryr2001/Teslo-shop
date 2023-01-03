import { Grid } from "@mui/material";
import React, { FC } from "react";
import { IProduct } from "../../interfaces";
import { ProductCard } from "./";

interface Props {
  products: IProduct[];
}

export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => {
        return <ProductCard product={product} key={product.slug} />;
      })}
    </Grid>
  );
};
