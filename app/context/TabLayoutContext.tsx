import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { TabLayoutContextProps } from '../constants/types';
import { hideTabBar } from '../lib/layout';


const TabLayoutContext = createContext<TabLayoutContextProps | undefined>(undefined);

interface TabLayoutProiderProps {
  children: ReactNode;
}

const TabLayoutProider = ({ children }: TabLayoutProiderProps) => {
  const [shouldHideTabBar, setShouldHideTabBar] = useState(false);

  return (
    <TabLayoutContext.Provider value={{
        shouldHideTabBar, 
        setShouldHideTabBar
    }}>
      {children}
    </TabLayoutContext.Provider>
  );
};

const useTabLayout = (navigation?: any): TabLayoutContextProps => {
  const context = useContext(TabLayoutContext);
  if (!context) {
    throw new Error('useTabLayout must be used within a TabLayoutProider');
  }
  useEffect(() => {
    if (context.shouldHideTabBar && navigation) {
     hideTabBar(navigation)
    }
  }, [context.shouldHideTabBar]);
  return context;
};


export { TabLayoutContext, TabLayoutProider, useTabLayout };
