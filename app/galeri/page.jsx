import pool from '@/lib/db';
import GaleriClient from './GaleriClient';

export const metadata = {
  title: 'Galeri - BMT Maslahah',
};

export default async function GaleriPage() {
  const [rows] = await pool.query('SELECT * FROM galeri ORDER BY id DESC');
  return <GaleriClient galeriData={rows} />;
}
