<template>
  <header class="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#D3D3D3] bg-white/80 px-4 py-2 backdrop-blur-sm font-display">

    <!-- Izquierda: título (vacío en Dashboard) -->
    <div class="flex items-center gap-2">
      <h1 v-if="tituloActual" class="text-lg font-bold text-[#36454F]">{{ tituloActual }}</h1>
    </div>

    <!-- Derecha: hora + avatar + logout -->
    <div class="flex items-center gap-4">
      <p class="hidden text-base font-bold text-[#36454F] sm:block">{{ horaActual }}</p>

      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-xl">
        👤
      </div>

      <button @click="cerrarSesion" class="flex items-center gap-2 rounded-lg bg-[#6E420C]/90 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-[#6E420C]">
        <span class="hidden sm:inline">Cerrar Sesión</span>
        <span class="material-symbols-outlined text-base">logout</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const titulos = {
  Dashboard:     '',  // Sin título en Dashboard
  Bovinos:       'Registro de animales',
  BovinosList:   'Registro de animales',
  BovinoNuevo:   'Nuevo Bovino',
  BovinoEditar:  'Editar Bovino',
  Visitas:       'Visitas Veterinarias',
  Produccion:    'Producción',
  CicloCelo:     'Registro de Ciclo Celo',
  Empleado:      'Gestión de Empleados',
  Ordenio:       'Registro de Ordeño',
  Venta:         'Gestión de Ventas',
  Compra:        'Gestión de Compras',
  Vacunas:       'Control de Vacunas',
  Tratamientos:  'Tratamientos',
  HistorialEnfermedades: 'Historial de Enfermedades',
  Veterinarios:  'Veterinarios',
  AgendaVeterinaria: 'Agenda Veterinaria',
  Insumos:       'Inventario de Insumos',
  Productos:     'Productos',
  Clientes:      'Clientes',
  Proveedores:   'Proveedores',
  InseminacionesList: 'Inseminaciones',
  EmbarazosList: 'Embarazos',
  PartosList:    'Partos'
}

const tituloActual = computed(() => titulos[route.name] || '')

const horaActual = ref('')
let timer = null

function actualizarHora() {
  const ahora = new Date()
  const h = ahora.getHours().toString().padStart(2, '0')
  const m = ahora.getMinutes().toString().padStart(2, '0')
  const s = ahora.getSeconds().toString().padStart(2, '0')
  horaActual.value = `${h}:${m}:${s}`
}

function cerrarSesion() {
  localStorage.clear()
  router.push('/login')
}

onMounted(() => {
  actualizarHora()
  timer = setInterval(actualizarHora, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>