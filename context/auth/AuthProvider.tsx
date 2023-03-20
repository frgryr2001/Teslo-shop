import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { requestApi } from '../../api';
import { IUser } from '../../interfaces';
import { authReducer, AuthContext } from './';
import axios from 'axios';
import { useSession, signOut } from 'next-auth/react';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'authenticated') {
      console.log({ user: data?.user });
      dispatch({ type: '[Auth] - Login', payload: data?.user as IUser });
    }
  }, [data, status]);

  // useEffect(() => {
  //   checkIsAuthenticated();
  // }, []);
  const checkIsAuthenticated = async () => {
    if (Cookies.get('token')) {
      try {
        const { data } = await requestApi.get('/user/validate-token');
        const { token, user } = data;
        Cookies.set('token', token);
        dispatch({ type: '[Auth] - Login', payload: user });
      } catch (error: any) {
        Cookies.remove('token');
      }
    }
  };
  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await requestApi.post('/user/login', {
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error: any) {
      return false;
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await requestApi.post('/user/register', {
        email,
        password,
        name,
      });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Register', payload: user });
      return {
        hasError: false,
      };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: 'Something went wrong',
      };
    }
  };
  const logout = () => {
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('city');
    Cookies.remove('country');
    Cookies.remove('phone');
    signOut();
    // Cookies.remove('token');
    // router.reload();
  };
  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
