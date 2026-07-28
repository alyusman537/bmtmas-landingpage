import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { nama_produk, deskripsi } = await request.json();
    await pool.query(
      'UPDATE pembiayaan SET nama_produk=?, deskripsi=? WHERE id=?',
      [nama_produk, JSON.stringify(deskripsi), id]
    );
    const [rows] = await pool.query('SELECT * FROM pembiayaan WHERE id = ?', [id]);
    if (!rows.length) return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ ...rows[0], deskripsi: JSON.parse(rows[0].deskripsi) });
  } catch (err) {
    console.error('PUT pembiayaan error:', err);
    return NextResponse.json({ message: 'Gagal mengupdate produk pembiayaan' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const [result] = await pool.query('DELETE FROM pembiayaan WHERE id = ?', [id]);
    if (!result.affectedRows) return NextResponse.json({ message: 'Produk tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    console.error('DELETE pembiayaan error:', err);
    return NextResponse.json({ message: 'Gagal menghapus produk pembiayaan' }, { status: 500 });
  }
}
