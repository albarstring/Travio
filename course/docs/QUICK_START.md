# Quick Start Guide

## Prerequisites

- Node.js (v18 atau lebih baru)
- PostgreSQL atau MySQL
- npm atau yarn

## Setup Backend

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Setup Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/elearning?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

3. **Setup Database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
# npx prisma db seed
```

4. **Start Backend Server**
```bash
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

## Setup Frontend

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Setup Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. **Start Development Server**
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## Create Admin User

Untuk membuat user admin pertama, jalankan script berikut di backend:

```javascript
// create-admin.js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
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

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Atau gunakan Prisma Studio:
```bash
npx prisma studio
```

## Testing the Application

### 1. Test Public Pages
- Buka `http://localhost:5173`
- Lihat Landing Page
- Browse Course Catalog
- Lihat Course Detail

### 2. Test Registration
- Klik "Register"
- Buat akun baru
- Auto redirect ke Student Dashboard

### 3. Test Student Features
- Browse courses
- Enroll ke course (gratis atau berbayar)
- Mulai belajar di Learning Page
- Lihat progress di Dashboard

### 4. Test Admin Features
- Login sebagai admin
- Akses Admin Dashboard
- Create course
- Manage categories
- View transactions

## Project Structure

```
course/
├── backend/
│   ├── controllers/      # Business logic
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── validators/      # Input validation
│   ├── utils/           # Utility functions
│   ├── prisma/          # Database schema
│   └── uploads/         # Uploaded files
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   ├── services/    # API services
│   │   └── layouts/     # Layout components
│   └── public/          # Static files
│
└── docs/                # Documentation
```

## Common Commands

### Backend
```bash
npm run dev          # Start development server
npm start            # Start production server
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev # Create new migration
npx prisma generate  # Generate Prisma Client
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Troubleshooting

### Database Connection Error
- Pastikan PostgreSQL/MySQL berjalan
- Check DATABASE_URL di .env
- Pastikan database sudah dibuat

### Port Already in Use
- Ubah PORT di .env (backend)
- Atau kill process yang menggunakan port tersebut

### Prisma Errors
- Run `npx prisma generate`
- Run `npx prisma migrate dev`
- Check database connection

### CORS Errors
- Pastikan FRONTEND_URL di backend .env sesuai
- Check CORS configuration di server.js

### Module Not Found
- Delete node_modules dan package-lock.json
- Run `npm install` lagi

## Next Steps

1. **Customize Design**: Edit Tailwind config dan components
2. **Add Features**: Implement additional features sesuai kebutuhan
3. **Setup Email**: Configure email service untuk password reset
4. **Add Payment Gateway**: Integrate payment gateway (Midtrans, Stripe, etc.)
5. **Deploy**: Setup deployment (Vercel, Railway, AWS, etc.)

## Support

Untuk pertanyaan atau issues:
1. Check documentation di folder `docs/`
2. Review code comments
3. Check error logs di console

## License

This project is for educational purposes.

