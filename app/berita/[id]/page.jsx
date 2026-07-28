import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import DetailBeritaClient from './DetailBeritaClient';

async function getBeritaById(id) {
  const [rows] = await pool.query('SELECT * FROM berita WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    ...row,
    konten: JSON.parse(row.konten),
  };
}

async function getAllBerita() {
  const [rows] = await pool.query('SELECT * FROM berita ORDER BY id DESC');
  return rows;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const berita = await getBeritaById(id);
  if (!berita) {
    return { title: 'Berita Tidak Ditemukan' };
  }
  return {
    title: `${berita.judul} - BMT Maslahah`,
    description: berita.ringkasan || berita.judul,
  };
}

export default async function BeritaDetailPage({ params }) {
  const { id } = await params;
  const [berita, allBerita] = await Promise.all([
    getBeritaById(id),
    getAllBerita(),
  ]);

  if (!berita) {
    notFound();
  }

  return <DetailBeritaClient berita={berita} allBerita={allBerita} />;
}
