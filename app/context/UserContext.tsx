import { createContext, useState, useContext, ReactNode } from 'react';
import { UserContextProps } from '../constants/types';
import { Session } from '@supabase/supabase-js';


const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  userSession: Session | null;
}

const UserProvider = ({ children, userSession }: UserProviderProps) => {
  const [session, setSession] = useState<Session| null>(userSession);

  return (
    <UserContext.Provider value={{
        session,
        setSession,
      
    }}>
      {children}
    </UserContext.Provider>
  );
};

const userUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('userUserContext must be used within a UserProvider');
  }
  return context;
};


export { UserContext, UserProvider, userUserContext };
