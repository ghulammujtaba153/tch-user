// context/AppConfigContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/url';



interface AppConfig {
  name: string;
  logo: string;
}

const AppConfigContext = createContext<{
  config: AppConfig | null;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig | null>>;
} | null>(null);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/brand`)
      .then(res => setConfig(res.data))
      .catch(err => console.error('Failed to fetch app config:', err));
  }, []);

  return (
    <AppConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (!context) throw new Error("useAppConfig must be used within AppConfigProvider");
  return context;
};
