import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface Props {
  currentValue: number;
  maxValue: number;

  // function
  updateQuantity: (newValue: number) => void;
}

export const ItemCounter: FC<Props> = ({
  currentValue,
  maxValue,
  updateQuantity,
}) => {
  const addOrRemove = (value: number) => {
    if (currentValue < 1) {
      return;
    }
    if (value === -1) {
      return updateQuantity(currentValue + value);
    }

    if (currentValue >= maxValue) {
      return;
    }
    return updateQuantity(currentValue + value);
  };
  const addRemoveClickHandler = (num: number) => {
    return addOrRemove(num);
  };

  return (
    <Box display={"flex"} alignItems="center">
      <IconButton>
        <RemoveCircleOutline onClick={addRemoveClickHandler.bind(null, -1)} />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }}>
        {currentValue}
      </Typography>
      <IconButton>
        <AddCircleOutline onClick={addRemoveClickHandler.bind(null, 1)} />
      </IconButton>
    </Box>
  );
};
