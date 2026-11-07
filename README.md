# Halaman verifikasi reCAPTCHA v3 untuk Vercel

Template ini menampilkan alamat tujuan **secara transparan** dan memverifikasi token reCAPTCHA v3 di backend sebelum navigasi. Alamat tujuan tidak disembunyikan dari pengguna atau pemeriksa iklan.

## Cara deploy

1. Buat project Google reCAPTCHA **v3** di https://www.google.com/recaptcha/admin. Tambahkan domain Vercel Anda (mis. `nama-project.vercel.app`) dan domain custom jika ada. Dapatkan Site Key dan Secret Key.
2. Unggah folder project ini ke repository GitHub, kemudian import repository tersebut di https://vercel.com/new. Pilih framework **Other** (tanpa build command khusus).
3. Di Vercel, masuk ke Project → Settings → Environment Variables, lalu buat:
   - `RECAPTCHA_SITE_KEY`: site key Google (boleh terlihat di browser)
   - `RECAPTCHA_SECRET_KEY`: secret key Google (**hanya di server**)
   - `DESTINATION_URL`: alamat HTTPS website tujuan, misalnya `https://sukayangminimini.com/`
   - `ALLOWED_HOSTNAMES`: domain halaman verifikasi, dipisahkan koma, **tanpa** `https://` (mis. `nama-project.vercel.app,verifikasi.contoh.com`). Jangan masukkan domain tujuan jika berbeda.
4. Redeploy setelah menambahkan variabel. Buka alamat project, pastikan website tujuan terlihat, lalu klik **Verifikasi & Melanjutkan**.

## Penting

- Google reCAPTCHA v3 menghasilkan skor dan bukan tantangan kotak centang. Kode menggunakan ambang `score >= 0.5`, `action=continue`, serta validasi `hostname`.
- Tambahkan setiap hostname deployment yang benar ke `ALLOWED_HOSTNAMES` dan daftar domain Google reCAPTCHA. Preview domain Vercel yang berubah-ubah dapat memerlukan penyesuaian.
- Tidak memerlukan database; Vercel Functions memproses verifikasi.
- Verifikasi frontend saja tidak cukup untuk melindungi resource sensitif. Untuk kasus sensitif, tambahkan rate limiting dan verifikasi server-side di operasi yang dilindungi.
- Redirect target terlihat pada halaman dan respons jaringan, sebagaimana mestinya.
- Untuk website publik/iklan, pastikan halaman dan tujuan memenuhi kebijakan platform terkait.
