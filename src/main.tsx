import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppConfigProvider } from './context/AppConfigContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppConfigProvider>
      <App />
    </AppConfigProvider>
  </StrictMode>,
)
