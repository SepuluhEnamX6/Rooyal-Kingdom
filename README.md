# 👑 Royal Kingdom — Next.js + MySQL

Website Royal Kingdom yang sudah dimigrasi ke **Next.js 14** dengan database **MySQL** via Railway.

---

## 🗂️ Struktur Project

```
royal-kingdom/
├── app/
│   ├── layout.js              # Root layout
│   ├── globals.css            # Global styles
│   ├── page.js                # Homepage (server component)
│   ├── admin/
│   │   ├── page.js            # Dashboard admin
│   │   └── login/page.js      # Halaman login admin
│   └── api/
│       ├── members/
│       │   ├── route.js       # GET all, POST new member
│       │   └── [id]/route.js  # GET, PUT, DELETE by ID
│       ├── gallery/
│       │   ├── route.js       # GET all, POST new photo
│       │   └── [id]/route.js  # PUT, DELETE by ID
│       ├── upload/route.js    # Upload foto
│       └── auth/
│           ├── login/route.js
│           ├── logout/route.js
│           └── me/route.js
├── components/
│   ├── HomeClient.js          # Client-side homepage
│   └── admin/
│       ├── MemberManager.js   # CRUD member
│       └── GalleryManager.js  # Upload & kelola gallery
├── lib/
│   ├── prisma.js              # Prisma client singleton
│   └── auth.js                # JWT utilities
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Data awal
├── public/
│   ├── logo/                  # Taruh file logo disini
│   ├── media/                 # Taruh foto hero disini
│   └── uploads/               # Foto upload (auto-created)
├── .env.example
├── jsconfig.json
├── next.config.js
└── package.json
```

---

## 🚀 Cara Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Setup Database di Railway
1. Buka [railway.app](https://railway.app) → New Project → MySQL
2. Setelah deploy, klik **MySQL** → tab **Connect**
3. Copy **MySQL URL** (format: `mysql://user:pass@host:port/database`)

### 3. Buat file `.env`
```bash
cp .env.example .env
```
Isi `.env`:
```
DATABASE_URL="mysql://user:pass@host:port/database"
JWT_SECRET="random-string-yang-panjang-dan-aman"
```

### 4. Push schema ke database
```bash
npx prisma db push
```

### 5. Isi data awal (seed)
```bash
npm run db:seed
```

### 6. Pindahkan file media lama
Salin file-file berikut ke folder `public/`:
```
public/
├── logo/
│   └── logo-tanpa-bg.png     ← dari media/logo/
├── media/
│   └── fotbar.jpg            ← background hero
└── uploads/
    ├── helmi.jpg
    ├── alya.jpg
    ├── iqbal.jpg
    ├── iqbal2.jpeg
    ├── aca2.jpeg
    ├── arin.jpg
    ├── putra.jpg
    └── yosa.jpg
```

### 7. Jalankan development server
```bash
npm run dev
```
Buka: http://localhost:3000

---

## 🔐 Akses Admin Panel

URL: `http://localhost:3000/admin`

Default login:
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **Ganti password setelah deploy!** Masuk ke Prisma Studio: `npm run db:studio`

---

## 🌐 Deploy ke Vercel + Railway

### Deploy Database (Railway)
1. Database sudah jalan di Railway dari langkah sebelumnya ✅

### Deploy Website (Vercel)
1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project → Import repo
3. Tambahkan **Environment Variables**:
   - `DATABASE_URL` → MySQL URL dari Railway
   - `JWT_SECRET` → string rahasia kamu
4. Klik **Deploy**

### Expose Railway ke Vercel
Di Railway → Settings → Networking → **Generate Domain** (agar Vercel bisa akses)

---

## 🗄️ Database

### Tabel yang dibuat:
| Tabel | Kolom |
|-------|-------|
| `Member` | id, name, role, photo, instagram, order, createdAt, updatedAt |
| `Gallery` | id, imageUrl, caption, order, createdAt, updatedAt |
| `Admin` | id, username, password, createdAt |

### Prisma Studio (GUI database)
```bash
npm run db:studio
```
Buka: http://localhost:5555

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/members` | ❌ | Ambil semua member |
| POST | `/api/members` | ✅ | Tambah member baru |
| PUT | `/api/members/:id` | ✅ | Update member |
| DELETE | `/api/members/:id` | ✅ | Hapus member |
| GET | `/api/gallery` | ❌ | Ambil semua foto gallery |
| POST | `/api/gallery` | ✅ | Tambah foto ke gallery |
| DELETE | `/api/gallery/:id` | ✅ | Hapus foto gallery |
| POST | `/api/upload` | ✅ | Upload file gambar |
| POST | `/api/auth/login` | ❌ | Login admin |
| POST | `/api/auth/logout` | ❌ | Logout admin |
| GET | `/api/auth/me` | ✅ | Cek status login |

---

## ⚠️ Catatan Penting

- Foto yang diupload disimpan di `public/uploads/` — untuk **production** sebaiknya pakai **Cloudinary** atau **AWS S3**
- JWT token disimpan sebagai **HttpOnly cookie** untuk keamanan
- Jalankan `npm run db:seed` hanya sekali untuk data awal
