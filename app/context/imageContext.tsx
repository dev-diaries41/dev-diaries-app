import React, { createContext, useState, ReactNode, useContext } from 'react';

interface ImageGenContextProps {
  assets: any[]; //
  setAssets: React.Dispatch<React.SetStateAction<string[]>>; 
}

const ImageGenContext = createContext<ImageGenContextProps | undefined>(undefined);

interface ImageGenProps {
  children: ReactNode;
}

const ImageGenProvider = ({ children }: ImageGenProps) => {
  const [assets, setAssets] = useState<string[]>([]);

  return (
    <ImageGenContext.Provider value={{ 
      assets, 
      setAssets
      }}>
      {children}
    </ImageGenContext.Provider>
  );
};

// Hook for using the ImageGenContext
const useImageGenContext = () => {
  const context = useContext(ImageGenContext);
  if (!context) {
    throw new Error('useImageGenContext must be used within a ImageGenProvider');
  }
  return context;
};

export { ImageGenContext, ImageGenProvider, useImageGenContext };
