import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { AddressProvider } from './context/AddressContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';

import './styles/variables.css';
import './styles/global.css';
import './styles/responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <NotificationProvider>
          <AuthProvider>
            <AddressProvider>
              <RecentlyViewedProvider>
                <CartProvider>
                  <WishlistProvider>
                    <App />
                  </WishlistProvider>
                </CartProvider>
              </RecentlyViewedProvider>
            </AddressProvider>
          </AuthProvider>
        </NotificationProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
