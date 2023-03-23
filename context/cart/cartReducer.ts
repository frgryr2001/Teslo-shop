import { CartState } from './CartProvider';
import { ICartProduct, ShippingAddress } from '../../interfaces';

type CartActionType =
  | {
      type: '[Cart] - LoadCart from cookies | storage';
      payload: ICartProduct[];
    }
  | {
      type: '[Cart] - Update product';
      payload: ICartProduct;
    }
  | {
      type: '[Cart] - Change  product quanity in Cart';
      payload: ICartProduct;
    }
  | {
      type: '[Cart] - Remove product in Cart';
      payload: ICartProduct;
    }
  | {
      type: '[Cart] - Update order summary';
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    }
  | { type: '[Cart] - LoadAddress from Cookies'; payload: ShippingAddress }
  | { type: '[Cart] - Update address'; payload: ShippingAddress }
  | {
      type: '[Cart] - Order complete';
    };

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case '[Cart] - LoadCart from cookies | storage':
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case '[Cart] - Update product':
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
    case '[Cart] - Change  product quanity in Cart':
      if (action.payload.quantity === 0) {
        return {
          ...state,
          cart: state.cart.filter((product) => {
            return (
              product._id !== action.payload._id &&
              product.size !== action.payload.size
            );
          }),
        };
      }
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (
            product._id === action.payload._id &&
            product.size === action.payload.size
          ) {
            return action.payload;
          }
          return product;
        }),
      };

    case '[Cart] - Remove product in Cart':
      return {
        ...state,
        cart: state.cart.filter((product) => {
          return (
            product._id !== action.payload._id &&
            product.size !== action.payload.size
          );
        }),
      };

    case '[Cart] - Update order summary':
      return {
        ...state,
        ...action.payload,
      };

    case '[Cart] - Update address':
    case '[Cart] - LoadAddress from Cookies':
      return {
        ...state,
        ShippingAddress: action.payload,
      };

    case '[Cart] - Order complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };
    default:
      return {
        ...state,
      };
  }
};
