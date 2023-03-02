import { createContext } from 'react';
import { ICartProduct } from '../../interfaces/';

interface ContextProps {
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  addProductToCart: (product: ICartProduct) => void;
  updateProductInCart: (product: ICartProduct) => void;
  removeProductInCart: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps);
