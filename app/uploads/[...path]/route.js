import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export async function GET(request, { params }) {
  const { path: filePath } = await params;
  const joined = path.join(process.cwd(), 'uploads', ...filePath);

  if (!fs.existsSync(joined)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const ext = path.extname(joined).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileBuffer = fs.readFileSync(joined);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
