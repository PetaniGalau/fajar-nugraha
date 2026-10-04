# Website portofolio Fajar Nugraha

Versi ini menyusun ulang website sebagai SPA statis dengan tampilan claymorphism: krem dan hijau sage, bentuk membulat, bayangan lembut, serta tema terang dan gelap. Berkas sumber pengguna tidak diubah; seluruh perubahan berada dalam salinan website ini.

## Membuka dan memasang

Pratinjau yang dibuka dalam sesi pengerjaan tersedia melalui server lokal. Untuk membuka ulang di komputer lain, jalankan server statis dari folder ini, misalnya menggunakan Live Server pada editor atau perintah berikut jika Python tersedia:

```text
python -m http.server 8080 --bind 127.0.0.1
```

Kemudian buka `http://127.0.0.1:8080`. Jangan membuka partial HTML atau index lewat klik ganda: perpindahan halaman menggunakan fetch dan membutuhkan HTTP.

Untuk GitHub Pages atau hosting statis, unggah isi folder ini sehingga `index.html`, `aset`, `css`, `js`, dan `sumber-konten` berada pada tingkat yang sama. Berkas CNAME domain lama ikut dipertahankan. Belum ada perubahan yang dipublikasikan ke website aktif.

## Yang disusun ulang

- Beranda dengan ilustrasi lapisan geospasial berbasis SVG, ringkasan keahlian, dan pilihan proyek.
- Katalog 10 proyek: lima aplikasi lama dan lima proyek analisis/otomatisasi dari dokumentasi.
- Filter kategori, pencarian judul serta tools, dan pencarian global.
- Halaman studi kasus dengan workflow, tools, output, dan galeri gambar yang bisa diperbesar.
- Halaman tentang, publikasi, artikel, layanan, aset digital, dan kontak.
- Menu responsif, tema gelap, fokus keyboard, dialog dengan tombol tutup dan Escape, serta penghormatan preferensi reduced motion.
- Navigasi hash lama, termasuk rute overview WebGIS, tetap dipertahankan.

## Efisiensi

- Gambar dikonversi menjadi WebP dan dibatasi resolusinya. Katalog memakai thumbnail lebih kecil; dokumentasi penuh dimuat pada halaman proyek.
- Foto kecil pada beranda menggunakan turunan 96 piksel.
- Shell memakai satu CSS dan satu JavaScript tanpa framework, font eksternal, atau pustaka ikon eksternal.
- Konten beranda ada langsung dalam index; tidak perlu fetch halaman awal.
- Cache halaman dibatasi, dan permintaan lama dibatalkan saat navigasi berganti.
- Demo aplikasi tidak dimuat di beranda. Iframe dibuat setelah pengunjung menekan Muat demo.
- Data GeoJSON, PDF CV, dan modul aplikasi asli tetap tersedia. Pustaka eksternal milik aplikasi hanya dimuat saat aplikasinya dibuka.

Ukuran folder website sumber sekitar 66,7 MB. Versi baru sekitar 10,5 MB, termasuk tambahan dokumentasi dan thumbnail, atau sekitar 84% lebih kecil. Angka ini adalah ukuran berkas lokal, bukan skor Lighthouse atau pengukuran waktu muat melalui internet.

## Mengubah isi

- Halaman utama: `sumber-konten/beranda.html`. Salin perubahan beranda juga ke isi `main#render-konten` di `index.html`, karena beranda awal disertakan langsung untuk pemuatan cepat.
- Daftar proyek: `sumber-konten/portofolio/portofolio.html`.
- Lima proyek analisis baru: `sumber-konten/portofolio/proyek-analisis/`.
- Indeks pencarian: `aset/search-index.json`. Perbarui jika menambah halaman.
- Warna, bentuk, dan tampilan responsif: `css/site.css`.
- Navigasi dan interaksi: `js/site.js`.
- Dokumentasi gambar: `aset/proyek/`.

Tautan internal dalam sumber HTML menggunakan `nav-link-ajax` dengan href relatif. Saat ditampilkan, router mengubahnya menjadi tautan hash agar pembukaan pada tab baru tetap membawa shell website.

## Sumber dan batas pemeriksaan

Isi lima proyek disusun dari dokumen proyek, screenshot dalam arsip Dokumentasi Project, dan dua notebook LULC. Notebook tidak dijalankan ulang; tidak ada klaim hasil eksperimen baru atau angka akurasi tambahan. Peta kesesuaian dalam dokumentasi secara eksplisit menunjukkan komoditas padi.

Dokumentasi erosi mendukung TSL, erosi aktual, dan IBE. Metode/hasil terpisah erosi potensial belum tersedia, sehingga tidak diperlakukan sebagai hasil yang telah diverifikasi.

Perhitungan ilmiah dan backend dari lima aplikasi lama tidak ditulis ulang. Pada dashboard analitik, kode sumber meminta `aset/data/proyek-2/batas_subdas.geojson`, yang tidak disertakan dalam ZIP asli. `batas_wilayah.geojson` yang tersedia tidak diganti namanya karena belum dipastikan mewakili data yang dimaksud. Aplikasi mempertahankan fallback outlet; catatan tersebut tampil di halaman proyek.

Spectral Engine dan USLE membutuhkan backend, layanan Earth Engine, serta jaringan yang aktif. Keberhasilan perhitungan end-to-end backend tidak diverifikasi. Tautan publikasi dan unduhan eksternal dipertahankan dari sumber, tanpa mengubah atau memublikasikan isinya.

Kontak menggunakan alamat email, WhatsApp, dan lokasi dari website yang baru dilampirkan. Form menyiapkan draf email, lalu pengguna mengirimkannya melalui aplikasi email sendiri. Ini menggantikan integrasi EmailJS lama yang pustakanya tidak dimuat. Tidak ada pesan yang dikirim selama pengujian.

## Pengujian

- Pemeriksaan struktur 25 partial dan seluruh referensi lokal href/src/data-image/data-demo: lulus.
- Pemeriksaan sintaks JavaScript shell: lulus.
- Browser desktop: navigasi SPA, pembukaan langsung melalui hash, kembali/maju, pencarian, galeri, dan pemuatan demo setelah klik diperiksa.
- Browser ponsel 390 piksel: menu, tema gelap, filter, pencarian tools, halaman detail, dan draf kontak diperiksa; halaman yang diperiksa tidak meluber secara horizontal.
- Demo WebGIS Tanralili dapat dibuka dalam iframe; beranda memuat nol iframe.
- Pemeriksaan browser pada alur utama tidak mencatat error JavaScript.

Tiga tautan navigasi yang rusak pada aplikasi dashboard/spectral lama sudah diarahkan kembali ke shell dan overview yang benar.
