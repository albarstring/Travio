# E-Learning Platform

Platform pembelajaran online berbasis video dengan role Pelajar dan Admin.

## Tech Stack

### Frontend
- React.js + Vite
- React Router
- Context API / Redux Toolkit
- Tailwind CSS + DaisyUI

### Backend
- Express.js (Node.js)
- JWT Authentication
- PostgreSQL / MySQL
- Prisma ORM

## Struktur Project

```
course/
├── frontend/          # React + Vite application
├── backend/           # Express.js API server
├── docs/              # Dokumentasi lengkap
└── README.md
```

## Fitur Utama

### Public Pages
- Landing Page dengan hero section, benefits, featured courses, testimonials, FAQ
- Course Catalog dengan search, filter, sorting, pagination
- Course Detail Page dengan deskripsi, kurikulum, preview video

### Authentication
- Register, Login, Logout
- Lupa Password
- Protected Routes
- JWT Token Management

### Student Dashboard
- Overview dengan statistik
- My Courses (aktif & selesai)
- Learning Page dengan video player
- Learning Activity
- Quiz & Assessment
- Certificates
- Transaction History
- Profile & Settings

### Admin Dashboard
- Overview dengan analytics
- Course Management (CRUD)
- Category Management
- User Management
- Transaction Management
- Certificate Management
- Reports & Analytics

## Getting Started

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure database in .env
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Dokumentasi

Lihat folder `docs/` untuk dokumentasi lengkap:
- Sitemap & User Flow
- Wireframe Descriptions
- UI/UX Guidelines
- Database Schema
- API Endpoints
- Best Practices

