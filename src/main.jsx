
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './Routers/Router';
import AuthProvider from './Providers/AuthProviders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';


// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}> {/* Make sure QueryClientProvider is here */}
          <RouterProvider router={router} />
          <Toaster position="top-right" reverseOrder={false} />
        </QueryClientProvider>
      </HelmetProvider>
    </AuthProvider>
  </StrictMode>
);

