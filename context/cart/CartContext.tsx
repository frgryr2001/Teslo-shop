import { createContext } from 'react';
import { ICartProduct, ShippingAddress } from '../../interfaces/';

interface ContextProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  ShippingAddress?: ShippingAddress;

  addProductToCart: (product: ICartProduct) => void;
  updateProductInCart: (product: ICartProduct) => void;
  removeProductInCart: (product: ICartProduct) => void;
  updateAddress: (address: ShippingAddress) => void;

  // Order
  createOrder: () => Promise<{
    hasError: boolean;
    message: string;
  }>;
}

export const CartContext = createContext({} as ContextProps);
