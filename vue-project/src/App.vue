<template>
  <div>
    <Header />
    <main>
      <Banner />
      <PostList />
    </main>
  </div>
</template>

<script setup>
import Header from './components/Navbar.vue';
import Banner from './components/Banner.vue';
import PostList from './components/PostList.vue';
</script>