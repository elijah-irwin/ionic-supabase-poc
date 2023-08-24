import React from 'react';
import { createRoot } from 'react-dom/client';

// Main Entry.
import App from './App';

// Contexts.
import { AuthProvider } from './contexts/AuthContext';

const container = document.getElementById('root');
const root = createRoot(container!);

// Render.
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
