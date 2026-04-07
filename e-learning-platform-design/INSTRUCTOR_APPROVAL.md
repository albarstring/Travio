# Sistem Manajemen Instructor

## Deskripsi
Sistem ini memberikan kontrol penuh kepada admin untuk mengelola instructor. Instructor **hanya dapat dibuat oleh admin**, bukan melalui registrasi publik.

## Fitur Utama

### 1. Registrasi Publik (Student Only)
- Halaman signup hanya untuk membuat akun **student**
- Tidak ada opsi untuk memilih role "instructor" saat signup
- Semua registrasi publik otomatis menjadi student

### 2. Create Instructor (Admin Only)
- Admin dapat membuat akun instructor melalui dashboard
- Button "Create Instructor" di halaman User Management
- Form input: Name, Email, Password
- Instructor yang dibuat otomatis:
  - `isVerified: true` (sudah terverifikasi)
  - `isActive: true` (sudah aktif)
  - `isApproved: true` (sudah disetujui)

### 3. Dashboard Admin
- Admin dapat melihat semua user (students dan instructors)
- Filter "Instructor" untuk melihat hanya instructor
- Setiap instructor memiliki status badges

### 4. Aksi Admin

#### Create Instructor
- Admin klik button "Create Instructor" di header User Management
- Isi form dengan nama, email, dan password instructor
- Instructor langsung aktif dan dapat membuat course
- Action dicatat dalam console log

#### Activate/Deactivate Instructor

## Akun Admin Default

### Login Credentials:
- **Email**: admin@example.com
- **Password**: password123
- **Role**: admin

**PENTING**: Ganti password setelah login pertama di production!

## Database Schema

Field baru ditambahkan ke tabel `users`:
```sql
isApproved BOOLEAN DEFAULT true
``## Activate/Deactivate Instructor
- Admin dapat mengaktifkan atau menonaktifkan akun instructor
- Instructor yang dinonaktifkan tidak dapat login atau mengakses platform
- Action dicatat dalam console log

#### Delete Instructor
- Admin dapat menghapus akun instructor
- Pastikan instructor tidak memiliki course aktif
### Activate/Deactivate Instructor
```
PATCH /api/admin/users/[userId]
Body: { action: "activate" } atau { action: "deactivate" }
Headers: x-user-id, x-user-role: admin
```

### Delete Instructor
```
DELETE /api/admin/users/[userId]
Headers: x-user-id, x-user-role: admin
```

## Database Schema

Field penting di tabel `users`:
```sql
role VARCHAR  -- 'student', 'instructor', 'admin'
isVerified BOOLEAN DEFAULT false
isActive BOOLEAN DEFAULT true
isApproved BOOLEAN DEFAULT true
```

- `isApproved` default `true` untuk semua user
- Instructor yang dibuat admin langsung `isApproved: true
### Activate/Deactivat

### Reject Instructor
```
PATCH /api/admin/users/[userId]
Body: { action: "reject", reason: "..." }
Headers: x-user-id, x-user-role: admin
```Create Instructor Baru
- Klik button "Create Instructor" di header
- Isi form:
  - Full Name: Nama instructor
  - Email: Email unik instructor
  - Password: Min. 6 karakter
- Klik "Create Instructor"
- Instructor langsung dapat login dan membuat course

### 4. Manage Instructor
- Klik icon titik tiga (⋮) pada instructor
- Pilih action: Activate, Deactivate, atau Delete

### 2. Akses User Management
- Buka menu A** - Status verifikasi email (hijau) - Auto true untuk instructor yang dibuat admin
2. **Active/Inactive** - Status aktivasi akun (biru/merah)
3. **Approved** - Status persetujuan (hijau) - Auto true untuk instructor yang dibuat admin

## Testing

### Buat Instructor Baru:
1. Login sebagai admin
2. Buka User Management
3. Klik "Create Instructor"
4. Isi form:
   - Name: Test Instructor
   - Email: test@instructor.com
   - Password: password123
5. Klik "Create Instructor"
6. Instructor dapat langsung login dengan email dan password tersebut

### Student Signup:
1. Buka halaman signup: `/signup`
2. Daftar dengan nama, email, password
3. Otomatis menjadi student (tidak ada pilihan role)
4. Verifikasi email untuk aktivasi akun

## Security
- Hanya admin yang dapat membuat instructor
- Middleware memeriksa `x-user-role: admin` di header
- Unauthorized request akan di-reject dengan status 401
- Email instructor harus unik
- Password di-hash dengan bcrypt

## Future Enhancements
- [ ] Bulk create instructors via CSV upload
- [ ] Email notification ke instructor baru dengan login credentials
- [ ] Instructor profile template/wizard saat pertama login
- [ ] Admin dashboard untuk statistik instructor
- [ ] Instructor onboarding checklist
- Entity Type: "user"
- Entity ID: User ID instructor
- Admin ID: ID admin yang melakukan aksi
- Details: Informasi tambahan (reason untuk reject)

## Security
- Hanya admin yang dapat approve/reject instructor
- Middleware memeriksa `x-user-role: admin` di header
- Unauthorized request akan di-reject dengan status 401

## Future Enhancements
- [ ] Email notification ke instructor saat approved/rejected
- [ ] Admin dashboard untuk statistik pending instructors
- [ ] Bulk approve/reject
- [ ] Review process dengan comments
- [ ] Instructor profile review sebelum approval
