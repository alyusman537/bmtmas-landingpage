import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM galeri ORDER BY id DESC');
    return NextResponse.json(rows);
  } catch (err) {
    console.error('GET galeri error:', err);
    return NextResponse.json({ message: 'Gagal mengambil data galeri' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('foto');
    const judul = formData.get('judul');
    const keterangan = formData.get('keterangan');

    if (!file || file.size === 0) {
      return NextResponse.json({ message: 'File foto wajib diunggah' }, { status: 400 });
    }
    if (!judul) {
      return NextResponse.json({ message: 'Judul wajib diisi' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'galeri');
    fs.mkdirSync(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    const foto_url = `/uploads/galeri/${filename}`;
    const [result] = await pool.query(
      'INSERT INTO galeri (judul, keterangan, foto_url) VALUES (?, ?, ?)',
      [judul, keterangan || '', foto_url]
    );
    const [rows] = await pool.query('SELECT * FROM galeri WHERE id = ?', [result.insertId]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error('POST galeri error:', err);
    return NextResponse.json({ message: 'Gagal menambah foto galeri' }, { status: 500 });
  }
}
