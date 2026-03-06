<template>
  <aside class="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col gap-4 bg-[#1f241a] p-4 shadow-xl lg:flex font-display">

    <!-- Brand clickeable -->
    <RouterLink to="/dashboard" class="flex items-center gap-3 px-2 py-4 border-b border-white/10 cursor-pointer hover:opacity-80 transition-opacity">
      <span class="material-symbols-outlined text-[#4c9a4c] text-4xl" style="font-variation-settings:'FILL' 1;">grass</span>
      <h1 class="text-xl font-bold text-white">Finca Valerio</h1>
    </RouterLink>

    <!-- Nav -->
    <ul class="flex flex-col gap-1">

      <!-- Producción -->
      <RouterLink to="/produccion" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#4c9a4c]/20' : 'hover:bg-white/8'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/60'"
            :style="isActive ? `font-variation-settings:'FILL' 1` : ''">monitoring</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/80'">Producción</p>
        </li>
      </RouterLink>

      <li class="px-4 pt-3 pb-1">
        <p class="text-[10px] font-bold uppercase tracking-widest text-white/30">Módulos</p>
      </li>

      <RouterLink to="/bovinos" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#4c9a4c]/20' : 'hover:bg-white/8'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/60'"
            :style="isActive ? `font-variation-settings:'FILL' 1` : ''">pets</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/80'">Animales</p>
        </li>
      </RouterLink>

      <RouterLink to="/visitas" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#4c9a4c]/20' : 'hover:bg-white/8'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/60'">medical_services</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/80'">Visitas Veterinarias</p>
        </li>
      </RouterLink>

      <RouterLink to="/celo" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#4c9a4c]/20' : 'hover:bg-white/8'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/60'">favorite</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/80'">Ciclo Celo</p>
        </li>
      </RouterLink>

      <li class="px-4 pt-3 pb-1">
        <p class="text-[10px] font-bold uppercase tracking-widest text-white/30">Próximamente</p>
      </li>

      <li class="flex h-12 items-center gap-4 rounded-lg px-4 opacity-30 cursor-not-allowed">
        <span class="material-symbols-outlined text-white/60">shopping_cart</span>
        <p class="text-sm font-bold text-white/80">Compra y Venta</p>
      </li>

    </ul>

    <div class="mt-auto border-t border-white/10 pt-3">
      <p class="text-right text-[10px] text-white/20">v1.0.0</p>
    </div>
  </aside>
</template>

<script setup></script>
