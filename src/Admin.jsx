import { useState, useEffect, useRef } from 'react';
import {
  login as apiLogin,
  getBerita, createBerita, updateBerita, deleteBerita,
  getSimpanan, createSimpanan, updateSimpanan, deleteSimpanan,
  getPembiayaan, createPembiayaan, updatePembiayaan, deletePembiayaan,
  getGaleri, createGaleri, updateGaleri, updateGaleriFoto, deleteGaleri,
} from './api';
import { ToggleButton } from './ThemeContext';

// ─── Toast ───────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  const bg = type === 'success' ? 'bg-[var(--kop-green)]' : 'bg-red-500';
  return (
    <div className={`fixed top-4 right-4 z-[9999] ${bg} text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg`}>
      {message}
    </div>
  );
}

// ─── Login ──────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = await apiLogin(input);
      sessionStorage.setItem('adminAuth', token);
      onLogin();
    } catch {
      setError('Password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <ToggleButton />
      </div>
      <form onSubmit={handleSubmit} className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-xl border border-[var(--border-light)] w-full max-w-[450px] space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-[var(--kop-blue)]">Admin Panel</h1>
          <p className="text-xs text-[var(--text-muted)]">Masukkan password untuk melanjutkan</p>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            className="w-full px-4 py-2 pr-10 border border-[var(--border-medium)] rounded-lg focus:outline-none focus:border-[var(--kop-blue)] bg-[var(--bg-page)] text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--kop-blue)] transition-colors"
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-[var(--kop-blue)] hover:bg-[var(--kop-blue-hover)] disabled:opacity-50 text-white py-2 rounded-lg font-semibold text-sm transition-all">
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}

// ─── Form Berita ─────────────────────────────────────────────
const emptyBerita = { kategori: '', tanggal: '', penulis: '', judul: '', ringkasan: '', konten: '' };

function BeritaForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    if (initial) {
      const konten = Array.isArray(initial.konten)
        ? initial.konten.join('\n\n')
        : initial.konten || '';
      return { ...initial, konten };
    }
    return { ...emptyBerita };
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.foto_url || '');
  const kontenRef = useRef(null);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const wrapSelection = (before, after) => {
    const ta = kontenRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = form.konten;
    const selected = val.substring(start, end);
    const newVal = val.substring(0, start) + before + selected + after + val.substring(end);
    set('konten', newVal);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.judul.trim() || !form.kategori.trim()) return;
    const fd = new FormData();
    fd.append('kategori', form.kategori);
    fd.append('tanggal', form.tanggal);
    fd.append('penulis', form.penulis);
    fd.append('judul', form.judul);
    fd.append('ringkasan', form.ringkasan);
    fd.append('konten', JSON.stringify(form.konten.split('\n\n').map((p) => p.trim()).filter(Boolean)));
    if (file) fd.append('foto', file);
    onSave(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Kategori</label>
          <input value={form.kategori} onChange={(e) => set('kategori', e.target.value)} className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)]" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Tanggal</label>
          <input value={form.tanggal} onChange={(e) => set('tanggal', e.target.value)} className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)]" required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Penulis</label>
        <input value={form.penulis} onChange={(e) => set('penulis', e.target.value)} className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)]" required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Judul</label>
        <input value={form.judul} onChange={(e) => set('judul', e.target.value)} className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)]" required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Foto Sampul {initial ? '(Kosongkan jika tidak ingin mengganti)' : ''}</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--kop-blue)]/10 file:text-[var(--kop-blue)] hover:file:bg-[var(--kop-blue)]/20" />
      </div>
      {preview && (
        <div className="mt-2 relative">
          <img src={preview} alt="Preview" className="h-32 rounded-lg object-cover border border-[var(--border-light)]" />
          <button type="button" onClick={() => { setFile(null); setPreview(''); }} className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">&times;</button>
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Ringkasan</label>
        <textarea value={form.ringkasan} onChange={(e) => set('ringkasan', e.target.value)} rows={2} className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)] resize-none" required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Konten</label>
        <div className="flex items-center gap-1 mb-1">
          <button type="button" onClick={() => wrapSelection('**', '**')} className="px-2 py-1 text-xs font-bold border border-[var(--border-medium)] rounded hover:bg-[var(--bg-muted)] transition-colors" title="Tebal (Bold)">B</button>
          <button type="button" onClick={() => wrapSelection('*', '*')} className="px-2 py-1 text-xs font italic border border-[var(--border-medium)] rounded hover:bg-[var(--bg-muted)] transition-colors" title="Miring (Italic)">I</button>
        </div>
        <textarea ref={kontenRef} value={form.konten} onChange={(e) => set('konten', e.target.value)} rows={8} placeholder="Tulis konten berita di sini...&#10;&#10;Pisahkan paragraf dengan baris kosong (enter dua kali)." className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)] resize-y" required />
        <p className="text-xs text-[var(--text-muted)] mt-1">Pisahkan paragraf dengan enter dua kali. Gunakan <b>**teks**</b> untuk tebal, <i>*teks*</i> untuk miring.</p>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="bg-[var(--kop-blue)] hover:bg-[var(--kop-blue-hover)] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all">Simpan</button>
        <button type="button" onClick={onCancel} className="bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] px-5 py-2 rounded-lg text-sm font-semibold transition-all">Batal</button>
      </div>
    </form>
  );
}

// ─── Form Produk ─────────────────────────────────────────────
const emptyProduk = { nama_produk: '', deskripsi: [''] };

function ProdukForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { ...emptyProduk });

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const addDeskripsi = () => set('deskripsi', [...form.deskripsi, '']);
  const removeDeskripsi = (i) => {
    const arr = form.deskripsi.filter((_, idx) => idx !== i);
    set('deskripsi', arr.length ? arr : ['']);
  };
  const setDeskripsi = (i, val) => {
    const arr = [...form.deskripsi];
    arr[i] = val;
    set('deskripsi', arr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama_produk.trim()) return;
    onSave({ ...form, deskripsi: form.deskripsi.filter((d) => d.trim()) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Nama Produk</label>
        <input value={form.nama_produk} onChange={(e) => set('nama_produk', e.target.value)} className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)]" required />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-[var(--text-tertiary)]">Deskripsi</label>
          <button type="button" onClick={addDeskripsi} className="text-xs text-[var(--kop-blue)] font-semibold hover:underline">+ Tambah Paragraf</button>
        </div>
        <div className="space-y-2">
          {form.deskripsi.map((d, i) => (
            <div key={i} className="flex gap-2">
              <textarea value={d} onChange={(e) => setDeskripsi(i, e.target.value)} rows={2} className="flex-1 px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)] resize-none" required />
              {form.deskripsi.length > 1 && (
                <button type="button" onClick={() => removeDeskripsi(i)} className="text-red-400 hover:text-red-600 text-xs font-bold self-center">Hapus</button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="bg-[var(--kop-blue)] hover:bg-[var(--kop-blue-hover)] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all">Simpan</button>
        <button type="button" onClick={onCancel} className="bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] px-5 py-2 rounded-lg text-sm font-semibold transition-all">Batal</button>
      </div>
    </form>
  );
}

// ─── Tabel CRUD ──────────────────────────────────────────────
function CrudTable({ columns, data, onEdit, onDelete }) {
  if (!data.length) {
    return <p className="text-sm text-[var(--text-muted)] py-8 text-center">Belum ada data.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-medium)] text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase">
            <th className="pb-3 pr-2">#</th>
            {columns.map((col) => <th key={col.key} className="pb-3 pr-2">{col.label}</th>)}
            <th className="pb-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-page)] transition-colors">
              <td className="py-3 pr-2 text-[var(--text-muted)]">{idx + 1}</td>
              {columns.map((col) => (
                <td key={col.key} className="py-3 pr-2 max-w-[200px] truncate">{col.render ? col.render(item) : item[col.key]}</td>
              ))}
              <td className="py-3 text-right whitespace-nowrap">
                <button onClick={() => onEdit(item)} className="text-[var(--kop-blue)] hover:underline text-xs font-semibold mr-3">Edit</button>
                <button onClick={() => onDelete(item)} className="text-red-400 hover:text-red-600 text-xs font-semibold">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab Panel ───────────────────────────────────────────────
function TabPanel({ label, fetchFn, createFn, updateFn, deleteFn, columns, FormComponent }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchFn().then(setItems).catch(() => {});
  }, [fetchFn]);

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  const handleSave = async (formData) => {
    try {
      if (editing) {
        const updated = await updateFn(editing.id, formData);
        setItems((prev) => prev.map((item) => (item.id === editing.id ? updated : item)));
        showToast('Data berhasil diperbarui');
      } else {
        const created = await createFn(formData);
        setItems((prev) => [...prev, created]);
        showToast('Data berhasil ditambahkan');
      }
      setEditing(null);
      setShowForm(false);
    } catch {
      showToast('Gagal menyimpan data', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus "${item.judul || item.nama_produk}"?`)) return;
    try {
      await deleteFn(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      showToast('Data berhasil dihapus');
    } catch {
      showToast('Gagal menghapus data', 'error');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[var(--kop-blue)]">{label}</h2>
        {!showForm && (
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-[var(--kop-green)] hover:bg-[var(--kop-green-hover)] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
            + Tambah
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-[var(--bg-page)] border border-[var(--border-light)] rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">{editing ? 'Edit Data' : 'Tambah Data Baru'}</h3>
          <FormComponent initial={editing} onSave={handleSave} onCancel={handleCancel} />
        </div>
      ) : (
        <CrudTable columns={columns} data={items} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

// ─── Form Galeri ─────────────────────────────────────────────
function GaleriForm({ initial, onSave, onCancel }) {
  const [judul, setJudul] = useState(initial?.judul || '');
  const [keterangan, setKeterangan] = useState(initial?.keterangan || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.foto_url || '');

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!judul.trim()) return;
    if (!initial && !file) return;
    const fd = new FormData();
    fd.append('judul', judul);
    fd.append('keterangan', keterangan);
    if (file) fd.append('foto', file);
    onSave(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Judul</label>
        <input value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)]" required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Keterangan</label>
        <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} rows={2} className="w-full px-3 py-2 border border-[var(--border-medium)] rounded-lg text-sm focus:outline-none focus:border-[var(--kop-blue)] resize-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--text-tertiary)] mb-1">Foto {initial ? '(Kosongkan jika tidak ingin mengganti)' : ''}</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--kop-blue)]/10 file:text-[var(--kop-blue)] hover:file:bg-[var(--kop-blue)]/20" />
      </div>
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Preview" className="h-32 rounded-lg object-cover border border-[var(--border-light)]" />
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="bg-[var(--kop-blue)] hover:bg-[var(--kop-blue-hover)] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all">Simpan</button>
        <button type="button" onClick={onCancel} className="bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] px-5 py-2 rounded-lg text-sm font-semibold transition-all">Batal</button>
      </div>
    </form>
  );
}

// ─── Galeri Panel (Custom karena FormData) ───────────────────
function GaleriPanel() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    getGaleri().then(setItems).catch(() => {});
  }, []);

  const showToast = (msg, type = 'success') => setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  const handleSave = async (formData) => {
    try {
      if (editing) {
        if (formData.has('foto')) {
          await updateGaleri(editing.id, { judul: formData.get('judul'), keterangan: formData.get('keterangan') });
          const updatedFoto = await updateGaleriFoto(editing.id, formData);
          setItems((prev) => prev.map((item) => (item.id === editing.id ? updatedFoto : item)));
        } else {
          const updated = await updateGaleri(editing.id, { judul: formData.get('judul'), keterangan: formData.get('keterangan') });
          setItems((prev) => prev.map((item) => (item.id === editing.id ? updated : item)));
        }
        showToast('Data berhasil diperbarui');
      } else {
        const created = await createGaleri(formData);
        setItems((prev) => [...prev, created]);
        showToast('Data berhasil ditambahkan');
      }
      setEditing(null);
      setShowForm(false);
    } catch {
      showToast('Gagal menyimpan data', 'error');
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus "${item.judul}"?`)) return;
    try {
      await deleteGaleri(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      showToast('Data berhasil dihapus');
    } catch {
      showToast('Gagal menghapus data', 'error');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[var(--kop-blue)]">Manajemen Galeri</h2>
        {!showForm && (
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-[var(--kop-green)] hover:bg-[var(--kop-green-hover)] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all">
            + Tambah
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-[var(--bg-page)] border border-[var(--border-light)] rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">{editing ? 'Edit Data' : 'Tambah Data Baru'}</h3>
          <GaleriForm initial={editing} onSave={handleSave} onCancel={handleCancel} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          {items.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] py-8 text-center">Belum ada data.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-medium)] text-left text-xs font-semibold text-[var(--text-tertiary)] uppercase">
                  <th className="pb-3 pr-2">#</th>
                  <th className="pb-3 pr-2">Foto</th>
                  <th className="pb-3 pr-2">Judul</th>
                  <th className="pb-3 pr-2">Keterangan</th>
                  <th className="pb-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-page)] transition-colors">
                    <td className="py-3 pr-2 text-[var(--text-muted)]">{idx + 1}</td>
                    <td className="py-3 pr-2">
                      <img src={item.foto_url} alt={item.judul} className="h-12 w-12 rounded-lg object-cover" />
                    </td>
                    <td className="py-3 pr-2 max-w-[200px] truncate font-medium">{item.judul}</td>
                    <td className="py-3 pr-2 max-w-[200px] truncate text-[var(--text-muted)]">{item.keterangan || '-'}</td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button onClick={() => handleEdit(item)} className="text-[var(--kop-blue)] hover:underline text-xs font-semibold mr-3">Edit</button>
                      <button onClick={() => handleDelete(item)} className="text-red-400 hover:text-red-600 text-xs font-semibold">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Halaman Admin Utama ─────────────────────────────────────
export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem('adminAuth'));
  const [tab, setTab] = useState('berita');

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  const tabs = [
    { key: 'berita', label: 'Berita' },
    { key: 'simpanan', label: 'Produk Simpanan' },
    { key: 'pembiayaan', label: 'Produk Pembiayaan' },
    { key: 'galeri', label: 'Galeri' },
  ];

  const columns = {
    berita: [
      { key: 'foto_url', label: 'Foto', render: (item) => item.foto_url ? <img src={item.foto_url} alt="" className="h-10 w-14 rounded object-cover" /> : <span className="text-[var(--text-muted)]">-</span> },
      { key: 'judul', label: 'Judul' },
      { key: 'kategori', label: 'Kategori' },
      { key: 'tanggal', label: 'Tanggal' },
      { key: 'penulis', label: 'Penulis' },
      { key: 'ringkasan', label: 'Ringkasan', render: (item) => item.ringkasan?.slice(0, 60) + (item.ringkasan?.length > 60 ? '...' : '') },
    ],
    simpanan: [
      { key: 'nama_produk', label: 'Nama Produk' },
      { key: 'deskripsi', label: 'Deskripsi', render: (item) => item.deskripsi?.[0]?.slice(0, 80) + (item.deskripsi?.[0]?.length > 80 ? '...' : '') },
    ],
    pembiayaan: [
      { key: 'nama_produk', label: 'Nama Produk' },
      { key: 'deskripsi', label: 'Deskripsi', render: (item) => item.deskripsi?.[0]?.slice(0, 80) + (item.deskripsi?.[0]?.length > 80 ? '...' : '') },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-sans antialiased">
      {/* Navbar Admin */}
      <nav className="bg-[var(--bg-card)] shadow-sm sticky top-0 z-50 border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/LogoBMTMaslahah2.png" alt="Logo" className="h-7 w-auto" />
            <span className="text-sm font-bold text-[var(--kop-blue)]">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <ToggleButton />
            <button
              onClick={() => { sessionStorage.removeItem('adminAuth'); setAuthenticated(false); }}
              className="text-xs font-semibold text-[var(--text-muted)] hover:text-red-500 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl p-1.5 mb-8 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t.key ? 'bg-[var(--kop-blue)] text-white shadow-sm' : 'text-[var(--text-tertiary)] hover:text-[var(--kop-blue)]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel per Tab */}
        {tab === 'berita' && (
          <TabPanel
            label="Manajemen Berita"
            fetchFn={getBerita}
            createFn={createBerita}
            updateFn={updateBerita}
            deleteFn={deleteBerita}
            columns={columns.berita}
            FormComponent={BeritaForm}
          />
        )}
        {tab === 'simpanan' && (
          <TabPanel
            label="Manajemen Produk Simpanan"
            fetchFn={getSimpanan}
            createFn={createSimpanan}
            updateFn={updateSimpanan}
            deleteFn={deleteSimpanan}
            columns={columns.simpanan}
            FormComponent={ProdukForm}
          />
        )}
        {tab === 'pembiayaan' && (
          <TabPanel
            label="Manajemen Produk Pembiayaan"
            fetchFn={getPembiayaan}
            createFn={createPembiayaan}
            updateFn={updatePembiayaan}
            deleteFn={deletePembiayaan}
            columns={columns.pembiayaan}
            FormComponent={ProdukForm}
          />
        )}
        {tab === 'galeri' && <GaleriPanel />}
      </div>
    </div>
  );
}
