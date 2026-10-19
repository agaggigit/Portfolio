Desain portofolio Anda **sangat keren, modern, dan sekelas website pemenang penghargaan (Awwwards/Framer)**! Kombinasi warna *dark/light mode*, curve transition (lengkungan SVG), timeline, dan layout-nya sangat rapi.

Karena Anda ingin **latihan sendiri** dan paham alur kerjanya, mari kita bedah strategi dan alur pembuatan website interaktif & bernyawa dari nol.

---

### 💡 Rahasia Alur Kerja Developer (Urutan Pengerjaan)

Kesalahan umum pemula adalah **langsung mencoba membuat animasi saat layout belum selesai**. Kunci membuat website animasi yang stabil adalah alur 4 tahap berikut:

```
[Tahap 1: Layout Statis] ➔ [Tahap 2: Interaktivitas State] ➔ [Tahap 3: Micro Animation] ➔ [Tahap 4: Preloader & Scroll Animation]
```

#### **Tahap 1: Layout Statis (HTML & Tailwind CSS)**
* Buat semua section dari atas ke bawah **tanpa animasi sama sekali**.
* Pastikan ukurannya pas, font-nya sesuai, dan layout-nya responsif (bagus di HP & Desktop).
* *Kenapa?* Jika layout dasar belum stabil, animasi nanti akan merusak posisi elemen dan susah di-debug.

#### **Tahap 2: Interaktivitas State (React Logic)**
* Buat fungsi dasar seperti: menu hamburger jika diklik bisa buka/tutup, tab project bisa berpindah, dsb.

#### **Tahap 3: Micro-Animations & Hover Effects (Framer Motion)**
* Tambahkan efek saat tombol di-hover, text yang muncul perlahan (*fade-in*), atau elemen yang sedikit terangkat saat disentuh kursor.

#### **Tahap 4: Advanced Animations & Page Transitions**
* Buat layar **Welcome Screen (Preloader)** dengan teks "Welcome" yang menghilang, lalu muncul efek lengkungan (*curved SVG transition*) menuju halaman utama.
* Pasang *Smooth Scroll* agar scroll halaman terasa sangat halus.

---

### 🛠️ Tech Stack & Library Utama yang Biasa Dipakai

Untuk membuat desain seperti gambar Figma Anda, ini adalah *toolset* standar industri yang digunakan:

1. **`framer-motion` (Library Animasi Utama)**
   * Ini adalah library animasi #1 untuk React & Next.js.
   * Sangat mudah digunakan untuk membuat teks masuk perlahan, efek hover, hingga animasi lengkungan SVG.
2. **`lucide-react` (Icon Set)**
   * Untuk icon hamburger menu (`≡`), lokasi (`📍`), panah (`→`), dll.
3. **`lenis` (Smooth Scroll)**
   * Memberikan efek scroll yang terasa sangat mulus dan *extravagant* seperti website studio desain profesional.

---

### 🗺️ Rencana Langkah-demi-Langkah (Roadmap Latihan Anda)

Berikut adalah tahapan yang bisa Anda ikuti secara bertahap:

#### **Langkah 1: Setup Library Pendukung**
Nanti di terminal proyek, Anda akan menginstall library animasi & icon dengan menjalankan:
```bash
npm install framer-motion lucide-react lenis
```

#### **Langkah 2: Siapkan Gambar & Asset**
* Masukkan foto Anda (foto baju cokelat) dan screenshot proyek-proyek Anda ke dalam folder `public/`.

#### **Langkah 3: Bangun Section per Section (Mulai dari Statis)**
Kerjakan komponen satu per satu di folder `components/`:
1. `Navbar.tsx` (Floating pill menu di atas)
2. `HeroSection.tsx` ("Hi, I'm Aga...")
3. `AboutSection.tsx` ("Based in Yogyakarta", Foto profil, Current Playground, Off the Screen)
4. `ProjectsSection.tsx` (Kartu-kartu proyek)
5. `ExperienceSection.tsx` (Timeline riwayat organisasi/karir)
6. `Footer.tsx` ("Let's Work Together" & tombol besar "Say Hello")

#### **Langkah 4: Masukkan Animasi & Preloader Lengkungan (Curve SVG)**
* Setelah semua tampilan berdiri tegak, kita pasang animasi pintu masuk (*Welcome Screen preloader*) dan efek lengkungan SVG-nya.

---

Bagaimana menurut Anda tentang alurnya? Jika sudah siap, kita bisa mulai **Langkah 1** (menginstall library yang dibutuhkan dulu) atau Anda ingin mulai membuat komponen pertama yang mana?