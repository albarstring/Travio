import { ref, watchEffect } from 'vue';

// --- State Reaktif ---
export const posts = ref([]);
export const pagination = ref({ from: 0, to: 0, total: 0, last_page: 1 });
export const currentPage = ref(Number(localStorage.getItem('currentPage')) || 1);
export const itemsPerPage = ref(Number(localStorage.getItem('itemsPerPage')) || 10);
export const sortBy = ref(localStorage.getItem('sortBy') || '-published_at');

// --- Fungsi Pengambil Data ---
// Perbaikan: 'export' langsung pada deklarasi fungsi
export async function fetchData() {
  localStorage.setItem('currentPage', currentPage.value);
  localStorage.setItem('itemsPerPage', itemsPerPage.value);
  localStorage.setItem('sortBy', sortBy.value);

  const params = new URLSearchParams();
  params.append('page[number]', currentPage.value);
  params.append('page[size]', itemsPerPage.value);
  params.append('sort', sortBy.value);
  params.append('append[]', 'small_image');
  params.append('append[]', 'medium_image');

  try {
    const response = await fetch(`/api/ideas?${params.toString()}`, {
      method: 'GET',
      headers: {
        // Perbaikan: Header 'Content-Type' tidak diperlukan untuk request GET
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    posts.value = result.data || [];
    pagination.value = result.meta || { from: 0, to: 0, total: 0, last_page: 1 };

  } catch (error) {
    console.error("Gagal mengambil data API:", error);
    // Reset state jika terjadi error
    posts.value = [];
    pagination.value = { from: 0, to: 0, total: 0, last_page: 1 };
  }
}

// --- Watcher ---
watchEffect(() => {
  fetchData();
});