import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const formData = await request.formData();
    const file = formData.get('foto');

    if (!file || file.size === 0) {
      return NextResponse.json({ message: 'File foto wajib diunggah' }, { status: 400 });
    }

    const [existing] = await pool.query('SELECT foto_url FROM galeri WHERE id = ?', [id]);
    if (!existing.length) return NextResponse.json({ message: 'Foto tidak ditemukan' }, { status: 404 });

    const oldPath = path.join(process.cwd(), existing[0].foto_url);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    const ext = path.extname(file.name).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'galeri');
    fs.mkdirSync(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    const foto_url = `/uploads/galeri/${filename}`;
    await pool.query('UPDATE galeri SET foto_url=? WHERE id=?', [foto_url, id]);
    const [rows] = await pool.query('SELECT * FROM galeri WHERE id = ?', [id]);
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('PUT galeri foto error:', err);
    return NextResponse.json({ message: 'Gagal mengganti foto galeri' }, { status: 500 });
  }
}
