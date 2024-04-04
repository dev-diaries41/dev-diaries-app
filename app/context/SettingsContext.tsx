import { createContext, useState, useContext, ReactNode } from 'react';
import { ImageSettings, QuotePostSettings, NotifyConfig, Settings, SettingsContextProps } from '../constants/types';


const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
  settings: Settings;
}

const SettingsProvider = ({ children, settings }: SettingsProviderProps) => {
  const [enablePasscode, setEnablePasscode] = useState(settings.enablePasscode)
  const [theme, setTheme] = useState(settings.theme);
  const [imageSettings, setImageSettings] = useState<ImageSettings>(settings.imageSettings);
  const [broadcastSettings, setBroadcastSettings] = useState<NotifyConfig>(settings.broadcastSettings);
  const [quotePostSettings, setQuotePostSettings] = useState<QuotePostSettings>(settings.quotePostSettings);


  return (
    <SettingsContext.Provider value={{
      enablePasscode, 
      setEnablePasscode,
      theme,
      setTheme,
      imageSettings,
      setImageSettings,
      broadcastSettings,
      setBroadcastSettings,
      quotePostSettings,
      setQuotePostSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettingsContext = (): SettingsContextProps => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};


export { SettingsContext, SettingsProvider, useSettingsContext };
