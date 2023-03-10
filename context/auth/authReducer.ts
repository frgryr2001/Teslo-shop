import { IUser } from '../../interfaces';
import { AuthState } from './AuthProvider';

type AuthActionType =
  | { type: '[Auth] - Login'; payload: IUser }
  | { type: '[Auth] - Logout' }
  | { type: '[Auth] - Register'; payload: IUser };

export const authReducer = (state: AuthState, action: AuthActionType) => {
  switch (action.type) {
    case '[Auth] - Login':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case '[Auth] - Logout':
      return {
        ...state,
        isLoggedIn: false,
        user: undefined,
      };

    case '[Auth] - Register':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};
