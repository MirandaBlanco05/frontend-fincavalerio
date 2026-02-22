<template>
  <div id="finca-app" class="font-display text-[#36454F] bg-white min-h-screen">

    <!-- Sidebar fijo (solo en desktop lg+) -->
    <Sidebar v-if="mostrarLayout" />

    <!-- Contenido principal, empujado por el sidebar -->
    <div
      class="flex min-h-screen flex-col"
      :class="mostrarLayout ? 'lg:ml-64' : ''"
    >
      <TopBar v-if="mostrarLayout" />

      <!-- Página -->
      <main class="flex-1 p-4 sm:p-6" :class="mostrarLayout ? 'mt-16' : ''">
        <RouterView />
      </main>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import TopBar  from '@/components/layout/TopBar.vue'

const route = useRoute()
const mostrarLayout = computed(() => route.name !== 'Login')
</script>