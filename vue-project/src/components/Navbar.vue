<template>
  <transition name="navbar-fade">
    <header
      v-show="showHeader"
      class="bg-orange-500/90 text-white fixed top-0 left-0 w-full z-50 transition-all duration-300"
      :class="{ 'backdrop-blur-md': true }"
    >
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <img src="/image/suitmedia1.png" alt="Suitmedia Logo" class="h-8 w-auto" />
        </div>
        <nav class="hidden md:flex space-x-8">
          <a
            v-for="item in menu"
            :key="item.name"
            :href="item.href"
            class="hover:text-orange-200 transition-colors"
            :class="isActive(item.href) ? 'underline underline-offset-4 font-semibold' : ''"
          >
            {{ item.name }}
          </a>
        </nav>
      </div>
    </header>
  </transition>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Menu items
const menu = [
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Ideas', href: '/ideas' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' }
]

// Show/hide header on scroll
const showHeader = ref(true)
let lastScrollY = window.scrollY

const handleScroll = () => {
    const currentScrollY = window.scrollY
    if (currentScrollY < 10) {
        showHeader.value = true
    } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        showHeader.value = false
    } else {
        // Scrolling up
        showHeader.value = true
    }
    lastScrollY = currentScrollY
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

// Active state based on current location
function isActive(href) {
    // For demo, use window.location.pathname
    // In real app with vue-router, use useRoute()
    return window.location.pathname === href
}
</script>
<style scoped>
.navbar-fade-enter-active,
.navbar-fade-leave-active {
  transition: opacity 0.3s;
}
.navbar-fade-enter-from,
.navbar-fade-leave-to {
  opacity: 0;
}
</style>
