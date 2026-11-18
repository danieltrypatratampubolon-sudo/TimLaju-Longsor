# Pemetaan Longsor

WebGIS informasi dasar menggunakan React, Leaflet, dan OpenStreetMap. Peta menampilkan titik kejadian/non-kejadian, area dan garis batas 17 kecamatan, jaringan jalan, serta raster elevasi Kabupaten Karo.

## Menjalankan aplikasi

```sh
npm install
npm run dev
```

Server pengembangan memakai alamat lokal tetap `http://127.0.0.1:5173/`. Jika port tersebut sedang dipakai, server akan menampilkan error alih-alih berpindah ke port lain.

## Publikasi di GitHub Pages

Proyek ini sudah memiliki workflow GitHub Actions untuk membangun dan menerbitkan WebGIS secara otomatis ke GitHub Pages setiap kali ada push ke branch `main`.

1. Buat repository GitHub dan unggah seluruh isi folder proyek ini ke branch `main`.
2. Pada repository, buka **Settings → Pages**, lalu pilih **GitHub Actions** sebagai sumber deployment.
3. Buka tab **Actions** dan tunggu workflow **Deploy WebGIS to GitHub Pages** selesai.
4. Buka alamat yang ditampilkan pada deployment; biasanya `https://<nama-akun>.github.io/<nama-repository>/`.

Semua file di repository dan data titik sekolah/lokasi yang diterbitkan dapat diakses publik. Jangan unggah kredensial atau data pribadi.

## Data batas kecamatan

Data area kecamatan tersimpan di `public/data/kecamatanKaroPolygons.json` sebagai GeoJSON poligon hasil konversi shapefile. Batas garis tersimpan di `public/data/kecamatanKaroLines.json` sebagai GeoJSON `MultiLineString`. Area diwarnai hijau transparan agar basemap tetap terlihat, dengan garis batas digambar di atasnya.

## Elevasi

Raster elevasi WGS84 diolah menjadi `public/data/elevation-karo.png` untuk overlay peta, dengan sel NoData transparan. Gradasi hijau-ke-merah membentang dari nilai raster minimum 103 hingga maksimum 2.436. Metadata sumber tidak mencantumkan satuan elevasi. Legenda dan visibilitas raster dapat dikendalikan dari panel layer.

## Titik kejadian

52 titik pada `src/trainingPoints.json` diklasifikasikan dari atribut `class`: nilai 1 menjadi Kejadian (valid), dan nilai 0 menjadi Non-kejadian (tidak valid). Nama titik memakai kecamatan yang menaungi koordinatnya. Nama kejadian menampilkan rentang 2024-2025 sesuai konteks data; sumber tidak menyediakan tahun spesifik per titik. Marker ditempatkan pada pane di atas layer jalan agar tidak tertutup. Lokasi contoh di Bandung tidak digunakan.

## Sekolah dasar

128 lokasi sekolah dasar Kabupaten Karo beserta nama dari atribut `Nama_Sekol` tersedia di `public/data/sdKaro.json`. Layer dapat dinyalakan/dimatikan, nama sekolah tampil pada tooltip dan daftar titik, serta pencarian dapat menemukan sekolah.

## Data jalan

Data jalan tersimpan di `public/data/roadsKaro.json` sebagai GeoJSON `MultiLineString`. Layer arteri, kolektor, dan lokal dapat dinyalakan atau dimatikan secara terpisah. Data jalan lokal yang digunakan berasal dari `Jalan_Lokasl.shp` (392 fitur, atribut `Jalan Lokal`). `Jalan_Lokal.shp` sebelumnya dan `Jalan_Setapak.shp` identik dengan `Jalan_Arteri.shp`, sehingga tidak dipakai untuk mengklasifikasikan jalan lokal atau setapak.

## Simbolisasi peta

Warna dan simbol garis mengacu pada Lampiran C, Tabel C.2 dan C.3, Peraturan BIG No. 3 Tahun 2016 tentang Spesifikasi Teknis Penyajian Peta Desa (status Berlaku pada JDIH BIG). Warna cetak CMYK pada peraturan dikonversi ke sRGB untuk tampilan web:

- Area kecamatan: isian hijau transparan; garis batas hitam dengan mask oranye (CMYK 0/17/50/0).
- Jalan arteri: garis magenta (0/50/0/0) dengan mask hitam.
- Jalan kolektor/utama: garis magenta (0/30/0/0) dengan mask hitam.
- Jalan lokal: garis oranye (0/47/60/0) dengan mask hitam.

Ketebalan garis disesuaikan untuk keterbacaan layar dan tidak mewakili ukuran cetak pada skala peta lampiran. Batas kecamatan, jalan arteri, dan titik kejadian ditampilkan penuh; jalan kolektor memakai opasitas 65% dan jalan lokal 45% agar unsur utama lebih menonjol. Panel judul peta tidak menggunakan blur.

Sumber resmi: [Peraturan BIG No. 3 Tahun 2016 — JDIH BIG](https://jdih.big.go.id/api/dokumen/file/d6b599f9-2d6e-481f-b084-00691daac989).
