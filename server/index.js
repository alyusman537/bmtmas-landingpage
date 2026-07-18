import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import beritaRoutes from './routes/berita.js';
import simpananRoutes from './routes/simpanan.js';
import pembiayaanRoutes from './routes/pembiayaan.js';
import galeriRoutes from './routes/galeri.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', authRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/simpanan', simpananRoutes);
app.use('/api/pembiayaan', pembiayaanRoutes);
app.use('/api/galeri', galeriRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
