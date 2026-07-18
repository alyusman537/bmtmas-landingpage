import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import App from './App';
import DetailBerita from './DetailBerita';
import GaleriPage from './GaleriPage';
import Admin from './Admin';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/berita/:id" element={<DetailBerita />} />
          <Route path="/galeri" element={<GaleriPage />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);