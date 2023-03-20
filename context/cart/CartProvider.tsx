import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct } from '../../interfaces';
import { cartReducer, CartContext } from './';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  ShippingAddress?: ShippingAddress;
}
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  ShippingAddress: undefined,
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
    if (Cookie.get('firstName')) {
      const shippingAddress = {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        zip: Cookie.get('zip') || '',
        city: Cookie.get('city') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
      };
      dispatch({
        type: '[Cart] - LoadAddress from Cookies',
        payload: shippingAddress,
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
  const updateAddress = (address: ShippingAddress) => {
    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 || '');
    Cookie.set('zip', address.zip);
    Cookie.set('city', address.city);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);
    dispatch({ type: '[Cart] - Update address', payload: address });
  };
  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateProductInCart,
        removeProductInCart,
        updateAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
