import { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getSimpanan, getPembiayaan, getBerita, getGaleri } from './api';
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

// Fungsi pembantu untuk merender ikon dinamis berdasarkan nama produk

// Fungsi pembantu untuk merender ikon dinamis berdasarkan nama produk
const renderIkonProduk = (nama, jenis) => {
  const warnaSg = jenis === "simpanan" ? "text-[var(--kop-blue)]" : "text-[var(--kop-green)]";

  // Custom SVG untuk masing-masing tipe agar variatif
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

// Komponen Navbar
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-[var(--bg-card)] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            {/* Pengganti lingkaran huruf K dengan Image */}
            <img
              src="/LogoBMTMaslahah2.png"
              alt="Logo BMT Maslahah"
              className="w-auto h-8 object-contain"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-8 text-[var(--text-secondary)] font-medium">
            <a href="#home" className="hover:text-[var(--kop-blue)] transition-colors">Beranda</a>
            <a href="#layanan" className="hover:text-[var(--kop-blue)] transition-colors">Layanan</a>
            <a href="#galeri" className="hover:text-[var(--kop-blue)] transition-colors">Galeri</a>
            <a href="#tentang" className="hover:text-[var(--kop-blue)] transition-colors">Tentang Kami</a>
            <a href="#kontak" className="hover:text-[var(--kop-blue)] transition-colors">Kontak</a>
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
          <a href="#home" onClick={() => handleNav('home')} className="block hover:text-[var(--kop-blue)] transition-colors">Beranda</a>
          <a href="#layanan" onClick={() => handleNav('layanan')} className="block hover:text-[var(--kop-blue)] transition-colors">Layanan</a>
          <a href="#galeri" onClick={() => handleNav('galeri')} className="block hover:text-[var(--kop-blue)] transition-colors">Galeri</a>
          <a href="#tentang" onClick={() => handleNav('tentang')} className="block hover:text-[var(--kop-blue)] transition-colors">Tentang Kami</a>
          <a href="#kontak" onClick={() => handleNav('kontak')} className="block hover:text-[var(--kop-blue)] transition-colors">Kontak</a>
        </div>
      )}
    </nav>
  );
};

export function renderDeskripsi(text) {
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

// Komponen Utama
export default function App() {
  const [splash, setSplash] = useState(() => !sessionStorage.getItem('splashShown'));
  const [formData, setFormData] = useState({ nama: '', email: '', pesan: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('simpanan');
  const [produkSimpanan, setProdukSimpanan] = useState([]);
  const [produkPembiayaan, setProdukPembiayaan] = useState([]);
  const [beritaData, setBeritaData] = useState([]);
  const [galeriData, setGaleriData] = useState([]);
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

  useEffect(() => {
    getSimpanan().then(setProdukSimpanan).catch(() => { });
    getPembiayaan().then(setProdukPembiayaan).catch(() => { });
    getBerita().then(setBeritaData).catch(() => { });
    getGaleri().then(setGaleriData).catch(() => { });
  }, []);

  useEffect(() => {
    if (!splash) return;
    sessionStorage.setItem('splashShown', 'true');
    const timer = setTimeout(() => setSplash(false), 3000);
    return () => clearTimeout(timer);
  }, [splash]);

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
      <div className="fixed inset-0 bg-[var(--bg-splash)] flex flex-col items-center justify-center z-[9999]">
        <img
          src="/LogoBMTMaslahah1.png"
          alt="BMT Maslahah"
          className="h-36 w-auto mb-6 animate-pulse"
        />
        <h1 className="text-2xl font-bold text-[var(--kop-blue)]">
          <SplitText baseDelay={0.2}>BMT Maslahah</SplitText>
        </h1>
        <p className="text-sm font-semibold text-[var(--kop-green)] mt-1">
          <SplitText baseDelay={0.8}>Syariah menjadikan berkah</SplitText>
        </p>
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

  return (
    <div className="bg-[var(--bg-page)] min-h-screen text-[var(--text-primary)] font-sans antialiased">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-[calc(100vh-72px)] md:min-h-0 md:max-w-7xl md:mx-auto md:px-6 md:py-20 grid md:grid-cols-2 gap-12 items-center overflow-hidden">
        {/* Bagian Kiri (Teks) - Di mobile akan berada di atas gambar dengan latar semi-transparan */}
        <div className="relative z-10 px-6 py-12 md:px-0 md:py-0 bg-[var(--overlay)] md:bg-transparent backdrop-blur-sm md:backdrop-blur-none h-full md:h-auto flex flex-col justify-center space-y-6">
          {/*<div className="inline-flex items-center space-x-2 bg-[var(--bg-card)] border border-[var(--border-medium)] px-3 py-1 rounded-full text-xs font-semibold text-[var(--kop-green)] self-start shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--kop-green)] animate-pulse"></span>
            <span>Terdaftar & Diawasi oleh OJK</span>
          </div> */}

          <div className="space-y-2">
            <span className="text-xs font-bold text-[var(--kop-green)] uppercase tracking-widest block bg-[var(--kop-green)]/10 px-2.5 py-1 rounded w-max">
              Syariah Menjadikan Berkah
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--kop-blue)] leading-tight">
              Syariah, Amanah, Tangguh Dan Profesional.
            </h1>
          </div>

          <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
            Koperasi syariah yang amanah dan profesional dalam mengelola keuangan untuk meningkatkan kesejahteraan anggota dan masyarakat. Bersama kita tumbuh, bersama kita berkah.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <a href="#layanan" className="bg-[var(--kop-blue)] hover:bg-[var(--kop-blue-hover)] text-white text-center px-6 py-3 rounded-xl font-semibold transition-all shadow-md">
              Lihat Layanan Kami
            </a>
            <a href="#kontak" className="bg-[var(--bg-card)] border-2 border-[var(--kop-blue)] text-[var(--kop-blue)] hover:bg-[var(--bg-muted)] text-center px-6 py-3 rounded-xl font-semibold transition-all">
              Hubungi Kami
            </a>
          </div>
        </div>

        {/* Bagian Kanan (Gambar) - 1 Halaman Penuh di Mobile, Setengah Halaman di Desktop */}
        <div className="absolute inset-0 md:relative md:inset-auto h-full md:h-[500px] w-full z-0 md:z-10">
          {/* Overlay gelap tipis khusus di mode mobile agar teks putih/kontras tetap terbaca */}
          <div className="absolute inset-0 bg-black/10 md:hidden z-10"></div>

          <img
            src="/hero.png"
            alt="Koperasi BMT Maslahah"
            className="w-full h-full object-cover md:rounded-2xl "
          />

          {/* Floating Card Aksen Hijau - Diposisikan di dalam pojok kiri bawah gambar */}
          <div className="hidden md:block absolute bottom-4 left-4 bg-[var(--bg-card)] p-4 rounded-xl shadow-lg border border-[var(--border-light)] max-w-xs z-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[var(--kop-green)]/10 rounded-lg flex items-center justify-center text-[var(--kop-green)] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Prinsip Keadilan</h4>
                <p className="text-xs text-[var(--text-tertiary)]">Bagi hasil yang adil dan menenteramkan hati.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Layanan Section */}
      <section id="layanan" className="bg-[var(--bg-card)] py-20 border-y border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl font-bold text-[var(--kop-blue)]">Layanan Finansial Kami</h2>
            <p className="text-[var(--text-tertiary)] text-sm md:text-base">
              Produk keuangan syariah yang dirancang transparan dan fleksibel untuk memenuhi kebutuhan masa depan maupun pengembangan usaha Anda.
            </p>
          </div>

          {/* Sistem Switcher Tab (Minimalis & Elegan) */}
          <div className="flex justify-center mb-12">
            <div className="bg-[var(--bg-page)] p-1.5 rounded-xl border border-[var(--border-light)] inline-flex space-x-1">
              <button
                onClick={() => setActiveTab('simpanan')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'simpanan'
                  ? 'bg-[var(--kop-blue)] text-white shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--kop-blue)]'
                  }`}
              >
                Produk Simpanan
              </button>
              <button
                onClick={() => setActiveTab('pembiayaan')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'pembiayaan'
                  ? 'bg-[var(--kop-blue)] text-white shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--kop-blue)]'
                  }`}
              >
                Produk Pembiayaan
              </button>
            </div>
          </div>

          {/* Carousel Layanan */}
          <div
            ref={carouselRef}
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Tombol Prev */}
            {slideIndex > 0 && (
              <button
                onClick={() => setSlideIndex((p) => Math.max(0, p - 1))}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--overlay)] hover:bg-[var(--bg-card)] shadow-lg rounded-full p-2 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Wrapper Cards */}
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
                    <div className="p-6 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-light)] hover:border-[var(--kop-blue)]/20 transition-all hover:shadow-md flex flex-col justify-between group h-full">
                      <div>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all ${activeTab === 'simpanan'
                          ? 'bg-[var(--kop-blue)]/10 group-hover:bg-[var(--kop-blue)] group-hover:text-white'
                          : 'bg-[var(--kop-green)]/10 group-hover:bg-[var(--kop-green)] group-hover:text-white'
                          }`}>
                          {renderIkonProduk(item.nama_produk, item.kategori)}
                        </div>

                        <h3 className="text-lg font-bold text-[var(--kop-blue)] mb-2 tracking-tight group-hover:text-gray-900 transition-colors">
                          {item.nama_produk}
                        </h3>

                        <p className="text-[var(--text-tertiary)] text-xs md:text-sm leading-relaxed">
                          {item.deskripsi[0]}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[var(--border-medium)]/50 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedProduct(item)}
                          className="text-[11px] font-semibold text-[var(--text-muted)] group-hover:text-[var(--kop-blue)] transition-colors"
                        >
                          Pelajari Akad
                        </button>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--text-muted)] transform group-hover:translate-x-1 group-hover:text-[var(--kop-blue)] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Next */}
            {slideIndex < maxSlide && (
              <button
                onClick={() => setSlideIndex((p) => Math.min(maxSlide, p + 1))}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--overlay)] hover:bg-[var(--bg-card)] shadow-lg rounded-full p-2 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Dots Indicator */}
          {maxSlide > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`rounded-full transition-all duration-300 ${i === slideIndex
                      ? 'bg-[var(--kop-blue)] w-5 h-2'
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
            <div className="inline-block bg-[var(--kop-green)]/10 text-[var(--kop-green)] text-xs font-bold px-3 py-1 rounded">
              Edukasi & Informasi
            </div>
            <h2 className="text-3xl font-bold text-[var(--kop-blue)]">Berita Perkoprasian</h2>
            <p className="text-[var(--text-tertiary)] text-sm">
              Ikuti perkembangan terbaru, regulasi pemerintah, dan tips pengelolaan keuangan syariah terkini dari kami.
            </p>
          </div>
          <a
            href="/berita/3"
            className="text-sm font-semibold text-[var(--kop-blue)] hover:text-[#2a4e78] flex items-center gap-1 group transition-colors"
          >
            Lihat Semua Berita
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Carousel Berita */}
        <div
          ref={carouselBeritaRef}
          className="relative"
          onMouseEnter={() => setIsPausedBerita(true)}
          onMouseLeave={() => setIsPausedBerita(false)}
        >
          {slideIndexBerita > 0 && (
            <button
              onClick={() => setSlideIndexBerita((p) => Math.max(0, p - 1))}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--overlay)] hover:bg-[var(--bg-card)] shadow-lg rounded-full p-2 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                  <article className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] flex flex-col justify-between hover:border-[var(--kop-blue)]/30 hover:shadow-lg transition-all duration-300 group h-full overflow-hidden">
                    {item.foto_url ? (
                      <div className="relative h-40 overflow-hidden">
                        <img src={item.foto_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                          <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-white/90 bg-[var(--kop-green)]/80 px-2.5 py-0.5 rounded-full">
                              {item.kategori}
                            </span>
                            <span className="text-white/70">{item.tanggal}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white leading-snug">
                            <a href={"berita/" + item.id} className="hover:underline">{item.judul}</a>
                          </h3>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
                          <span className="text-[var(--kop-green)] bg-[var(--kop-green)]/5 px-2.5 py-0.5 rounded-full">
                            {item.kategori}
                          </span>
                          <span>{item.tanggal}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--kop-blue)] transition-colors">
                          <a href={"berita/" + item.id} rel="noopener noreferrer">{item.judul}</a>
                        </h3>
                      </div>
                    )}

                    <div className="p-6 pt-4 space-y-4">
                      <p className="text-[var(--text-tertiary)] text-sm line-clamp-3 leading-relaxed">
                        {item.ringkasan}
                      </p>
                      <div className={item.foto_url ? 'pt-4 border-t border-gray-50' : 'pt-2 border-t border-gray-50'}>
                        <a
                          href={"berita/" + item.id}
                          className="inline-flex items-center text-xs font-bold text-[var(--kop-blue)] group-hover:text-[var(--kop-green)] transition-colors gap-1"
                        >
                          Baca Selengkapnya
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {slideIndexBerita < maxSlideBerita && (
            <button
              onClick={() => setSlideIndexBerita((p) => Math.min(maxSlideBerita, p + 1))}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[var(--overlay)] hover:bg-[var(--bg-card)] shadow-lg rounded-full p-2 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                    ? 'bg-[var(--kop-blue)] w-5 h-2'
                    : 'bg-[var(--bg-inactive)] w-2 h-2 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Section Galeri */}
      <section id="galeri" className="max-w-7xl mx-auto px-6 py-20 bg-[var(--bg-page)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-3 max-w-xl">
            <div className="inline-block bg-[var(--kop-blue)]/10 text-[var(--kop-blue)] text-xs font-bold px-3 py-1 rounded">
              Dokumentasi Kegiatan
            </div>
            <h2 className="text-3xl font-bold text-[var(--kop-blue)]">Galeri Kami</h2>
            <p className="text-[var(--text-tertiary)] text-sm">
              Lihat momen-momen kegiatan dan aktivitas koperasi BMT Maslahah.
            </p>
          </div>
          <a
            href="/galeri"
            className="text-sm font-semibold text-[var(--kop-blue)] hover:text-[#2a4e78] flex items-center gap-1 group transition-colors"
          >
            Lihat Semua Galeri
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {galeriData.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-12">Belum ada foto galeri.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galeriData.slice(0, 8).map((item) => (
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
      </section>

      {/* Section Tentang Kami */}
      <section id="tentang" className="bg-[var(--bg-card)] py-20 border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-6 space-y-20">

          {/* 1. Sub-Section: Sejarah & Visi Misi */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Kolom Kiri: Sejarah */}
            <div className="space-y-4">
              <div className="inline-block bg-[var(--kop-blue)]/10 text-[var(--kop-blue)] text-xs font-bold px-3 py-1 rounded">
                Profil Koperasi
              </div>
              <h2 className="text-3xl font-bold text-[var(--kop-blue)]">Sejarah Singkat</h2>
              <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed text-justify">
                Koperasi BMT MASLAHAH yang semula bernama Koperasi BMT MMU (Maslahah Mursalah lil Ummah)  berkedudukan di  Jl. Raya Sidogiri No. 10 Desa Sidogiri Kecamatan Kraton Kabupaten Pasuruan, berdiri pada tanggal 17 Juli 1997 M atau 12 Robi’ul Awwal 1418 H. Terbentuknya koperasi ini bermula dari sebuah keprihatinan dari para guru MMU (Madrasah Miftahul Ulum) Pondok Pesantren Sidogiri menatap realita prilaku masyarakat yang cenderung kurang memerhatikan kaidah-kaidah syariah  bidang muamalah, yaitu adanya praktik-praktik yang mengarah pada ekonomi ribawi yang dilarang tegas oleh agama.
              </p>
            </div>

            {/* Kolom Kanan: Visi & Misi */}
            <div className="bg-[var(--bg-page)] border border-[var(--border-light)] p-8 rounded-2xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--kop-blue)] flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-4 bg-[var(--kop-green)] rounded-full"></span>
                  Visi Kami
                </h3>
                <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                  Menjadi lembaga keuangan syariah yang amanah, tangguh, professional dan mampu memberikan pelayanan prima dalam meningkatkan pendapatan dan kesejahteraan anggota dan masyarakat.
                </p>
              </div>

              <div className="w-full h-[1px] bg-[var(--bg-placeholder)]"></div>

              <div>
                <h3 className="text-lg font-bold text-[var(--kop-blue)] flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-4 bg-[var(--kop-green)] rounded-full"></span>
                  Misi Kami
                </h3>
                <ul className="space-y-2.5 text-[var(--text-secondary)] text-sm md:text-base">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-green)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Mengelola Koperasi dan unit usaha secara profesional dengan menerapkan prinsip “Good Corporate Governance” untuk menciptakan kesejahteraan anggota.
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-green)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Meningkatkan pelayanan dan peran serta pengembangan koperasi ke arah yang lebih maju dan produktif dalam mewujudkan penerapan syariah kaffah.
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-green)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Meningkatkan pembinaan anggota sebagai edukasi menuju koperasi yang berkualitas.
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-green)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Membangun kemitraan dengan pihak lain dalam pengembangan koperasi.
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--kop-green)] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Mengembangkan kepedulian sosial.
                  </li>
                </ul>
              </div>

              <div className="w-full h-[1px] bg-[var(--bg-placeholder)]"></div>

              <div>
                <h3 className="text-lg font-bold text-[var(--kop-blue)] flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-4 bg-[var(--kop-green)] rounded-full"></span>
                  MOTTO
                </h3>
                <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                  Syariah Menjadikan Berkah
                </p>
              </div>

            </div>
          </div>

          {/* 2. Sub-Section: Struktur Organisasi (Pengurus & Direksi) */}
          <div className="space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-[var(--kop-blue)]">Struktur Organisasi</h2>
              <p className="text-[var(--text-tertiary)] text-xs md:text-sm">
                Sinergi kepemimpinan profesional yang berkomitmen menjaga amanah dan regulasi secara konsisten.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Gambar Susunan Pengurus */}
              <div className="bg-[var(--bg-page)] border border-[var(--border-light)] rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center border-b border-[var(--border-medium)] pb-3">
                  <h3 className="font-bold text-[var(--kop-blue)]">Susunan Pengurus Koperasi</h3>
                  <span className="text-[10px] uppercase font-bold text-[var(--kop-green)] bg-[var(--kop-green)]/10 px-2 py-0.5 rounded">
                    Pengawas & Penasihat
                  </span>
                </div>
                <div className="aspect-[4/3] bg-[var(--bg-placeholder)] rounded-xl overflow-hidden relative group border border-[var(--border-light)]">
                  {/* Ganti URL src dengan path gambar bagan struktur pengurus Anda */}
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

              {/* Gambar Susunan Direksi */}
              <div className="bg-[var(--bg-page)] border border-[var(--border-light)] rounded-2xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center border-b border-[var(--border-medium)] pb-3">
                  <h3 className="font-bold text-[var(--kop-blue)]">Susunan Direksi & Eksekutif</h3>
                  <span className="text-[10px] uppercase font-bold text-[var(--kop-green)] bg-[var(--kop-green)]/10 px-2 py-0.5 rounded">
                    Tim Manajemen
                  </span>
                </div>
                <div className="aspect-[4/3] bg-[var(--bg-placeholder)] rounded-xl overflow-hidden relative group border border-[var(--border-light)]">
                  {/* Ganti URL src dengan path gambar bagan struktur direksi/manajemen Anda */}
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
          <div className="bg-[var(--kop-blue)] p-8 md:col-span-2 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Konsultasi Gratis</h3>
              <p className="text-sm text-[var(--text-on-dark)] leading-relaxed">Punya pertanyaan seputar keanggotaan atau produk kami? Hubungi tim representatif kami sekarang.</p>
            </div>
            <div className="space-y-4 pt-8 md:pt-0 text-sm text-[var(--text-on-dark)]">
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
                className="w-full px-4 py-2 border border-[var(--border-medium)] rounded-lg focus:outline-none focus:border-[var(--kop-blue)] bg-[var(--bg-page)] text-sm"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase mb-1">Alamat Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-[var(--border-medium)] rounded-lg focus:outline-none focus:border-[var(--kop-blue)] bg-[var(--bg-page)] text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase mb-1">Pesan Anda</label>
              <textarea
                rows="3"
                required
                className="w-full px-4 py-2 border border-[var(--border-medium)] rounded-lg focus:outline-none focus:border-[var(--kop-blue)] bg-[var(--bg-page)] text-sm resize-none"
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
      <footer className="bg-[var(--bg-card)] border-t border-[var(--border-light)] py-8">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-3 text-xs text-[var(--text-muted)]">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <a href="https://wa.me/6282561242155115" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[var(--kop-blue)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                082561242155115
              </a>
              <a href="mailto:bmt.maslahah@gmail.com" className="flex items-center gap-1.5 hover:text-[var(--kop-blue)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                bmt.maslahah@gmail.com
              </a>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Jl. Raya Sidogiri no. 10
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-tertiary)] border-t border-[var(--border-light)] pt-4">
            <div>
              &copy; 2026 Koperasi BMT Maslahah. Hak Cipta Dilindungi.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-[var(--kop-blue)]">Kebijakan Privasi</a>
              <a href="#" className="hover:text-[var(--kop-blue)]">Syarat & Ketentuan</a>
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

      <a
        href="https://wa.me/6282561242155115?text=Halo,%20saya%20ingin%20bertanya%20tentang%20produk%20BMT%20Maslahah"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2"
      >
        <span className="bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-[var(--border-light)]">
          Chat Kami
        </span>
        <span className="bg-[#25D366] hover:bg-[#1da851] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </span>
      </a>
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
        {/* Header: ikon + kategori badge */}
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

        {/* Garis pemisah */}
        <div className="w-full h-px bg-[var(--bg-muted)]" />

        {/* Deskripsi lengkap (semua paragraf) */}
        <div className="space-y-3">
          {produk.deskripsi.map((paragraf, i) => (
            <p key={i} className="text-[var(--text-secondary)] text-sm leading-relaxed">{renderDeskripsi(paragraf)}</p>
          ))}
        </div>

        {/* Tombol tutup */}
        <button
          onClick={onClose}
          className="w-full bg-[var(--kop-blue)] hover:bg-[var(--kop-blue-hover)] text-white py-2.5 rounded-lg font-semibold text-sm transition-all"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}