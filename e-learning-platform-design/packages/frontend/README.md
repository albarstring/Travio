# Frontend Package

```json
{
  "name": "@e-learning/frontend",
  "version": "1.0.0",
  "description": "Frontend UI and pages",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwindcss": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "typescript": "^5.0.0"
  }
}
```

## 📁 Structure

- `app/` - Next.js App Router
- `components/` - React components
- `hooks/` - Custom hooks
- `public/` - Static assets
- `styles/` - CSS and Tailwind config
