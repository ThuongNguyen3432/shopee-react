import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LoginProvider } from './context/LoginContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LoginProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LoginProvider>
    </AuthProvider>
  </StrictMode>
);