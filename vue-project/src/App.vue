<template>
  <div>
    <Header />
    <Banner />
    <PostList />
  </div>
</template>

<script setup>
import Header from './components/Navbar.vue';
import Banner from './components/Banner.vue';
import PostList from './components/PostList.vue';
import { posts, pagination, currentPage, itemsPerPage, sortBy } from './store.js';

</script>