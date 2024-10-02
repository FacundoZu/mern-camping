import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';

const clientId = '257433342375-p0ubsflo34ndkinq479eseb2mis9hg71.apps.googleusercontent.com';


createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <React.StrictMode >
            <GoogleOAuthProvider clientId={clientId}>
                <App />
            </GoogleOAuthProvider>
        </React.StrictMode>
    </AuthProvider>
)
