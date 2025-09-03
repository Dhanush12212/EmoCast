import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' 
import './tailwind.css'; 
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './components/Contexts/AuthContext.jsx';
import { EmotionProvider } from './components/Contexts/EmotionContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider>
      <AuthProvider>
        <EmotionProvider>
          <App />
        </EmotionProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
