# DILSA — Digital Laboratorium Science AI

> **Platform Pembelajaran IPA SMP/MTs Berbasis Web Responsif, Simulasi 2D Interaktif, Asisten Lab AI Kontekstual, dan Kuis Evaluasi.**

---

## 🌟 Ringkasan Produk

**DILSA** dirancang untuk mendemokratisasi akses eksperimen sains bagi siswa SMP/MTs (kelas VII–IX). Mengikuti alur wajib:
`Pilih Tema → Pelajari Materi → Jalankan Laboratorium 2D → Catat Data → Bimbingan AI → Kuis Evaluasi → Ringkasan Hasil`.

### Nilai Utama & Filosofi Desain
- **Cerah, Elegan, dan Ilmiah:** Palet biru laut (`#2583E8`, `#174A8B`), aksen kuning hangat (`#FFD45A`), permukaan bersih tanpa efek neon murahan.
- **Bebas Emoji:** Menggunakan icon set SVG konsisten dari Lucide, bukan emoji kasual.
- **Simulasi Deterministik:** Hasil simulasi berasal dari kalkulasi model matematika fisika resmi (bukan halusinasi generatif AI).
- **Asisten AI Kontekstual:** Menerima snapshot parameter & data terukur live dari kanvas laboratorium, membimbing secara sokratik dengan fallback cerdas saat offline / tanpa API key.
- **PWA & Mobile-First:** Responsif dari 360px hingga layar desktop 4K, dilengkapi manifest dan Service Worker offline cache.

---

## 🔬 3 Tema Eksperimen yang Tersedia

1. **Gaya dan Gerak: Pengaruh Gaya terhadap Gerak Benda**
   - **Tingkat:** Kelas VII–VIII SMP/MTs
   - **Model Fisika:** Hukum II Newton $F = m \times a$, $a = \frac{F_{net}}{m}$, gesekan kinetik $f = \mu \times N$.
   - **Fitur Simulasi:** Lintasan 2D berskala meter, kontrol gaya dorong (-60 N s.d. +60 N), massa (1 kg s.d. 15 kg), gesekan (licin, rendah, kasar), vektor gaya (F, f, F_net), grafik kecepatan vs waktu ($v-t$), dan tabel pengamatan data real-time.

2. **Kelistrikan: Rangkaian Listrik Sederhana**
   - **Tingkat:** Kelas VIII–IX SMP/MTs
   - **Model Fisika:** Hukum Ohm $V = I \times R$, Rangkaian Seri ($R_t = R_1 + R_2$), Rangkaian Paralel ($\frac{1}{R_t} = \frac{1}{R_1} + \frac{1}{R_2}$), Daya Lampu $P = I^2 \times R$.
   - **Fitur Simulasi:** Kanvas skematik DC, sakelar interaktif (buka/tutup arus), variasi tegangan baterai (3V–24V), pendaran lampu realistis proporsional terhadap watt, ammeter digital, dan tabel pencatatan pengukuran.

3. **Cahaya dan Optik: Pemantulan pada Cermin Datar**
   - **Tingkat:** Kelas VIII SMP/MTs
   - **Model Fisika:** Hukum Snellius Pemantulan ($\angle i = \angle r$), Garis Normal tegak lurus, sifat bayangan maya ($s' = s$, tegak, sama besar).
   - **Fitur Simulasi:** Berkas sinar laser datang & pantul, busur derajat (protractor) interaktif, perpanjangan sinar maya di belakang cermin, mode lilin objek nyata vs bayangan maya, dan mode tantangan prediksi sudut.

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
- Node.js versi 18+ (direkomendasikan Node.js 20+)
- npm / yarn / pnpm

### 1. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 2. Menjalankan Unit Test Fisika & Kuis
```bash
npm test
```
Semua 10 pengujian deterministik (Hukum Newton, Hukum Ohm seri/paralel, Optik cermin datar, dan validitas kuis) akan dijalankan secara instan.

### 3. Build Produksi (Siap Deploy ke Vercel)
```bash
npm run build
npm start
```

### 4. Konfigurasi Asisten AI (Opsional)
Jika ingin menghubungkan asisten dengan Gemini API resmi, buat file `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> *Catatan: Jika API key tidak diisi, DILSA otomatis menggunakan **Mesin Heuristik Sokratik** bawaan yang 100% bekerja secara lokal dan offline tanpa error.*

---

## 📁 Struktur Direktori Proyek

```text
D:\proyek\Digital Lab AI\
├── public/
│   ├── icons/            # Ikon PWA SVG (192px & 512px)
│   ├── manifest.webmanifest # Web App Manifest PWA
│   └── sw.js             # Service Worker untuk caching offline
├── src/
│   ├── app/
│   │   ├── api/assistant/ # Route handler server-side untuk Asisten AI
│   │   ├── topics/
│   │   │   ├── page.tsx  # Katalog tema modul
│   │   │   └── [slug]/
│   │   │       ├── page.tsx      # Materi formal & rumus
│   │   │       ├── lab/          # Laboratorium virtual 2D
│   │   │       └── quiz/         # Kuis evaluasi pemahaman
│   │   ├── globals.css   # Token desain visual DILSA
│   │   ├── layout.tsx    # Root layout + Navbar + Footer + PWA register
│   │   └── page.tsx      # Landing page / Beranda DILSA
│   ├── components/
│   │   ├── assistant/    # Asisten AI terapung dengan chip cepat
│   │   ├── laboratory/   # MotionLab, CircuitLab, OpticsLab
│   │   ├── layout/       # Navbar & Footer
│   │   ├── navigation/   # Breadcrumb stepper 4 langkah
│   │   ├── quiz/         # QuizRunner & evaluasi
│   │   └── topic/        # TopicCard dengan status progress lokal
│   ├── data/
│   │   └── topics.ts     # Data kurikulum formal, rumus, panduan lab, bank soal
│   ├── lib/
│   │   ├── __tests__/    # Unit test model fisika deterministik
│   │   └── storage.ts    # Penyimpanan progress belajar di LocalStorage
│   └── types/
│       └── index.ts      # TypeScript interfaces lengkap
└── package.json
```

---

Dibuat dengan standar kualitas pedagogi sains modern untuk pelajar Indonesia.
