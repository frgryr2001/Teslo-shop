import { createContext } from 'react';
import { IUser } from '../../interfaces/user';

interface ContextProps {
  isLoggedIn: boolean;
  user?: IUser;

  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    email: string,
    password: string,
    name: string
  ) => Promise<{
    hasError: boolean;
    message?: string;
  }>;
}

export const AuthContext = createContext({} as ContextProps);
