-- ============================================================
-- BMT Maslahah — Database Seed
-- Jalankan: mysql -u root -p bmtmas < server/seed.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS bmtmas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bmtmas;

-- ─── Admin ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password: admin123 (bcrypt hash)
INSERT INTO admin (password) VALUES
('$2b$10$pP0oMF8gYOBxBK5C4HBV6O6hYbC5WHpPdYGKvJVJPJxkNfBmSxqOe');

-- ─── Berita ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS berita (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kategori VARCHAR(100) NOT NULL,
  tanggal VARCHAR(50) NOT NULL,
  penulis VARCHAR(100) NOT NULL,
  judul VARCHAR(255) NOT NULL,
  foto_url VARCHAR(500),
  ringkasan TEXT,
  konten TEXT NOT NULL
);

INSERT INTO berita (kategori, tanggal, penulis, judul, ringkasan, konten) VALUES
('Regulasi', '28 Juni 2026', 'Admin Koperasi',
 'Peran Koperasi Syariah dalam Mendorong Pertumbuhan Ekonomi Berkelanjutan',
 'Bagaimana sistem bagi hasil tanpa riba mampu menjadi pilar kokoh dalam menjaga stabilitas finansial pelaku UMKM di era modern.',
 '["Koperasi syariah atau yang sering dikenal sebagai Baitul Maal wat Tamwil (BMT) kini memegang peranan yang semakin krusial dalam peta perekonomian nasional. Dengan mengedepankan sistem bagi hasil dan menjauhi praktik riba, koperasi syariah menawarkan alternatif keuangan yang lebih adil dan menenteramkan bagi masyarakat, khususnya pelaku Usaha Mikro, Kecil, dan Menengah (UMKM).", "Berbeda dengan institusi keuangan konvensional, pilar utama koperasi syariah adalah keadilan distributif dan keterbukaan. Melalui akad-akad seperti Mudharabah (bagi hasil) dan Musyarakah (kemitraan), risiko usaha tidak lagi dibebankan secara sepihak kepada peminjam, melainkan ditanggung bersama berdasarkan kesepakatan awal yang transparan.", "Langkah nyata ini terbukti mampu menjaga stabilitas finansial anggota saat menghadapi gejolak pasar global. Koperasi syariah bukan sekadar lembaga simpan pinjam biasa, melainkan wadah gotong royong yang menyeimbangkan antara keuntungan finansial duniawi dan keberkahan nilai-nilai spiritual dalam setiap transaksi harian."]'),

('Tips Keuangan', '15 Juni 2026', 'Siti Rahma (Perencana Keuangan)',
 'Cara Tepat Mengelola Simpanan Berjangka untuk Persiapan Qurban & Pendidikan',
 'Panduan praktis bagi anggota koperasi untuk merencanakan alokasi dana masa depan menggunakan produk simpanan syariah.',
 '["Merencanakan keuangan masa depan sering kali menjadi tantangan besar jika tidak disiasati dengan instrumen yang tepat. Dua kebutuhan besar yang rutin dihadapi umat Muslim di Indonesia adalah ibadah Qurban tahunan dan biaya pendidikan anak yang terus meningkat setiap tahunnya.", "Koperasi menyediakan produk Simpanan Berjangka Syariah yang dirancang khusus untuk mempermudah perencanaan ini. Dengan menyisihkan sebagian pendapatan secara konsisten setiap bulan ke dalam pos simpanan berjangka, anggota dapat mengunci dana tersebut agar tidak terpakai untuk kebutuhan konsumtif lainnya.", "Kelebihan utama menyimpan dana di koperasi syariah adalah adanya nisbah bagi hasil yang kompetitif. Hasil keuntungan dari pembiayaan produktif koperasi akan dibagikan kembali kepada Anda secara adil, sehingga nilai simpanan Anda terus tumbuh secara produktif dan berkah hingga hari pencairan tiba."]'),

('Kegiatan', '02 Juni 2026', 'Humas Koperasi',
 'Koperasi Maju Salurkan Bantuan Modal Usaha Tanpa Bunga untuk 50 UMKM Binaan',
 'Wujud nyata kepedulian sosial dan ekonomi melalui program pemberdayaan berbasis akad mudharabah bagi pedagang kecil.',
 '["Sebagai bentuk komitmen nyata dalam pemberdayaan ekonomi masyarakat bawah, Koperasi Maju Sejahtera pekan ini resmi menyalurkan bantuan modal usaha tanpa bunga kepada 50 pelaku UMKM binaan di sektor perdagangan kecil dan kuliner.", "Program ini menggunakan skema alokasi dana kebajikan (Qardhul Hasan) gabungan dengan akad Mudharabah, di mana para pedagang kecil diberikan modal kerja tanpa beban bunga sepeser pun. Pendampingan usaha secara berkala juga turut diberikan untuk memastikan pemanfaatan modal berjalan efektif demi menaikkan omzet harian mereka.", "Ketua Koperasi menegaskan bahwa langkah ini adalah pengejawantahan dari fungsi sosial koperasi syariah. Keberhasilan koperasi tidak hanya diukur dari besarnya aset yang dikelola, melainkan dari seberapa banyak anggotanya yang berhasil naik kelas dan terbebas dari jerat rentenir ilegal."]');

-- ─── Simpanan ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS simpanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_produk VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL
);

INSERT INTO simpanan (nama_produk, deskripsi) VALUES
('Simpanan Berjangka', '["Simpan dana Anda dengan aman dan dapatkan bagi hasil (imbal jasa) yang kompetitif dengan opsi tenor fleksibel."]'),
('Simpanan Idul Fitri', '["Persiapkan dana mudik dan hari raya tanpa cemas. Simpanan khusus dengan skema pencairan tepat sebelum Idul Fitri."]'),
('Simpanan Qurban', '["Rencanakan ibadah qurban Anda dengan tenang. Dana teralokasi aman dan siap dicairkan menjelang Hari Raya Idul Adha."]'),
('Simpanan Haji Dan Umroh', '["Wujudkan niat suci ke tanah suci. Simpanan terencana dengan akad syariah untuk membantu kesiapan finansial ibadah Anda."]');

-- ─── Pembiayaan ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pembiayaan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_produk VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL
);

INSERT INTO pembiayaan (nama_produk, deskripsi) VALUES
('Pembiayaan Multi Jasa', '["Solusi pembiayaan untuk berbagai kebutuhan jasa seperti pendidikan, pernikahan, hingga pengobatan dengan akad yang menenteramkan."]'),
('Pinjaman Produktif', '["Pendorong pertumbuhan bisnis pelaku UMKM dengan proses pengajuan cepat, syarat mudah, dan sistem bagi hasil yang adil."]'),
('Pinjaman Griya', '["Wujudkan hunian impian Anda atau renovasi rumah dengan skema pembiayaan berbasis kesepakatan bersama yang transparan tanpa riba."]'),
('Pembiayan K2B', '["Pembiayaan khusus modal kerja konstruksi dan pengadaan barang/jasa bagi Anda yang memegang kontrak kerja resmi (SPK)."]');

-- ─── Galeri ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS galeri (
  id INT AUTO_INCREMENT PRIMARY KEY,
  judul VARCHAR(255) NOT NULL,
  keterangan TEXT,
  foto_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
