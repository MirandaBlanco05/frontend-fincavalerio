<template>
  <aside class="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col gap-4 bg-[#e8f5e9] p-4 shadow-xl lg:flex font-display">

    <!-- Brand -->
    <RouterLink to="/dashboard" class="flex items-center justify-center px-2 py-6 border-b border-[#5a3a1a]/10 cursor-pointer hover:opacity-90 transition-opacity">
      <img src="@/assets/logo.png" alt="Finca Valerio" class="h-16 w-auto object-contain" />
    </RouterLink>

    <!-- Nav -->
    <ul class="flex flex-col gap-4 overflow-y-auto">

      <!-- Dashboard -->
      <RouterLink to="/dashboard" custom v-slot="{ isActive, navigate }">
        <li @click="navigate" class="flex h-12 cursor-pointer items-center gap-4 rounded-lg px-4 transition-colors"
          :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
          <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'"
            :style="isActive ? `font-variation-settings:'FILL' 1` : ''">dashboard</span>
          <p class="text-sm font-bold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Dashboard</p>
        </li>
      </RouterLink>

      <!-- Ganadería -->
      <li class="px-4 pt-2">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#5a3a1a]/40">Ganadería</p>
        <ul class="mt-2 space-y-1">
          <RouterLink to="/bovinos" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">pets</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Bovino</p>
            </li>
          </RouterLink>

          <RouterLink to="/ordenio" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">water_drop</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Ordenio</p>
            </li>
          </RouterLink>
        </ul>
      </li>

      <!-- Salud y Bienestar -->
      <li class="px-4 pt-2">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#5a3a1a]/40">Salud y Bienestar</p>
        <ul class="mt-2 space-y-1">
          <RouterLink to="/veterinarios" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">medical_services</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Veterinarios</p>
            </li>
          </RouterLink>

          <RouterLink to="/agenda-veterinaria" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">event</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Agenda Veterinaria</p>
            </li>
          </RouterLink>

          <RouterLink to="/historial-enfermedades" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">history_edu</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Historial Enfermedades</p>
            </li>
          </RouterLink>

          <RouterLink to="/vacunas" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">vaccines</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Vacunas</p>
            </li>
          </RouterLink>

          <!-- NUEVO: Tratamientos -->
          <RouterLink to="/tratamientos" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">medication</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Tratamientos</p>
            </li>
          </RouterLink>
        </ul>
      </li>

      <!-- Reproducción -->
      <li class="px-4 pt-2">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#5a3a1a]/40">Reproducción</p>
        <ul class="mt-2 space-y-1">
          <RouterLink to="/celo" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">cruelty_free</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Ciclo celo</p>
            </li>
          </RouterLink>

          <RouterLink to="/inseminaciones" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">science</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Inseminación</p>
            </li>
          </RouterLink>

          <RouterLink to="/embarazos" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">pregnancy</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Embarazo</p>
            </li>
          </RouterLink>

          <RouterLink to="/partos" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">child_friendly</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Parto</p>
            </li>
          </RouterLink>
        </ul>
      </li>

      <!-- Facturación -->
      <li class="px-4 pt-2">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#5a3a1a]/40">Facturación</p>
        <ul class="mt-2 space-y-1">
          <RouterLink to="/compra" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">inventory_2</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Compra</p>
            </li>
          </RouterLink>

          <RouterLink to="/venta" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">receipt_long</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Venta</p>
            </li>
          </RouterLink>
        </ul>
      </li>

      <!-- Inventario -->
      <li class="px-4 pt-2">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#5a3a1a]/40">Inventario</p>
        <ul class="mt-2 space-y-1">
          <RouterLink to="/productos" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">inventory</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Producto</p>
            </li>
          </RouterLink>

          <RouterLink to="/insumos" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">construction</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Insumo</p>
            </li>
          </RouterLink>
        </ul>
      </li>

      <!-- Contactos -->
      <li class="px-4 pt-2">
        <p class="text-[10px] font-bold uppercase tracking-widest text-[#5a3a1a]/40">Contactos</p>
        <ul class="mt-2 space-y-1">
          <RouterLink to="/empleado" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">badge</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Empleado</p>
            </li>
          </RouterLink>

          <RouterLink to="/clientes" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">groups</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Clientes</p>
            </li>
          </RouterLink>

          <RouterLink to="/proveedores" custom v-slot="{ isActive, navigate }">
            <li @click="navigate" class="flex h-10 cursor-pointer items-center gap-3 rounded-lg px-4 transition-colors"
              :class="isActive ? 'bg-[#8B6914]/15' : 'hover:bg-[#5a3a1a]/5'">
              <span class="material-symbols-outlined" :class="isActive ? 'text-[#8B6914]' : 'text-[#5a3a1a]/70'">support_agent</span>
              <p class="text-sm font-semibold" :class="isActive ? 'text-[#5a3a1a]' : 'text-[#5a3a1a]/80'">Proveedores</p>
            </li>
          </RouterLink>
        </ul>
      </li>

    </ul>

    <div class="mt-auto border-t border-[#5a3a1a]/10 pt-3">
      <p class="text-right text-[10px] text-[#5a3a1a]/30">v1.0.0</p>
    </div>
  </aside>
</template>

<script setup></script>