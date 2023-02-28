import { FC, useReducer, PropsWithChildren, useEffect } from "react";
import Cookie from "js-cookie";
import { ICartProduct } from "../../interfaces";
import { cartReducer, CartContext } from "./";

export interface CartState {
  cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
  cart: Cookie.get("cart") ? JSON.parse(Cookie.get("cart")!) : [],
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];

      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Add product", payload: product });
  };
  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
