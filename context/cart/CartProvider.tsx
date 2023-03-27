import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct, ShippingAddress } from '../../interfaces';
import { cartReducer, CartContext } from './';
import requestApi from '../../api/requestApi';
import { IOrder } from '../../interfaces/order';
import axios from 'axios';
import Cookies from 'js-cookie';

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  ShippingAddress?: ShippingAddress;
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
      (acc, item) => item.quantity * item.price + acc,
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
  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.ShippingAddress) {
      throw new Error('There are no delivery addresses');
    }
    const body: IOrder = {
      orderItems: state.cart.map((p) => {
        return {
          ...p,
          size: p.size!,
        };
      }),
      ShippingAddress: state.ShippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };
    try {
      const { data } = await requestApi.post<IOrder>('/orders', body);
      dispatch({ type: '[Cart] - Order complete' });
      Cookies.remove('cart');
      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: 'Something went an error',
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateProductInCart,
        removeProductInCart,
        updateAddress,
        // orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
