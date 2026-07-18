import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGaleri } from './api';
import { ToggleButton } from './ThemeContext';

export default function GaleriPage() {
  const [galeriData, setGaleriData] = useState([]);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGaleri()
      .then(setGaleriData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[var(--bg-page)] min-h-screen text-[var(--text-primary)] font-sans antialiased">
      {/* Navbar */}
      <nav className="bg-[var(--bg-card)] shadow-sm sticky top-0 z-50 border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/LogoBMTMaslahah2.png" alt="Logo BMT Maslahah" className="w-auto h-8 object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <ToggleButton />
            <Link
              to="/"
              className="text-sm font-semibold text-[var(--kop-blue)] hover:text-[var(--kop-blue-hover)] transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8 space-y-3">
        <div className="inline-block bg-[var(--kop-blue)]/10 text-[var(--kop-blue)] text-xs font-bold px-3 py-1 rounded">
          Dokumentasi Kegiatan
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--kop-blue)]">Galeri Kami</h1>
        <p className="text-[var(--text-tertiary)] text-sm md:text-base max-w-2xl">
          Kumpulan momen dan kegiatan koperasi BMT Maslahah yang kami abadikan.
        </p>
      </div>

      {/* Grid Galeri */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden border border-[var(--border-light)] bg-[var(--bg-card)]">
                <div className="aspect-square bg-[var(--bg-muted)]" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-[var(--bg-muted)] rounded w-3/4" />
                  <div className="h-2 bg-[var(--bg-muted)] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : galeriData.length === 0 ? (
          <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--text-muted)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[var(--text-muted)] text-sm">Belum ada foto galeri.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galeriData.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border border-[var(--border-light)] hover:shadow-lg transition-all duration-300 cursor-pointer bg-[var(--bg-card)]"
                onClick={() => setLightboxImg(item.foto_url)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.foto_url}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{item.judul}</p>
                  {item.keterangan && (
                    <p className="text-xs text-[var(--text-muted)] truncate mt-1">{item.keterangan}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxImg}
            alt="Galeri"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
