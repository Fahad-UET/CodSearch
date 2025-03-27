import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SWRConfig } from 'swr';
import App from './App.tsx';
import './index.css';
import { VideoProvider } from './components/updated/VideoContext.tsx';
import { BrowserRouter as Router } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      <VideoProvider>
        <Router>
          <App />
        </Router>
      </VideoProvider>
    </SWRConfig>
  </StrictMode>
);
