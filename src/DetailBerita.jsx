import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBerita, getBeritaById } from './api';
import { renderDeskripsi } from './App';
import { ToggleButton } from './ThemeContext';

export default function DetailBerita() {
    const { id } = useParams();
    const [berita, setBerita] = useState(null);
    const [allBerita, setAllBerita] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        getBeritaById(id).then(setBerita).catch(() => setBerita(null));
        getBerita().then(setAllBerita).catch(() => {});
    }, [id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    const sidebarList = allBerita.map((item) => {
        const isCurrent = String(item.id) === id;
        return (
            <Link
                key={item.id}
                to={`/berita/${item.id}`}
                onClick={() => setSidebarOpen(false)}
                className={`block p-4 rounded-xl border text-left transition-all duration-200 group ${isCurrent
                    ? 'bg-[var(--kop-blue)]/5 border-[var(--kop-blue)] shadow-sm'
                    : 'bg-[var(--bg-page)] border-[var(--border-light)] hover:border-[var(--kop-blue)]/30 hover:bg-[var(--bg-card)]'
                }`}
            >
                <div className="flex items-center justify-between gap-2 text-[10px] font-bold mb-1.5">
                    <span className={`${isCurrent ? 'text-[var(--kop-green)]' : 'text-[var(--text-muted)]'}`}>
                        {item.kategori}
                    </span>
                    {isCurrent && (
                        <span className="bg-[var(--kop-green)] text-white px-2 py-0.5 rounded text-[9px] font-medium tracking-wide">
                            Sedang Dibaca
                        </span>
                    )}
                </div>
                <h4 className={`text-sm font-bold line-clamp-2 transition-colors ${isCurrent ? 'text-[var(--kop-blue)]' : 'text-[var(--text-primary)] group-hover:text-[var(--kop-blue)]'
                    }`}>
                    {item.judul}
                </h4>
                <span className="text-[10px] text-[var(--text-muted)] block mt-2">{item.tanggal}</span>
            </Link>
        );
    });

    if (!berita) {
        return (
            <div className="min-h-screen bg-[var(--bg-page)] flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold text-[var(--kop-blue)] mb-2">Berita Tidak Ditemukan</h2>
                <p className="text-[var(--text-tertiary)] mb-6">Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
                <Link to="/" className="bg-[var(--kop-blue)] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[var(--kop-blue-hover)] transition-colors">
                    Kembali ke Beranda
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-page)] min-h-screen font-sans antialiased pb-20">
            {/* Mini Navbar */}
            <nav className="bg-[var(--bg-card)] shadow-sm sticky top-0 z-50 mb-8 border-b border-[var(--border-light)]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        {/* Pengganti lingkaran huruf K dengan Image */}
                        <img
                            src="/LogoBMTMaslahah2.png"
                            alt="Logo BMT Maslahah"
                            className="w-auto h-8 object-contain"
                        />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-xs font-semibold text-[var(--text-tertiary)] hover:text-[var(--kop-blue)] transition-colors flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Kembali ke Beranda
                        </Link>
                        <ToggleButton />
                    </div>
                </div>
            </nav>

            {/* Main Content & Sidebar Wrapper */}
            <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Kolom Kiri: Konten Utama Berita (Lebar 2/3 di Desktop) */}
                <section className="lg:col-span-2 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] overflow-hidden shadow-sm">
                    {berita.foto_url && (
                        <div className="relative h-56 md:h-80">
                            <img src={berita.foto_url} alt={berita.judul} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                                <div className="flex flex-wrap items-center gap-3 text-xs font-medium mb-3">
                                    <span className="text-white/90 bg-[var(--kop-green)]/80 px-3 py-1 rounded-full text-xs font-bold">
                                        {berita.kategori}
                                    </span>
                                    <span className="text-white/60">•</span>
                                    <span className="text-white/70">{berita.tanggal}</span>
                                    <span className="text-white/60">•</span>
                                    <span className="text-white/70 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Oleh: {berita.penulis}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-xl font-extrabold text-white leading-tight tracking-tight">
                                    {berita.judul}
                                </h3>
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-10 space-y-6">
                        {!berita.foto_url && (
                            <>
                                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--text-muted)]">
                                    <span className="text-[var(--kop-green)] bg-[var(--kop-green)]/10 px-3 py-1 rounded-full text-xs font-bold">
                                        {berita.kategori}
                                    </span>
                                    <span>•</span>
                                    <span>{berita.tanggal}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Oleh: {berita.penulis}
                                    </span>
                                </div>

                                <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--kop-blue)] leading-tight tracking-tight">
                                    {berita.judul}
                                </h1>

                                <div className="w-16 h-1 bg-[var(--kop-green)] rounded-full"></div>
                            </>
                        )}

                        <div className="space-y-5 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed pt-2">
                            {berita.konten.map((paragraf, index) => (
                                <p key={index}>{renderDeskripsi(paragraf)}</p>
                            ))}
                        </div>

                        <div className="pt-6 mt-10 border-t border-[var(--border-light)] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="text-xs text-[var(--text-muted)]">
                                Kategori: <span className="font-semibold text-[var(--text-secondary)]">{berita.kategori} Sejahtera</span>
                            </div>
                            <div className="inline-flex items-center space-x-2 bg-[var(--kop-green)]/5 border border-[var(--kop-green)]/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--kop-green)]">
                                <span>Syariah Menjadikan Berkah</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Kolom Kanan: Sidebar Navigasi Berita Langsung (Lebar 1/3 di Desktop) */}
                <aside className="hidden lg:block bg-[var(--bg-card)] rounded-2xl border border-[var(--border-light)] p-6 shadow-sm lg:sticky lg:top-24 space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-[var(--kop-blue)]">Artikel Lainnya</h3>
                        <p className="text-xs text-[var(--text-muted)]">Pilih dan baca langsung berita seputar koperasi di sini.</p>
                    </div>
                    <div className="w-full h-[1px] bg-[var(--bg-muted)]"></div>
                    {sidebarList}
                </aside>

            </main>

            {/* Floating tombol buka sidebar (mobile/tablet) */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-40 bg-[var(--kop-blue)] text-white p-3.5 rounded-full shadow-xl hover:bg-[var(--kop-blue-hover)] transition-all"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Overlay sidebar mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <aside className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-[var(--bg-card)] shadow-2xl p-6 overflow-y-auto">
                        <div className="flex items-start justify-between mb-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-[var(--kop-blue)]">Artikel Lainnya</h3>
                                <p className="text-xs text-[var(--text-muted)]">Pilih dan baca langsung berita seputar koperasi di sini.</p>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="w-full h-[1px] bg-[var(--bg-muted)] mb-6"></div>
                        {sidebarList}
                    </aside>
                </div>
            )}
        </div>
    );
}


