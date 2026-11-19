# Pemetaan Longsor Kabupaten Karo

WebGIS ini merangkum data dasar Kabupaten Karo dalam satu peta: titik kejadian dan non-kejadian longsor, sekolah dasar, batas kecamatan, jaringan jalan, serta elevasi. Basemap yang digunakan adalah OpenStreetMap.

## Menjalankan aplikasi

Gunakan Node.js 22, lalu jalankan dari folder proyek:

```sh
npm ci
npm run dev
```

Vite membuka aplikasi di `http://127.0.0.1:5173/`. Untuk membuat dan melihat hasil build produksi:

```sh
npm run build
npm run preview
```

## Isi peta

- **Batas kecamatan:** 17 kecamatan, ditampilkan sebagai area hijau dan garis batas.
- **Titik longsor:** 52 titik pada `src/trainingPoints.json`, terdiri dari 35 titik kejadian dan 17 titik non-kejadian.
- **Sekolah dasar:** 128 lokasi beserta nama sekolah dari `public/data/sdKaro.json`.
- **Jaringan jalan:** jalan arteri, kolektor, dan lokal pada `public/data/roadsKaro.json`.
- **Elevasi:** raster pada `public/data/elevation-karo.png`, dengan rentang nilai 103–2.436. Sumber data tidak mencantumkan satuan.

Periode 2024–2025 pada nama titik kejadian menggambarkan konteks data, bukan tahun yang tercatat untuk tiap titik. Berkas sumber tidak memuat tahun kejadian per lokasi.

## Tampilan peta

Simbol batas dan jalan mengacu pada Lampiran C Peraturan BIG No. 3 Tahun 2016, lalu disesuaikan agar terbaca di layar. Jalan lokal dan kolektor dibuat lebih redup supaya batas wilayah dan titik kejadian tetap mudah dilihat.

Pada layar ponsel, legenda dan kontrol layer tetap tampil di atas peta. Pencarian dan daftar lokasi dapat dibuka terpisah agar area peta tetap leluasa.

Sumber: [Peraturan BIG No. 3 Tahun 2016 — JDIH BIG](https://jdih.big.go.id/api/dokumen/file/d6b599f9-2d6e-481f-b084-00691daac989). Peta dasar menggunakan OpenStreetMap; lihat [ketentuan atribusinya](https://www.openstreetmap.org/copyright).

## Tim penyusun

- Daniel Try
- Daffa Afsajulianda
- Cornelius Parlindungan Simbolon

## Publikasi

Repository ini menyiapkan GitHub Actions untuk membangun dan menerbitkan aplikasi ke GitHub Pages setiap ada perubahan di branch `main`. Di GitHub, buka **Settings → Pages** dan pilih **GitHub Actions** sebagai sumber deployment. Hasil publikasi akan muncul pada alamat Pages repository.

Repository dan data peta bersifat publik. Pastikan data yang ditambahkan memang boleh dibagikan.
