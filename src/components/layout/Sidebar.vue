<template>
  <aside class="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col gap-4 bg-[#e8f5e9] p-4 shadow-xl lg:flex font-display">

    <!-- Brand - Solo Logo SIN fondo -->
    <RouterLink to="/dashboard" class="flex items-center justify-center px-2 py-6 border-b border-[#5a3a1a]/10 cursor-pointer hover:opacity-90 transition-opacity">
      <img src="@/assets/logo.png" alt="Finca Valerio" class="h-24 w-auto object-contain" />
    </RouterLink>

    <!-- Nav -->
    <ul class="flex flex-col gap-1">

      <!-- Producción -->
      <RouterLink to="/produccion" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'"
            :style="isActive ? `font-variation-settings:'FILL' 1` : ''">monitoring</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Producción</p>
        </li>
      </RouterLink>

      <li class="px-4 pt-3 pb-1">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#5a3a1a]/40">Gestión</p>
      </li>

      <RouterLink to="/bovinos" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
          <svg :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M10.5 18a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5m3 0a.5.5 0 0 1 .5.5a.5.5 0 0 1-.5.5a.5.5 0 0 1-.5-.5a.5.5 0 0 1 .5-.5M10 11a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1m4 7c0 2.21-2.69 4-6 4s-6-1.79-6-4c0-.9.45-1.73 1.2-2.4c-.75-1-1.2-2.25-1.2-3.6l.12-1.22c-.54.15-1.19.15-1.72 0c-1.02-.28-2.56-1.43-2.33-2.23s2.14-.95 3.16-.65c.59.17 1.22.6 1.59 1.06l.57-.81C6.79 7.05 7 4 10 3l-.09.14c-.28.44-1 1.83-.24 3.33a6.02 6.02 0 0 1 4.66 0c.76-1.5.04-2.89-.24-3.33L14 3c3 1 3.21 4.05 2.61 5.15l.57.81c.37-.46 1-.89 1.59-1.06c1.02-.3 2.93-.15 3.16.65s-1.31 1.95-2.33 2.23c-.53.15-1.18.15-1.72 0L18 12c0 1.35-.45 2.6-1.2 3.6c.75.67 1.2 1.5 1.2 2.4m-6-2c-2.21 0-4 .9-4 2s1.79 2 4 2s4-.9 4-2s-1.79-2-4-2m0-2c1.12 0 2.17.21 3.07.56c.58-.69.93-1.56.93-2.56a4 4 0 0 0-4-4a4 4 0 0 0-4 4c0 1 .35 1.87.93 2.56c.9-.35 1.95-.56 3.07-.56m2.09-10.86"/></svg>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Animales</p>
        </li>
      </RouterLink>

      <RouterLink to="/visitas" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'"
            :style="isActive ? `font-variation-settings:'FILL' 1` : ''">medical_services</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Visitas Veterinarias</p>
        </li>
      </RouterLink>

      <RouterLink to="/celo" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'"
            :style="isActive ? `font-variation-settings:'FILL' 1` : ''">favorite</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Ciclo Celo</p>
        </li>
      </RouterLink>

      <RouterLink to="/empleado" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'"
            :style="isActive ? `font-variation-settings:'FILL' 1` : ''">badge</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Empleados</p>
        </li>
      </RouterLink>

      <RouterLink to="/ordenio" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'"
            :style="isActive ? `font-variation-settings:'FILL' 1` : ''">water_drop</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Ordeño</p>
        </li>
      </RouterLink>

      <li class="px-4 pt-3 pb-1">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#5a3a1a]/40">Ventas</p>
      </li>

      <RouterLink to="/venta" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'"
            :style="isActive ? `font-variation-settings:'FILL' 1` : ''">receipt_long</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Facturación</p>
        </li>
      </RouterLink>

      <RouterLink to="/compra" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#4c9a4c]/20' : 'hover:bg-white/8'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/60'">inventory_2</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#4c9a4c]' : 'text-white/80'">Compras</p>
        </li>
      </RouterLink>

    </ul>

    <div class="mt-auto border-t border-[#5a3a1a]/10 pt-3">
      <p class="text-right text-[10px] text-[#5a3a1a]/30">v1.0.0</p>
    </div>
  </aside>
</template>

<script setup></script>