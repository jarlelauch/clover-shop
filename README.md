# CLOVER — Toko Minimalis Semanggi 4 Daun ☘️

UI web shop minimalis dengan tema hijau semanggi 4 daun. **Belum ada sistem pembayaran** — fokus UI dulu sesuai request.

## Fitur UI
- Navbar + search + keranjang + wishlist
- Hero section (headline + best seller card + flash sale)
- Kategori (Semua / Apparel / Aksesoris / Home)
- Grid produk (8 item dummy, harga `Rp ???` sesuai request)
- Cart drawer (tambah/kurang/hapus, subtotal `???`)
- Filter kategori + search + sort
- Banner bundle, tentang, newsletter, footer

## Tech
- Single HTML + Tailwind CDN (no build)
- Vanilla JS (`app.js`)
- Font: Plus Jakarta Sans + Instrument Serif

## Jalankan Lokal
```bash
# cukup buka index.html, atau pakai server:
npx serve .
# atau
python -m http.server 8000
```

## Deploy ke GitHub Pages (porto)
1. Buat repo baru di GitHub, misal `clover-shop`
2. Push:
```bash
git init
git add .
git commit -m "feat: initial UI CLOVER shop - tema semanggi 4 daun"
git branch -M main
git remote add origin https://github.com/USERNAME/clover-shop.git
git push -u origin main
```
3. Aktifkan GitHub Pages: Settings → Pages → Source: `main` / root

## Next (revisi perlahan)
- Ganti `???` dengan data produk & harga real
- Tambah halaman detail produk
- Integrasi pembayaran (nanti)
- CMS / admin

Dibuat untuk porto — siap direvisi bareng.
