# Backend Package

```json
{
  "name": "@e-learning/backend",
  "version": "1.0.0",
  "description": "Backend services and database logic",
  "main": "src/index.ts",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "seed:instructor": "tsx scripts/seed-instructor-profile.ts",
    "seed:student-name": "tsx scripts/fix-student-name.ts"
  },
  "dependencies": {
    "@prisma/client": "latest",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/node": "^20.0.0",
    "prisma": "latest",
    "tsx": "^3.12.7",
    "typescript": "^5.0.0"
  }
}
```

## 📁 Structure

- `src/lib/` - Services, Repositories, Exceptions, Utilities
- `src/prisma/` - Database schema
- `scripts/` - Seed and utility scripts
