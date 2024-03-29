import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { LayoutContextProps } from '../constants/types';
import { hideTabBar } from '../lib/layout';


const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

interface LayoutProiderProps {
  children: ReactNode;
}

const LayoutProider = ({ children }: LayoutProiderProps) => {
  const [shouldHideTabBar, setShouldHideTabBar] = useState(false);

  return (
    <LayoutContext.Provider value={{
        shouldHideTabBar, 
        setShouldHideTabBar
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

const useLayoutContext = (navigation?: any): LayoutContextProps => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProider');
  }
  useEffect(() => {
    if (context.shouldHideTabBar && navigation) {
     hideTabBar(navigation)
    }
  }, [context.shouldHideTabBar]);
  return context;
};


export { LayoutContext, LayoutProider, useLayoutContext };
