import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Toaster position="top-right" toastOptions={{ className: 'font-bold text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:border dark:border-slate-700' }} />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
