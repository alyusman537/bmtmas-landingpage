import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const [rows] = await pool.query('SELECT * FROM galeri WHERE id = ?', [id]);
    if (!rows.length) return NextResponse.json({ message: 'Foto tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('GET galeri by id error:', err);
    return NextResponse.json({ message: 'Gagal mengambil data galeri' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { judul, keterangan } = await request.json();
    await pool.query(
      'UPDATE galeri SET judul=?, keterangan=? WHERE id=?',
      [judul, keterangan || '', id]
    );
    const [rows] = await pool.query('SELECT * FROM galeri WHERE id = ?', [id]);
    if (!rows.length) return NextResponse.json({ message: 'Foto tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('PUT galeri error:', err);
    return NextResponse.json({ message: 'Gagal mengupdate foto galeri' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const [existing] = await pool.query('SELECT foto_url FROM galeri WHERE id = ?', [id]);
    if (!existing.length) return NextResponse.json({ message: 'Foto tidak ditemukan' }, { status: 404 });

    const filePath = path.join(process.cwd(), existing[0].foto_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('DELETE FROM galeri WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Foto galeri berhasil dihapus' });
  } catch (err) {
    console.error('DELETE galeri error:', err);
    return NextResponse.json({ message: 'Gagal menghapus foto galeri' }, { status: 500 });
  }
}
