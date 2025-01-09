import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='497074437558-o2rdspogtcgrtr0ajq70roscb0fr9pt2.apps.googleusercontent.com'>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);