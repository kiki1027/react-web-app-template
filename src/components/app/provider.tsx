import { login } from '@services/login';
import { useState, useContext, createContext, PropsWithChildren } from 'react';

interface IAppContext {
  auth: IAuthContext;
  authorities?: any[];
  configs?: any[];
  locale?: any;
  theme?: any;
}

export const AppContext = createContext<IAppContext>(null);

interface IAuthContext {
  user: IUser;
  signIn?: (params) => Promise<any>;
  signOut?: () => Promise<void>;
}

export const useAuth = () => {
  return useContext(AppContext)?.auth;
};

interface IUser {
  id: number;
  name: string;
}

export const useAppProvider = () => {
  const [user, setUser] = useState<IUser>(null);

  // 登录
  const signIn = (params) => {
    return login(params).then((res) => {
      setUser({ name: '乌云你', id: 1 });
      return user;
    }, console.log);
  };

  // 登出
  const signOut = () => {
    setUser(null);
    return Promise.resolve();
  };

  return { auth: { signIn, signOut, user } };
};

export const AppProvider = ({ children }: PropsWithChildren<any>) => {
  const appContext = useAppProvider();
  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};
