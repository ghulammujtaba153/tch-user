import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppConfigProvider } from './context/AppConfigContext.tsx'
import ReactGA from 'react-ga4';

// ReactGA.initialize('G-W7H929F7DV'); 

ReactGA.initialize([
  { trackingId: 'G-W7H929F7DV' },
  { trackingId: 'G-NXQ7EVBM9C' },
]);
ReactGA.send('pageview');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppConfigProvider>
      <App />
    </AppConfigProvider>
  </StrictMode>,
)
