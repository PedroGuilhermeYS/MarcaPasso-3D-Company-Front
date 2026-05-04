<script setup>
import AppNavbar from '@/componentes/layout/AppNavbar.vue'
import AppFooter from '@/componentes/layout/AppFooter.vue'
</script>

<template>
  <AppNavbar />
  <main class="users">
    <router-view />
  </main>
  <AppFooter />
</template>
