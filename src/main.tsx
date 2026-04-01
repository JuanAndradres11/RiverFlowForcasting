import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'leaflet/dist/leaflet.css';


window.onerror = function (message, source, lineno, colno, error) {
  console.error("🔥 Global Error:", { message, source, lineno, colno, error });
};

window.onunhandledrejection = function (event) {
  console.error("🔥 Unhandled Promise:", event.reason);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
