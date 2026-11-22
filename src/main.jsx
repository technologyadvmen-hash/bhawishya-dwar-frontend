import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import './i18n/index.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#35243B',
              border: '1px solid #EADFED',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              boxShadow: '0 4px 20px rgba(100,26,120,0.12)',
            },
            success: { iconTheme: { primary: '#641A78', secondary: '#FFF9F0' } },
            error:   { iconTheme: { primary: '#e53e3e', secondary: '#FFF9F0' } },
          }}
        />
      </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>,
)
