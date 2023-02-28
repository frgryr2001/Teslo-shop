import { CartState } from "./CartProvider";
import { ICartProduct } from "../../interfaces";

type CartActionType =
  | {
      type: "[Cart] - LoadCart from cookies | storage";
      payload: ICartProduct[];
    }
  | {
      type: "[Cart] - Add product";
      payload: ICartProduct;
    };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart] - LoadCart from cookies | storage":
      console.log("Error here", action.payload);

      return {
        ...state,
        // cart: [...action.payload],
      };
    case "[Cart] - Add product":
      if (state.cart.length === 0) {
        return {
          ...state,
          cart: [...state.cart, action.payload],
        };
      } else {
        const tempProduct = action.payload;
        const indexExists = state.cart.findIndex((product) => {
          return (
            product._id === tempProduct._id && product.size === tempProduct.size
          );
        });
        if (indexExists >= 0) {
          const copyProduct = state.cart[indexExists];
          const newProductQuantity = {
            ...copyProduct,
            quantity: copyProduct.quantity + action.payload.quantity,
          };
          const updateCart = [...state.cart];
          updateCart[indexExists] = newProductQuantity;
          return {
            ...state,
            cart: updateCart,
          };
        }
      }
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };

    default:
      return {
        ...state,
      };
  }
};
