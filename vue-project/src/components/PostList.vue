<template>
  <div class="max-w-6xl mx-auto py-10 px-4">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
      <div class="text-gray-600">
        Showing {{ startIndex + 1 }}–{{ endIndex }} of {{ totalItems }}
      </div>

      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <span class="text-gray-600">Show per page:</span>
          <select v-model.number="perPage" class="border border-gray-300 rounded-full px-3 py-1 text-sm">
            <option v-for="option in perPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-gray-600">Sort by:</span>
          <select v-model="sortOrder" class="border border-gray-300 rounded-full px-3 py-1 text-sm">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Grid Posts -->
    <div v-if="paginatedPosts.length === 0 && !loading" class="text-center text-gray-400 py-8">
      Tidak ada postingan ditemukan.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in paginatedPosts" :key="post.id"
        class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
        <div class="w-full aspect-[4/3] bg-gray-200">
          <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="p-4">
          <p class="text-sm text-gray-500 mt-0">{{ formatDate(post.createdAt) }}</p>
          <h3 class="text-base font-semibold text-gray-800 line-clamp-3" :title="post.title">
            {{ post.title }}
          </h3>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-center flex-wrap gap-2 items-center">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1  disabled:opacity-50">
        < </button>

          <button v-for="page in totalPages" :key="page" @click="currentPage = page" class="px-3 py-1 " :class="{
            'bg-white text-gray-700': currentPage !== page
          }">
            {{ page }}
          </button>

          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="px-3 py-1  disabled:opacity-50">></button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, watch, onMounted } from 'vue'

// Konstanta
const perPageOptions = [10, 20, 50]
const sortOrder = ref('newest')
const perPage = ref(10)
const currentPage = ref(1)
const totalItems = ref(0)
const STORAGE_KEY = 'postlist_state'
const loading = ref(false)
// Data post
const allPosts = ref([])

// Komputasi indeks awal dan akhir berdasarkan pagination
const startIndex = computed(() => (currentPage.value - 1) * perPage.value)
const endIndex = computed(() => {
  const calculated = startIndex.value + allPosts.value.length
  return calculated > totalItems.value ? totalItems.value : calculated
})

// Simpan state ke localStorage
function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      perPage: perPage.value,
      sortOrder: sortOrder.value,
      currentPage: currentPage.value
    })
  )
}

// Load state dari localStorage
function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if (perPageOptions.includes(parsed.perPage)) perPage.value = parsed.perPage
    if (['newest', 'oldest'].includes(parsed.sortOrder)) sortOrder.value = parsed.sortOrder
    if (typeof parsed.currentPage === 'number') currentPage.value = parsed.currentPage
  } catch {
    // ignore error
  }
}

// Watch perubahan
watch([perPage, sortOrder, currentPage], () => {
  saveState()
  fetchPosts()
})

// Fetch data post dari API
const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await axios.get(
      'https://suitmedia-backend.suitdev.com/api/ideas',
      {
        params: {
          'page[number]': currentPage.value,
          'page[size]': perPage.value,
          'append[]': ['small_image', 'medium_image'],
          sort: sortOrder.value === 'newest' ? '-published_at' : 'published_at'
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )

    const data = response.data

    if (!data?.data) {
      console.error('Response tidak valid:', data)
      return
    }

    allPosts.value = data.data.map(item => ({
      id: item.id,
      title: item.title,
      image: item.medium_image[0]?.url || '/images/placeholder.jpg',
      createdAt: item.published_at
    }))

    totalItems.value = data.meta.total
  } catch (err) {
    console.error('Gagal fetch data:', err)
  } finally {
    loading.value = false
  }
}



// Jalankan saat komponen dimuat
onMounted(() => {
  loadState()
  fetchPosts()
})


// Total halaman berdasarkan jumlah data
const totalPages = computed(() =>
  Math.ceil(totalItems.value / perPage.value)
)

// Ambil post yang ditampilkan di halaman saat ini
const paginatedPosts = allPosts

// Navigasi halaman
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Format tanggal agar terbaca
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>


<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(1em * 1.25 * 3);
  max-height: calc(1em * 1.25 * 3);
}
</style>
