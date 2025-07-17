// 1. Impor plugin di bagian paling atas
import lineClamp from '@tailwindcss/line-clamp';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // 2. Gunakan variabel hasil impor di dalam array plugins
  plugins: [
    lineClamp,
  ],
}