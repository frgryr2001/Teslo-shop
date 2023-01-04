import React, { FC } from "react";
import { ISize } from "../../interfaces";
import { Box, Button } from "@mui/material";

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
}

export const ProductSizes: FC<Props> = ({ selectedSize, sizes }) => {
  return (
    <Box>
      {sizes.map((size) => {
        return (
          <Button
            key={size}
            size="small"
            color={selectedSize === size ? "primary" : "info"}
          >
            {size}
          </Button>
        );
      })}
    </Box>
  );
};
