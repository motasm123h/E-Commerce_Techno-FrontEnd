import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './app/CartContext.jsx';
import { AuthProvider } from './app/AuthContext.jsx';
import { PcBuilderProvider } from './app/PcBuilderContext'
import { SettingProvider } from './app/SettingContext'
import './index.css';
import { AppProvider } from './app/AppContext';

createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <AuthProvider>
            <CartProvider>
                <AppProvider>
                    <PcBuilderProvider>
                        <SettingProvider>
                            <App />
                        </SettingProvider>
                    </PcBuilderProvider>
                </AppProvider>
            </CartProvider>
        </AuthProvider>,
    {/* </StrictMode>, */}
);