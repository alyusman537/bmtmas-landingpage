import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const [rows] = await pool.query('SELECT * FROM berita WHERE id = ?', [id]);
    if (!rows.length) return NextResponse.json({ message: 'Berita tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ ...rows[0], konten: JSON.parse(rows[0].konten) });
  } catch (err) {
    console.error('GET berita by id error:', err);
    return NextResponse.json({ message: 'Gagal mengambil data berita' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const formData = await request.formData();
    const kategori = formData.get('kategori');
    const tanggal = formData.get('tanggal');
    const penulis = formData.get('penulis');
    const judul = formData.get('judul');
    const ringkasan = formData.get('ringkasan');
    const konten = formData.get('konten');
    const file = formData.get('foto');

    const [existing] = await pool.query('SELECT foto_url FROM berita WHERE id = ?', [id]);
    if (!existing.length) return NextResponse.json({ message: 'Berita tidak ditemukan' }, { status: 404 });

    let foto_url = existing[0].foto_url;
    if (file && file.size > 0) {
      if (foto_url) {
        const oldPath = path.join(process.cwd(), foto_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      const ext = path.extname(file.name).toLowerCase();
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      const uploadDir = path.join(process.cwd(), 'uploads', 'berita');
      fs.mkdirSync(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      foto_url = `/uploads/berita/${filename}`;
    }

    await pool.query(
      'UPDATE berita SET kategori=?, tanggal=?, penulis=?, judul=?, foto_url=?, ringkasan=?, konten=? WHERE id=?',
      [kategori, tanggal, penulis, judul, foto_url, ringkasan || null, JSON.stringify(konten ? JSON.parse(konten) : []), id]
    );
    const [rows] = await pool.query('SELECT * FROM berita WHERE id = ?', [id]);
    return NextResponse.json({ ...rows[0], konten: JSON.parse(rows[0].konten) });
  } catch (err) {
    console.error('PUT berita error:', err);
    return NextResponse.json({ message: 'Gagal mengupdate berita' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const [existing] = await pool.query('SELECT foto_url FROM berita WHERE id = ?', [id]);
    if (!existing.length) return NextResponse.json({ message: 'Berita tidak ditemukan' }, { status: 404 });

    if (existing[0].foto_url) {
      const filePath = path.join(process.cwd(), existing[0].foto_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool.query('DELETE FROM berita WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Berita berhasil dihapus' });
  } catch (err) {
    console.error('DELETE berita error:', err);
    return NextResponse.json({ message: 'Gagal menghapus berita' }, { status: 500 });
  }
}
