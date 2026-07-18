import { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getSimpanan, getPembiayaan, getBerita } from './api';
import { ToggleButton } from './ThemeContext';

const SplitText = ({ children, baseDelay = 0, charDelay = 0.04, className = '' }) => (
  <span className={className}>
    {children.split('').map((char, i) => (
      <span
        key={i}
        className="inline-block animate-fadeInUp"
        style={{ animationDelay: `${baseDelay + i * charDelay}s` }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))}
  </span>
);

const IslamicPattern = ({ className = '', opacity = 0.05 }) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    style={{ opacity }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="islamicPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path
          d="M40 0 L80 40 L40 80 L0 40 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <path
          d="M40 25 L55 40 L40 55 L25 40 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#islamicPattern)" />
  </svg>
);

const MosqueSilhouette = ({ className = '' }) => (
  <svg
    viewBox="0 0 1200 200"
    className={`w-full ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="mosqueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    <g fill="url(#mosqueGrad)">
      <rect x="0" y="160" width="1200" height="40" />
      <rect x="100" y="120" width="200" height="40" rx="2" />
      <rect x="140" y="60" width="120" height="60" rx="2" />
      <ellipse cx="200" cy="60" rx="60" ry="30" />
      <rect x="195" y="20" width="10" height="40" />
      <circle cx="200" cy="18" r="6" />
      <rect x="80" y="40" width="8" height="80" />
      <rect x="312" y="40" width="8" height="80" />
      <circle cx="84" cy="38" r="8" />
      <circle cx="316" cy="38" r="8" />
      <rect x="500" y="100" width="200" height="60" rx="2" />
      <rect x="540" y="50" width="120" height="50" rx="2" />
      <ellipse cx="600" cy="50" rx="60" ry="35" />
      <rect x="595" y="5" width="10" height="45" />
      <circle cx="600" cy="3" r="7" />
      <rect x="470" y="30" width="10" height="90" />
      <rect x="720" y="30" width="10" height="90" />
      <circle cx="475" cy="28" r="9" />
      <circle cx="725" cy="28" r="9" />
      <rect x="900" y="110" width="180" height="50" rx="2" />
      <rect x="940" y="70" width="100" height="40" rx="2" />
      <ellipse cx="990" cy="70" rx="50" ry="25" />
      <rect x="985" y="38" width="10" height="32" />
      <circle cx="990" cy="35" r="5" />
    </g>
  </svg>
);

const renderIkonProduk = (nama, jenis) => {
  const warnaSg = jenis === "simpanan" ? "text-[var(--kop-blue)]" : "text-[var(--kop-green)]";

  if (nama.includes("Berjangka") || nama.includes("Multi")) {
    return <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${warnaSg}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  } else if (nama.includes("Idul Fitri") || nama.includes("Produktif")) {
    return <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${warnaSg}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
  } else if (nama.includes("Qurban") || nama.includes("Griya")) {
    return <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${warnaSg}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
  } else {
    return <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${warnaSg}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
  }
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-[var(--bg-card)] shadow-sm sticky top-0 z-50 border-b border-[var(--border-light)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/LogoBMTMaslahah2.png"
              alt="Logo BMT Maslahah"
              className="w-auto h-8 object-contain"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-8 text-[var(--text-secondary)] font-medium text-sm">
            <a href="#home" className="hover:text-[var(--kop-gold)] transition-colors">Beranda</a>
            <a href="#sejarah" className="hover:text-[var(--kop-gold)] transition-colors">Sejarah</a>
            <a href="#layanan" className="hover:text-[var(--kop-gold)] transition-colors">Layanan</a>
            <a href="#tentang" className="hover:text-[var(--kop-gold)] transition-colors">Tentang Kami</a>
            <a href="#kontak" className="hover:text-[var(--kop-gold)] transition-colors">Kontak</a>
          </div>
          <ToggleButton />
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-muted)] transition-colors text-[var(--text-secondary)]"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border-light)] bg-[var(--bg-card)] px-6 py-4 space-y-3 text-[var(--text-secondary)] font-medium shadow-lg">
          <a href="#home" onClick={() => handleNav('home')} className="block hover:text-[var(--kop-gold)] transition-colors">Beranda</a>
          <a href="#sejarah" onClick={() => handleNav('sejarah')} className="block hover:text-[var(--kop-gold)] transition-colors">Sejarah</a>
          <a href="#layanan" onClick={() => handleNav('layanan')} className="block hover:text-[var(--kop-gold)] transition-colors">Layanan</a>
          <a href="#tentang" onClick={() => handleNav('tentang')} className="block hover:text-[var(--kop-gold)] transition-colors">Tentang Kami</a>
          <a href="#kontak" onClick={() => handleNav('kontak')} className="block hover:text-[var(--kop-gold)] transition-colors">Kontak</a>
        </div>
      )}
    </nav>
  );
};

function renderDeskripsi(text) {
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part.split(/(\*[^*]+\*)/g).map((sub, k) => {
          if (sub.startsWith('*') && sub.endsWith('*')) {
            return <em key={`${j}-${k}`}>{sub.slice(1, -1)}</em>;
          }
          return sub;
        });
      })}
    </Fragment>
  ));
}

export default function App() {
  const [splash, setSplash] = useState(() => !sessionStorage.getItem('splashShown'));
  const [formData, setFormData] = useState({ nama: '', email: '', pesan: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('simpanan');
  const [produkSimpanan, setProdukSimpanan] = useState([]);
  const [produkPembiayaan, setProdukPembiayaan] = useState([]);
  const [beritaData, setBeritaData] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const carouselRef = useRef(null);
  const [slideIndexBerita, setSlideIndexBerita] = useState(0);
  const [cardsPerViewBerita, setCardsPerViewBerita] = useState(1);
  const [isPausedBerita, setIsPausedBerita] = useState(false);
  const carouselBeritaRef = useRef(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    getSimpanan().then(setProdukSimpanan).catch(() => {});
    getPembiayaan().then(setProdukPembiayaan).catch(() => {});
    getBerita().then(setBeritaData).catch(() => {});
  }, []);

  useEffect(() => {
    if (!splash) return;
    sessionStorage.setItem('splashShown', 'true');
    const timer = setTimeout(() => setSplash(false), 3000);
    return () => clearTimeout(timer);
  }, [splash]);

  useEffect(() => {
    const target = new Date('2026-07-17T00:00:00');
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const produkTampil = activeTab === 'simpanan' ? produkSimpanan : produkPembiayaan;
  const maxSlide = Math.max(0, produkTampil.length - cardsPerView);

  useEffect(() => {
    setSlideIndex(0);
  }, [activeTab]);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (!carouselRef.current) return;
      const w = carouselRef.current.offsetWidth;
      if (w >= 1024) setCardsPerView(4);
      else if (w >= 640) setCardsPerView(3);
      else setCardsPerView(1);
    };

    const observer = new ResizeObserver(updateCardsPerView);
    if (carouselRef.current) observer.observe(carouselRef.current);
    updateCardsPerView();
    return () => observer.disconnect();
  }, [produkTampil]);

  useEffect(() => {
    if (isPaused || maxSlide <= 0) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, maxSlide]);

  const maxSlideBerita = Math.max(0, beritaData.length - cardsPerViewBerita);

  useEffect(() => {
    setSlideIndexBerita(0);
  }, [beritaData]);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (!carouselBeritaRef.current) return;
      const w = carouselBeritaRef.current.offsetWidth;
      if (w >= 1024) setCardsPerViewBerita(4);
      else if (w >= 640) setCardsPerViewBerita(3);
      else setCardsPerViewBerita(1);
    };

    const observer = new ResizeObserver(updateCardsPerView);
    if (carouselBeritaRef.current) observer.observe(carouselBeritaRef.current);
    updateCardsPerView();
    return () => observer.disconnect();
  }, [beritaData]);

  useEffect(() => {
    if (isPausedBerita || maxSlideBerita <= 0) return;
    const timer = setInterval(() => {
      setSlideIndexBerita((prev) => (prev >= maxSlideBerita ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [isPausedBerita, maxSlideBerita]);

  if (splash) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999]" style={{ background: 'linear-gradient(135deg, #0d3b24 0%, #1a5c3a 40%, #0d3b24 100%)' }}>
        <IslamicPattern className="text-[var(--kop-gold)]" opacity={0.08} />
        <img
          src="/LogoBMTMaslahah1.png"
          alt="BMT Maslahah"
          className="h-36 w-auto mb-6 animate-pulse relative z-10"
        />
        <h1 className="text-2xl font-bold text-[var(--kop-gold)] relative z-10">
          <SplitText baseDelay={0.2}>BMT Maslahah</SplitText>
        </h1>
        <p className="text-sm font-semibold text-[var(--kop-gold-light)] mt-1 relative z-10">
          <SplitText baseDelay={0.8}>Selamat Milad ke-29</SplitText>
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-white/60 relative z-10">
          <span className="w-8 h-px bg-[var(--kop-gold)]/40"></span>
          <span>17 Juli 1997-2026</span>
          <span className="w-8 h-px bg-[var(--kop-gold)]/40"></span>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: 'loading', text: 'Mengirim pesan...' });

    try {
      setTimeout(() => {
        setStatusMsg({ type: 'success', text: 'Terima kasih! Pesan Anda telah terkirim.' });
        setFormData({ nama: '', email: '', pesan: '' });
      }, 1000);
    } catch (_error) {
      setTimeout(() => {
        setStatusMsg({ type: 'success', text: 'Terima kasih atas ketertarikan Anda!' });
        setFormData({ nama: '', email: '', pesan: '' });
      }, 1000);
    }
  };

  const timelineData = [
    { year: '1997', hijriah: '1417 H', title: 'Berdirinya BMT Maslahah', desc: 'Didirikan oleh para guru MMU Pondok Pesantren Sidogiri pada 12 Robi\'ul Awwal 1417 H (17 Juli 1997 M) sebagai wadah ekonomi syariah.' },
    { year: '2002', hijriah: '1423 H', title: 'Pertumbuhan Pesat', desc: 'Jumlah anggota meningkat signifikan, membuktikan kepercayaan masyarakat terhadap prinsip syariah yang diterapkan.' },
    { year: '2010', hijriah: '1431 H', title: 'Ekspansi Layanan', desc: 'Pengembangan produk pembiayaan dan simpanan untuk memenuhi kebutuhan anggota yang terus berkembang.' },
    { year: '2017', hijriah: '1439 H', title: 'Milad ke-20', desc: 'Perayaan dua dekade dedikasi dalam melayani umat dengan prinsip keadilan dan transparansi syariah.' },
    { year: '2022', hijriah: '1444 H', title: 'Digitalisasi Layanan', desc: 'Modernisasi sistem operasional untuk kemudahan akses layanan keuangan syariah bagi seluruh anggota.' },
    { year: '2026', hijriah: '1448 H', title: 'Milad ke-29', desc: 'Menginjak usia hampir tiga dekade, tetap teguh pada prinsip Amanah, Tangguh, dan Profesional.' },
  ];

  return (
    <div className="bg-[var(--bg-page)] min-h-screen text-[var(--text-primary)] font-sans antialiased">
      <Navbar />

      {/* Hero Section - Milad */}
      <section id="home" className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d3b24 0%, #1a5c3a 35%, #14503a 65%, #0d3b24 100%)' }}>
        <IslamicPattern className="text-[var(--kop-gold)]" opacity={0.06} />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-0 md:pt-24 md:pb-0">
          <div className="text-center space-y-6 mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-[var(--kop-gold)]/30 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[var(--kop-gold)] animate-pulse"></span>
              <span className="text-xs font-semibold text-[var(--kop-gold-light)] tracking-wider uppercase">17 Juli 1997-2026</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              <span className="block text-[var(--kop-gold-light)]" style={{ textShadow: '0 2px 20px rgba(201,168,76,0.3)' }}>Selamat Milad</span>
              <span className="block text-white mt-2">
                ke-<span className="text-[var(--kop-gold)]" style={{ textShadow: '0 0 30px rgba(201,168,76,0.5)' }}>29</span>
              </span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Koperasi BMT Maslahah menginjak usia hampir tiga dekade. Tetap teguh pada prinsip syariah, amanah, dan profesional dalam melayani umat.
            </p>

            <div className="flex items-center justify-center gap-3 text-[var(--kop-gold)]/80 text-sm">
              <span className="w-12 h-px bg-[var(--kop-gold)]/40"></span>
              <span className="font-arabic text-base">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</span>
              <span className="w-12 h-px bg-[var(--kop-gold)]/40"></span>
            </div>

            <p className="text-white/50 text-xs md:text-sm max-w-xl mx-auto italic">
              "Allah menghalalkan jual beli dan mengharamkan riba." (QS. Al-Baqarah: 275)
            </p>
          </div>

          {/* Countdown */}
          <div className="flex justify-center mb-10">
            <div className="grid grid-cols-4 gap-3 md:gap-5">
              {[
                { val: countdown.days, label: 'Hari' },
                { val: countdown.hours, label: 'Jam' },
                { val: countdown.minutes, label: 'Menit' },
                { val: countdown.seconds, label: 'Detik' },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 backdrop-blur-sm border border-[var(--kop-gold)]/20 rounded-xl px-4 py-3 md:px-6 md:py-4 text-center min-w-[60px] md:min-w-[80px] animate-pulse-gold">
                  <div className="text-2xl md:text-4xl font-bold text-[var(--kop-gold)]" style={{ textShadow: '0 0 10px rgba(201,168,76,0.3)' }}>
                    {String(item.val).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] md:text-xs text-white/60 mt-1 uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
            <a href="#layanan" className="bg-[var(--kop-gold)] hover:bg-[var(--kop-gold-light)] text-[#0d3b24] text-center px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-[var(--kop-gold)]/20 hover:shadow-xl">
              Jelajahi Layanan Kami
            </a>
            <a href="#sejarah" className="bg-white/10 backdrop-blur-sm border-2 border-[var(--kop-gold)]/40 text-white hover:bg-white/20 text-center px-8 py-3.5 rounded-xl font-bold transition-all">
              Lihat Sejarah Kami
            </a>
          </div>
        </div>

        <div className="text-[var(--kop-green-dark)]">
          <MosqueSilhouette />
        </div>
      </section>

      {/* Section Sejarah / Timeline */}
      <section id="sejarah" className="bg-[var(--bg-card)] py-20 border-b border-[var(--border-light)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <div className="inline-block bg-[var(--kop-gold)]/10 text-[var(--kop-gold)] text-xs font-bold px-3 py-1 rounded border border-[var(--kop-gold)]/20">
              Perjalanan Panjang
            </div>
            <h2 className="text-3xl font-bold text-[var(--kop-blue)]">Sejarah BMT Maslahah</h2>
            <p className="text-[var(--text-tertiary)] text-sm md:text-base">
              Dari sebuah keprihatinan para guru hingga menjadi lembaga keuangan syariah yang dipercaya masyarakat.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-[var(--kop-gold)]/40 via-[var(--kop-green)]/40 to-transparent hidden md:block"></div>

            <div className="space-y-12">
              {timelineData.map((item, idx) => (
                <div key={item.year} className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`bg-[var(--bg-page)] border border-[var(--border-light)] rounded-2xl p-6 hover:shadow-lg transition-all hover:border-[var(--kop-gold)]/30 group`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-extrabold text-[var(--kop-gold)] group-hover:text-[var(--kop-green)] transition-colors">{item.year}</span>
                        <span className="text-xs text-[var(--kop-green)] bg-[var(--kop-green)]/10 px-2 py-0.5 rounded-full font-semibold">{item.hijriah}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--kop-blue)] mb-2">{item.title}</h3>
                      <p className="text-[var(--text-tertiary)] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex w-12 h-12 rounded-full bg-[var(--kop-gold)] border-4 border-[var(--bg-card)] items-center justify-center shrink-0 z-10 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <div className="w-full md:w-1/2 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Section */}
      <section id="layanan" className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg-page) 0%, #f0f7f0 50%, var(--bg-page) 100%)' }}>
        <IslamicPattern className="text-[var(--kop-green)]" opacity={0.03} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <div className="inline-block bg-[var(--kop-gold)]/10 text-[var(--kop-gold)] text-xs font-bold px-3 py-1 rounded border border-[var(--kop-gold)]/20">
              Produk & Layanan
            </div>
            <h2 className="text-3xl font-bold text-[var(--kop-blue)]">Layanan Finansial Kami</h2>
            <p className="text-[var(--text-tertiary)] text-sm md:text-base">
              Produk keuangan syariah yang dirancang transparan dan fleksibel untuk memenuhi kebutuhan masa depan maupun pengembangan usaha Anda.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-[var(--bg-card)] p-1.5 rounded-xl border border-[var(--border-light)] inline-flex space-x-1 shadow-sm">
              <button
                onClick={() => setActiveTab('simpanan')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'simpanan'
                  ? 'bg-[var(--kop-green)] text-white shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--kop-green)]'
                  }`}
              >
                Produk Simpanan
              </button>
              <button
                onClick={() => setActiveTab('pembiayaan')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'pembiayaan'
                  ? 'bg-[var(--kop-green)] text-white shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--kop-green)]'
                  }`}
              >
                Produk Pembiayaan
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {slideIndex > 0 && (
              <button
                onClick={() => setSlideIndex((p) => Math.max(0, p - 1))}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg-card)] hover:bg-white shadow-lg rounded-full p-2 transition-all border border-[var(--border-light)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${slideIndex * (100 / cardsPerView)}%)` }}
              >
                {produkTampil.map((item) => (
                  <div
                    key={item.id}
                    className="px-2 flex-shrink-0"
                    style={{ width: `${100 / cardsPerView}%` }}
                  >
                    <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--kop-gold)]/30 transition-all hover:shadow-md flex flex-col justify-between group h-full">
                      <div>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all ${activeTab === 'simpanan'
                          ? 'bg-[var(--kop-blue)]/10 group-hover:bg-[var(--kop-blue)] group-hover:text-white'
                          : 'bg-[var(--kop-green)]/10 group-hover:bg-[var(--kop-green)] group-hover:text-white'
                          }`}>
                          {renderIkonProduk(item.nama_produk, item.kategori)}
                        </div>

                        <h3 className="text-lg font-bold text-[var(--kop-blue)] mb-2 tracking-tight group-hover:text-[var(--kop-green)] transition-colors">
                          {item.nama_produk}
                        </h3>

                        <p className="text-[var(--text-tertiary)] text-xs md:text-sm leading-relaxed">
                          {item.deskripsi[0]}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[var(--border-medium)]/50 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedProduct(item)}
                          className="text-[11px] font-semibold text-[var(--text-muted)] group-hover:text-[var(--kop-green)] transition-colors"
                        >
                          Pelajari Akad
                        </button>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--text-muted)] transform group-hover:translate-x-1 group-hover:text-[var(--kop-green)] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {slideIndex < maxSlide && (
              <button
                onClick={() => setSlideIndex((p) => Math.min(maxSlide, p + 1))}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg-card)] hover:bg-white shadow-lg rounded-full p-2 transition-all border border-[var(--border-light)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {maxSlide > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`rounded-full transition-all duration-300 ${i === slideIndex
                      ? 'bg-[var(--kop-green)] w-5 h-2'
                      : 'bg-[var(--bg-inactive)] w-2 h-2 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section Berita Perkoprasian */}
      <section id="berita" className="max-w-7xl mx-auto px-6 py-20 bg-[var(--bg-page)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-3 max-w-xl">
            <div className="inline-block bg-[var(--kop-gold)]/10 text-[var(--kop-gold)] text-xs font-bold px-3 py-1 rounded border border-[var(--kop-gold)]/20">
              Edukasi & Informasi
            </div>
            <h2 className="text-3xl font-bold text-[var(--kop-blue)]">Berita Perkoprasian</h2>
            <p className="text-[var(--text-tertiary)] text-sm">
              Ikuti perkembangan terbaru, regulasi pemerintah, dan tips pengelolaan keuangan syariah terkini dari kami.
            </p>
          </div>
          <a
            href="/berita/3"
            className="text-sm font-semibold text-[var(--kop-green)] hover:text-[var(--kop-green-hover)] flex items-center gap-1 group transition-colors"
          >
            Lihat Semua Berita
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div
          ref={carouselBeritaRef}
          className="relative"
          onMouseEnter={() => setIsPausedBerita(true)}
          onMouseLeave={() => setIsPausedBerita(false)}
        >
          {slideIndexBerita > 0 && (
            <button
              onClick={() => setSlideIndexBerita((p) => Math.max(0, p - 1))}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg-card)] hover:bg-white shadow-lg rounded-full p-2 transition-all border border-[var(--border-light)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${slideIndexBerita * (100 / cardsPerViewBerita)}%)` }}
            >
              {beritaData.map((item) => (
                <div
                  key={item.id}
                  className="px-2 flex-shrink-0"
                  style={{ width: `${100 / cardsPerViewBerita}%` }}
                >
                  <article className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-6 flex flex-col justify-between hover:border-[var(--kop-gold)]/30 hover:shadow-lg transition-all duration-300 group h-full">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
                        <span className="text-[var(--kop-green)] bg-[var(--kop-green)]/5 px-2.5 py-0.5 rounded-full border border-[var(--kop-green)]/10">
                          {item.kategori}
                        </span>
                        <span>{item.tanggal}</span>
                      </div>

                      <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--kop-green)] transition-colors">
                        <a href={"berita/" + item.id} rel="noopener noreferrer">
                          {item.judul}
                        </a>
                      </h3>

                      <p className="text-[var(--text-tertiary)] text-sm line-clamp-3 leading-relaxed">
                        {item.ringkasan}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[var(--border-light)]">
                      <a
                        href={"berita/" + item.id}
                        className="inline-flex items-center text-xs font-bold text-[var(--kop-green)] group-hover:text-[var(--kop-gold)] transition-colors gap-1"
                      >
                        Baca Selengkapnya
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {slideIndexBerita < maxSlideBerita && (
            <button
              onClick={() => setSlideIndexBerita((p) => Math.min(maxSlideBerita, p + 1))}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg-card)] hover:bg-white shadow-lg rounded-full p-2 transition-all border border-[var(--border-light)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {maxSlideBerita > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: maxSlideBerita + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndexBerita(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === slideIndexBerita
                    ? 'bg-[var(--kop-green)] w-5 h-2'
                    : 'bg-[var(--bg-inactive)] w-2 h-2 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section Tentang Kami */}
      <section id="tentang" className="relative py-20 border-b border-[var(--border-light)] overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg-card) 0%, #f8f6f0 50%, var(--bg-card) 100%)' }}>
        <IslamicPattern className="text-[var(--kop-gold)]" opacity={0.04} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-20">

          {/* Sejarah & Visi Misi */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <div className="inline-block bg-[var(--kop-gold)]/10 text-[var(--kop-gold)] text-xs font-bold px-3 py-1 rounded border border-[var(--kop-gold)]/20">
                Profil Koperasi
              </div>
              <h2 className="text-3xl font-bold text-[var(--kop-blue)]">Sejarah Singkat</h2>
              <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed text-justify">
                Koperasi BMT MASLAHAH yang semula bernama Koperasi BMT MMU (Maslahah Mursalah lil Ummah) berkedudukan di Jl. Raya Sidogiri No. 10 Desa Sidogiri Kecamatan Kraton Kabupaten Pasuruan, berdiri pada tanggal 12 Robi'ul Awwal 1417 H atau 17 Juli 1997 M. Terbentuknya koperasi ini bermula dari sebuah keprihatinan dari para guru MMU (Madrasah Miftahul Ulum) Pondok Pesantren Sidogiri menatap realita prilaku masyarakat yang cenderung kurang memerhatikan kaidah-kaidah syariah bidang muamalah, yaitu adanya praktik-praktik yang mengarah pada ekonomi ribawi yang dilarang tegas oleh agama.
              </p>
            </div>

            <div className="bg-[var(--bg-page)] border border-[var(--border-light)] p-8 rounded-2xl space-y-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[var(--kop-blue)] flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-4 bg-[var(--kop-gold)] rounded-full"></span>
                  Visi Kami
                </h3>
                <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                  Menjadi lembaga keuangan syariah yang amanah, tangguh, professional dan mampu memberikan pelayanan prima dalam meningkatkan pendapatan dan kesejahteraan anggota dan masyarakat.
                </p>
              </div>

              <div className="w-full h-[1px] bg-[var(--border-light)]"></div>

              <div>
                <h3 className="text-lg font-bold text-[var(--kop-blue)] flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-4 bg-[var(--kop-gold)] rounded-full"></span>
                  Misi Kami
                </h3>
                <ul className="space-y-2.5 text-[var(--text-secondary)] text-sm md:text-base">
                  {[
                    'Mengelola Koperasi dan unit usaha secara profesional dengan menerapkan prinsip "Good Corporate Governance" untuk menciptakan kesejahteraan anggota.',
                    'Meningkatkan pelayanan dan peran serta pengembangan koperasi ke arah yang lebih maju dan produktif dalam mewujudkan penerapan syariah kaffah.',
                    'Meningkatkan pembinaan anggota sebagai edukasi menuju koperasi yang berkualitas.',
                    'Membangun kemitraan dengan pihak lain dalam pengembangan koperasi.',
                    'Mengembangkan kepedulian sosial.',
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-gold)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full h-[1px] bg-[var(--border-light)]"></div>

              <div>
                <h3 className="text-lg font-bold text-[var(--kop-blue)] flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-4 bg-[var(--kop-gold)] rounded-full"></span>
                  MOTTO
                </h3>
                <p className="text-[var(--kop-green)] font-bold text-base md:text-lg italic">
                  "Syariah Menjadikan Berkah"
                </p>
              </div>
            </div>
          </div>

          {/* Struktur Organisasi */}
          <div className="space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-[var(--kop-blue)]">Struktur Organisasi</h2>
              <p className="text-[var(--text-tertiary)] text-xs md:text-sm">
                Sinergi kepemimpinan profesional yang berkomitmen menjaga amanah dan regulasi secara konsisten.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[var(--bg-page)] border border-[var(--border-light)] rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center border-b border-[var(--border-medium)] pb-3">
                  <h3 className="font-bold text-[var(--kop-blue)]">Susunan Pengurus Koperasi</h3>
                  <span className="text-[10px] uppercase font-bold text-[var(--kop-gold)] bg-[var(--kop-gold)]/10 px-2 py-0.5 rounded border border-[var(--kop-gold)]/20">
                    Pengawas & Penasihat
                  </span>
                </div>
                <div className="aspect-[4/3] bg-[var(--bg-placeholder)] rounded-xl overflow-hidden relative group border border-[var(--border-light)]">
                  <img
                    src="/images/susunan-pengurus.png"
                    alt="Bagan Susunan Pengurus Koperasi"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setLightboxImg("/images/susunan-pengurus.png")}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  * Menjalankan fungsi pengawasan operational, kepatuhan prinsip syariah, serta penetapan kebijakan strategis tahunan koperasi.
                </p>
              </div>

              <div className="bg-[var(--bg-page)] border border-[var(--border-light)] rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center border-b border-[var(--border-medium)] pb-3">
                  <h3 className="font-bold text-[var(--kop-blue)]">Susunan Direksi & Eksekutif</h3>
                  <span className="text-[10px] uppercase font-bold text-[var(--kop-gold)] bg-[var(--kop-gold)]/10 px-2 py-0.5 rounded border border-[var(--kop-gold)]/20">
                    Tim Manajemen
                  </span>
                </div>
                <div className="aspect-[4/3] bg-[var(--bg-placeholder)] rounded-xl overflow-hidden relative group border border-[var(--border-light)]">
                  <img
                    src="/images/susunan-direksi.png"
                    alt="Bagan Susunan Direksi & Manajemen"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setLightboxImg("/images/susunan-direksi.png")}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  * Tim pelaksana eksekutif profesional yang bertugas mengelola perputaran dana, operasional harian, dan pelayanan anggota.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Kontak Section */}
      <section id="kontak" className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border-light)] overflow-hidden grid md:grid-cols-5">
          <div className="p-8 md:col-span-2 text-white flex flex-col justify-between" style={{ background: 'linear-gradient(160deg, #0d3b24 0%, #1a5c3a 100%)' }}>
            <IslamicPattern className="text-white" opacity={0.05} />
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-bold">Konsultasi Gratis</h3>
              <p className="text-sm text-white/70 leading-relaxed">Punya pertanyaan seputar keanggotaan atau produk kami? Hubungi tim representatif kami sekarang.</p>
            </div>
            <div className="relative z-10 space-y-4 pt-8 md:pt-0 text-sm text-white/80">
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href="https://wa.me/6282561242155115" target="_blank" rel="noopener noreferrer" className="hover:underline">082561242155115</a>
              </p>
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <a href="mailto:bmt.maslahah@gmail.com" className="hover:underline">bmt.maslahah@gmail.com</a>
              </p>
              <p className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Jl. Raya Sidogiri no. 10 Sidogiri Kraton Pasuruan</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:col-span-3 space-y-4 bg-[var(--bg-card)]">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-[var(--border-medium)] rounded-lg focus:outline-none focus:border-[var(--kop-green)] bg-[var(--bg-page)] text-sm transition-colors"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase mb-1">Alamat Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-[var(--border-medium)] rounded-lg focus:outline-none focus:border-[var(--kop-green)] bg-[var(--bg-page)] text-sm transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase mb-1">Pesan Anda</label>
              <textarea
                rows="3"
                required
                className="w-full px-4 py-2 border border-[var(--border-medium)] rounded-lg focus:outline-none focus:border-[var(--kop-green)] bg-[var(--bg-page)] text-sm resize-none transition-colors"
                value={formData.pesan}
                onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
              ></textarea>
            </div>

            {statusMsg.text && (
              <div className={`text-xs p-3 rounded-lg font-medium ${statusMsg.type === 'success' ? 'bg-[var(--kop-green)]/10 text-[var(--kop-green)]' : 'bg-[var(--kop-blue)]/10 text-[var(--kop-blue)]'
                }`}>
                {statusMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[var(--kop-green)] hover:bg-[var(--kop-green-hover)] text-white py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md"
            >
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0d3b24 0%, #1a5c3a 50%, #0d3b24 100%)' }}>
        <IslamicPattern className="text-white" opacity={0.04} />

        <div className="relative z-10 py-10">
          <div className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="text-center">
              <p className="text-[var(--kop-gold)]/80 text-xs italic">
                "Dan Allah telah menghalalkan jual beli dan mengharamkan riba." (QS. Al-Baqarah: 275)
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-between items-center gap-3 text-xs text-white/60">
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                <a href="https://wa.me/6282561242155115" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[var(--kop-gold)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  082561242155115
                </a>
                <a href="mailto:bmt.maslahah@gmail.com" className="flex items-center gap-1.5 hover:text-[var(--kop-gold)] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  bmt.maslahah@gmail.com
                </a>
                <span className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Jl. Raya Sidogiri no. 10
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40 border-t border-white/10 pt-4">
              <div>
                &copy; 2026 Koperasi BMT Maslahah. Hak Cipta Dilindungi.
              </div>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-[var(--kop-gold)] transition-colors">Kebijakan Privasi</a>
                <a href="#" className="hover:text-[var(--kop-gold)] transition-colors">Syarat & Ketentuan</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
            alt="Struktur Organisasi"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {selectedProduct && (
        <InfoModal produk={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

function InfoModal({ produk, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${produk.kategori === 'simpanan'
                ? 'bg-[var(--kop-blue)]/10 text-[var(--kop-blue)]'
                : 'bg-[var(--kop-green)]/10 text-[var(--kop-green)]'
              }`}>
              {renderIkonProduk(produk.nama_produk, produk.kategori)}
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${produk.kategori === 'simpanan' ? 'text-[var(--kop-blue)]' : 'text-[var(--kop-green)]'
                }`}>
                {produk.kategori}
              </span>
              <h3 className="text-lg font-bold text-[var(--kop-blue)]">{produk.nama_produk}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="w-full h-px bg-[var(--bg-muted)]" />

        <div className="space-y-3">
          {produk.deskripsi.map((paragraf, i) => (
            <p key={i} className="text-[var(--text-secondary)] text-sm leading-relaxed">{renderDeskripsi(paragraf)}</p>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[var(--kop-green)] hover:bg-[var(--kop-green-hover)] text-white py-2.5 rounded-lg font-semibold text-sm transition-all"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
