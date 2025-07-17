<template>
    <section>
      <div class="relative w-full overflow-hidden">
        <div
          ref="parallaxBanner"
          class="banner-container relative flex h-[50vh] items-center justify-center bg-cover bg-center text-center text-white mt-14"
          :style="{ backgroundImage: `url(${imageUrl})`, backgroundPositionY: `${offsetY}px` }"
        >
          <!-- Overlay hitam -->
          <div class="absolute inset-0 bg-black/40 z-10"></div>
  
          <!-- SVG overlay dekoratif -->
          <div
            class="absolute inset-0 opacity-10 pointer-events-none select-none z-20 flex items-center justify-center"
          >
            <svg class="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 100 Q200 50 300 100 T500 100" stroke="currentColor" stroke-width="2" fill="none" />
              <circle cx="150" cy="80" r="30" stroke="currentColor" stroke-width="2" fill="none" />
              <rect x="400" y="60" width="60" height="40" stroke="currentColor" stroke-width="2" fill="none" />
              <path d="M600 120 L650 80 L700 120 Z" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
          </div>
  
          <!-- Konten utama -->
          <div class="relative z-30 w-full flex items-center justify-center h-full">
            <div class="container mx-auto px-4 text-center">
              <h1 class="text-5xl font-bold mb-4">Ideas</h1>
              <p class="text-xl text-gray-300">Where all our great things begin</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const imageUrl = ref(
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop'
  );
  
  const offsetY = ref(0);
  
  const handleScroll = () => {
    offsetY.value = window.scrollY * 0.3; // parallax speed
  };
  
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  </script>
  
  <style scoped>
  .banner-container {
    clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
    position: relative;
    z-index: 0;
    transition: background-position 0.2s ease-out;
    background-attachment: scroll;
    background-repeat: no-repeat;
    background-size: cover;
  }
  </style>
  