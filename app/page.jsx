import pool from '@/lib/db';
import LandingClient from './LandingClient';

export const metadata = {
  title: 'BMT Maslahah - Syariah Menjadikan Berkah',
  description: 'Koperasi syariah yang amanah dan profesional dalam mengelola keuangan untuk meningkatkan kesejahteraan anggota dan masyarakat.',
};

export default async function Page() {
  const [simpananRows] = await pool.query('SELECT * FROM simpanan ORDER BY id');
  const produkSimpanan = simpananRows.map((r) => ({
    ...r,
    deskripsi: JSON.parse(r.deskripsi),
  }));

  const [pembiayaanRows] = await pool.query('SELECT * FROM pembiayaan ORDER BY id');
  const produkPembiayaan = pembiayaanRows.map((r) => ({
    ...r,
    deskripsi: JSON.parse(r.deskripsi),
  }));

  const [beritaRows] = await pool.query('SELECT * FROM berita ORDER BY id DESC');
  const beritaData = beritaRows.map((r) => ({
    ...r,
    konten: JSON.parse(r.konten),
  }));

  const [galeriRows] = await pool.query('SELECT * FROM galeri ORDER BY id DESC');
  const galeriData = galeriRows;

  return (
    <LandingClient
      produkSimpanan={produkSimpanan}
      produkPembiayaan={produkPembiayaan}
      beritaData={beritaData}
      galeriData={galeriData}
    />
  );
}
