import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct } from '../../interfaces';
import { cartReducer, CartContext } from './';

export interface CartState {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : [];

      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: [],
      });
    }
  }, []);
  useEffect(() => {
    if (state.cart.length === 0) return;
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);
  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (acc, item) => item.quantity + acc,
      0
    );
    const subTotal = state.cart.reduce(
      (acc, item) => item.quantity * item.price,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) * 1 || 0;

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: Math.round(subTotal * (taxRate + 1)),
    };
    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Update product', payload: product });
  };
  const updateProductInCart = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Change  product quanity in Cart',
      payload: product,
    });
  };
  const removeProductInCart = (product: ICartProduct) => {
    dispatch({
      type: '[Cart] - Remove product in Cart',
      payload: product,
    });
  };
  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateProductInCart,
        removeProductInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
