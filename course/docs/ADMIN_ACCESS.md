# Cara Mengakses Dashboard Admin

## Langkah-langkah

### 1. Buat User Admin

Ada beberapa cara untuk membuat user admin:

#### Cara 1: Menggunakan Script (Recommended)
```bash
cd backend
npm run create-admin
```

Script akan meminta input:
- Nama Admin (default: "Admin")
- Email (default: "admin@example.com")
- Password (default: "admin123")

#### Cara 2: Menggunakan Prisma Studio
```bash
cd backend
npx prisma studio
```

1. Buka browser di `http://localhost:5555`
2. Pilih tabel `User`
3. Klik "Add record"
4. Isi data:
   - `name`: Admin
   - `email`: admin@example.com
   - `password`: (hash dengan bcrypt - gunakan script untuk ini)
   - `role`: ADMIN
   - `isActive`: true
   - `emailVerified`: true

#### Cara 3: Manual dengan Node.js
Buat file `create-admin-manual.js`:
```javascript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      emailVerified: true
    }
  })
  
  console.log('Admin created:', admin)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Jalankan:
```bash
node create-admin-manual.js
```

### 2. Login sebagai Admin

1. Pastikan backend dan frontend sudah running:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. Buka browser di `http://localhost:5173`

3. Klik "Login" di navbar

4. Masukkan credentials admin:
   - **Email**: admin@example.com (atau email yang Anda buat)
   - **Password**: admin123 (atau password yang Anda buat)

5. Setelah login berhasil, Anda akan otomatis di-redirect ke:
   - **Admin Dashboard**: `http://localhost:5173/admin/dashboard`
   - Jika role bukan ADMIN, akan di-redirect ke student dashboard

### 3. Akses Dashboard Admin

Setelah login sebagai admin, Anda bisa mengakses:

- **Dashboard**: `http://localhost:5173/admin/dashboard`
- **Course Management**: `http://localhost:5173/admin/courses`
- **Category Management**: `http://localhost:5173/admin/categories`
- **User Management**: `http://localhost:5173/admin/users`
- **Transaction Management**: `http://localhost:5173/admin/transactions`

Atau gunakan sidebar navigation di Admin Layout.

## Fitur Admin Dashboard

### Dashboard Overview
- Total Users
- Total Courses
- Total Transactions
- Total Revenue
- Recent Courses
- Recent Transactions

### Course Management
- Create new course
- Edit course
- Delete course
- Upload thumbnail
- Set price, category, level
- Publish/Draft course

### Lesson Management
- Add lessons to course
- Upload video
- Set lesson order
- Set preview lesson
- Edit/Delete lessons

### Category Management
- Create category
- Edit category
- Delete category

### User Management
- View all users
- Activate/Deactivate users
- View user statistics

### Transaction Management
- View all transactions
- Approve/Reject payments
- Auto-enroll users after payment approval

## Troubleshooting

### Tidak bisa login sebagai admin
1. Pastikan user sudah dibuat dengan role `ADMIN`
2. Check di database apakah user ada dan role-nya benar
3. Pastikan password sudah di-hash dengan bcrypt
4. Check console untuk error messages

### Redirect ke student dashboard
- Pastikan user memiliki role `ADMIN` di database
- Check di Redux store apakah user.role = 'ADMIN'
- Clear localStorage dan login lagi

### Route tidak ditemukan
- Pastikan frontend sudah running
- Check apakah route `/admin/dashboard` ada di `App.jsx`
- Check browser console untuk errors

### Permission denied
- Pastikan middleware `authorize('ADMIN')` sudah di-set di backend routes
- Check apakah JWT token valid
- Pastikan user memiliki role ADMIN di database

## Security Notes

⚠️ **Penting untuk Production:**
1. Ganti password default setelah pertama kali login
2. Gunakan email yang valid
3. Enable email verification
4. Setup proper authentication untuk production
5. Consider menggunakan environment variables untuk admin credentials

## Quick Test

Setelah membuat admin user, test dengan:

```bash
# Test login via API
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Jika berhasil, akan return JWT token dan user data dengan role ADMIN.

