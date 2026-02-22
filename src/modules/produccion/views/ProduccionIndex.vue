<template>
  <div class="flex flex-col gap-6">

    <!-- Título dinámico -->
    <div>
      <h2 class="text-2xl font-bold text-[#1a1a1a]">{{ tabActivo.titulo }}</h2>
      <p class="text-sm text-gray-500">{{ tabActivo.subtitulo }}</p>
    </div>

    <!-- Alertas -->
    <div v-if="store.error" class="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span class="material-symbols-outlined text-base">warning</span>{{ store.error }}
    </div>
    <div v-if="store.mensaje" class="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      <span class="material-symbols-outlined text-base">check_circle</span>{{ store.mensaje }}
    </div>

    <!-- ── Tabs pill-style ─────────────────────────────────── -->
    <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button v-for="tab in tabs" :key="tab.id" @click="tabId = tab.id"
        class="flex h-10 shrink-0 items-center justify-center rounded-full px-5 text-sm font-bold transition-colors whitespace-nowrap"
        :class="tabId === tab.id
          ? 'bg-[#6E420C] text-white'
          : 'border border-gray-200 bg-white text-gray-700 hover:bg-[#e7f3e7]'">
        {{ tab.label }}
      </button>
    </div>

    <!-- ════════════════════════════════════════ -->
    <!-- TAB: RESUMEN (Reproducción)             -->
    <!-- ════════════════════════════════════════ -->
    <template v-if="tabId === 'resumen'">

      <!-- 3 KPI cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="flex flex-col gap-2 rounded-lg p-6 bg-[#f3eee7]">
          <p class="text-[#6E420C] text-base font-medium">Nacimientos (Mes)</p>
          <p class="text-3xl font-bold text-[#1a1a1a]">{{ store.nacimientos.length || 12 }}</p>
          <div class="flex items-center gap-1 text-green-700">
            <span class="material-symbols-outlined text-base">arrow_upward</span>
            <p class="text-sm font-medium">+2 vs mes anterior</p>
          </div>
        </div>
        <div class="flex flex-col gap-2 rounded-lg p-6 bg-[#e7f3e7]">
          <p class="text-[#4c9a4c] text-base font-medium">Tasa de Éxito (Insem.)</p>
          <p class="text-3xl font-bold text-[#1a1a1a]">85%</p>
          <div class="flex items-center gap-1 text-green-700">
            <span class="material-symbols-outlined text-base">arrow_upward</span>
            <p class="text-sm font-medium">+3%</p>
          </div>
        </div>
        <div class="flex flex-col gap-2 rounded-lg p-6 bg-[#f3eee7]">
          <p class="text-[#6E420C] text-base font-medium">Total de Animales</p>
          <p class="text-3xl font-bold text-[#1a1a1a]">256</p>
          <div class="flex items-center gap-1 text-green-700">
            <span class="material-symbols-outlined text-base">arrow_upward</span>
            <p class="text-sm font-medium">+8 este mes</p>
          </div>
        </div>
      </div>

      <!-- Gráficas 2 columnas -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <!-- Donut reproducción -->
        <div class="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6">
          <p class="text-base font-medium text-[#1a1a1a]">Detalle de Reproducción</p>
          <div class="flex items-baseline gap-2">
            <p class="text-[32px] font-bold text-[#1a1a1a]">24</p>
            <p class="text-base text-gray-500">Inseminaciones este mes</p>
          </div>
          <p class="text-sm text-green-700 font-medium">+15% vs. Mes Anterior</p>
          <div class="relative min-h-[180px] w-full">
            <div class="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <p class="text-4xl font-bold text-[#6E420C]">85%</p>
              <p class="text-sm text-[#6E420C]/80">Tasa de éxito</p>
            </div>
            <svg class="h-full w-full" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#f3eee7" stroke-width="4"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#6E420C" stroke-dasharray="85,100" stroke-linecap="round" stroke-width="4" transform="rotate(90 18 18)"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#4c9a4c" stroke-dasharray="70,100" stroke-dashoffset="-85" stroke-linecap="round" stroke-width="4" transform="rotate(90 18 18)"/>
            </svg>
          </div>
          <div class="flex justify-center gap-6 text-sm">
            <div class="flex items-center gap-2"><div class="size-3 rounded-full bg-[#6E420C]"></div><span>Confirmadas</span></div>
            <div class="flex items-center gap-2"><div class="size-3 rounded-full bg-[#4c9a4c]"></div><span>Pendientes</span></div>
          </div>
        </div>

        <!-- Barras nacimientos vs bajas -->
        <div class="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6">
          <p class="text-base font-medium text-[#1a1a1a]">Nacimientos vs. Bajas (Últimos 6 meses)</p>
          <div class="grid min-h-[240px] grid-flow-col gap-4 grid-rows-[1fr_auto] items-end justify-items-center px-3 pt-4">
            <template v-for="(m, i) in mesesResumen" :key="i">
              <div class="flex h-full w-full flex-col-reverse items-center gap-1">
                <div class="bg-[#e7f3e7] w-3/4 rounded-t" :style="`height:${m.nac}%`"></div>
                <div class="bg-red-200 w-3/4 rounded-t" :style="`height:${m.baj}%`"></div>
              </div>
              <p class="text-[#6E420C] text-xs font-bold">{{ m.label }}</p>
            </template>
          </div>
          <div class="flex justify-center gap-6 text-sm">
            <div class="flex items-center gap-2"><div class="size-3 rounded-full bg-[#4c9a4c]"></div><span>Nacimientos</span></div>
            <div class="flex items-center gap-2"><div class="size-3 rounded-full bg-red-400"></div><span>Bajas</span></div>
          </div>
        </div>

      </div>
    </template>

    <!-- ════════════════════════════════════════ -->
    <!-- TAB: GASTOS                             -->
    <!-- ════════════════════════════════════════ -->
    <template v-else-if="tabId === 'gastos'">

      <!-- 3 KPI cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="flex flex-col gap-2 rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold uppercase tracking-wider text-gray-500">Gasto Total Mensual</p>
            <span class="material-symbols-outlined text-[#6E420C]">payments</span>
          </div>
          <p class="text-3xl font-extrabold text-[#1a1a1a]">$12,450.00</p>
          <div class="flex items-center gap-1 text-green-600">
            <span class="material-symbols-outlined text-base">trending_down</span>
            <p class="text-sm font-bold">-4.2% vs mes anterior</p>
          </div>
        </div>
        <div class="flex flex-col gap-2 rounded-xl bg-[#f3eee7] border border-[#6E420C]/10 p-6">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold uppercase tracking-wider text-[#6E420C]/80">Categoría Mayor Gasto</p>
            <span class="material-symbols-outlined text-[#6E420C]">agriculture</span>
          </div>
          <p class="text-3xl font-extrabold text-[#6E420C]">Alimento</p>
          <p class="text-sm font-bold text-[#6E420C]/70">$5,600.00 (45%)</p>
        </div>
        <div class="flex flex-col gap-2 rounded-xl bg-[#e7f3e7] border border-[#4c9a4c]/10 p-6">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold uppercase tracking-wider text-[#4c9a4c]/80">Variación Presupuesto</p>
            <span class="material-symbols-outlined text-[#4c9a4c]">analytics</span>
          </div>
          <p class="text-3xl font-extrabold text-[#4c9a4c]">+2.5%</p>
          <p class="text-sm font-bold text-[#3d7a3d]">Dentro del margen esperado</p>
        </div>
      </div>

      <!-- 2 columnas: torta + transacciones -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <!-- Torta SVG Desglose -->
        <div class="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-[#1a1a1a]">Desglose por Categoría</h3>
            <button class="text-gray-400 hover:text-[#6E420C]"><span class="material-symbols-outlined">more_vert</span></button>
          </div>
          <div class="flex flex-col md:flex-row items-center gap-8 py-4">
            <div class="relative size-48 flex-shrink-0">
              <svg viewBox="0 0 200 200" class="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="transparent" stroke="#f3eee7" stroke-width="30"/>
                <circle cx="100" cy="100" r="80" fill="transparent" stroke="#6E420C"
                  stroke-dasharray="226 503" stroke-dashoffset="0" stroke-width="30" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="transparent" stroke="#4c9a4c"
                  stroke-dasharray="125 503" stroke-dashoffset="-226" stroke-width="30" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="transparent" stroke="#b45309"
                  stroke-dasharray="75 503" stroke-dashoffset="-351" stroke-width="30" transform="rotate(-90 100 100)"/>
                <circle cx="100" cy="100" r="80" fill="transparent" stroke="#9ca3af"
                  stroke-dasharray="77 503" stroke-dashoffset="-426" stroke-width="30" transform="rotate(-90 100 100)"/>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-xs text-gray-400 font-bold uppercase">Total</span>
                <span class="text-lg font-extrabold">$12.4k</span>
              </div>
            </div>
            <div class="flex-1 space-y-3 w-full">
              <div v-for="cat in categoriasGasto" :key="cat.label"
                class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div class="flex items-center gap-3">
                  <div class="h-3 w-3 rounded-full" :style="`background:${cat.color}`"></div>
                  <span class="text-sm font-medium text-gray-700">{{ cat.label }}</span>
                </div>
                <div class="text-right">
                  <span class="text-sm font-bold text-[#1a1a1a]">{{ cat.pct }}%</span>
                  <span class="text-xs text-gray-400 ml-2">${{ cat.valor }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transacciones recientes del backend -->
        <div class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 class="text-lg font-bold text-[#1a1a1a]">Transacciones Recientes</h3>
          <div class="space-y-3">
            <div v-for="g in store.gastos.slice(0,5)" :key="g.id"
              class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full bg-[#f3eee7] flex items-center justify-center">
                  <span class="material-symbols-outlined text-[#6E420C] text-sm">payments</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-[#1a1a1a]">{{ g.concepto || 'Gasto' }}</p>
                  <p class="text-[11px] text-gray-500">{{ g.fecha }}</p>
                </div>
              </div>
              <p class="text-sm font-extrabold text-red-600">-${{ g.monto }}</p>
            </div>
            <div v-if="store.gastos.length === 0" class="flex flex-col items-center justify-center py-8 text-center text-gray-400">
              <span class="material-symbols-outlined text-4xl mb-2">receipt_long</span>
              <p class="text-sm font-semibold">No hay gastos registrados aún.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Botón registrar gasto -->
      <button @click="modalGasto = true"
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4c9a4c] py-4 text-sm font-bold text-white shadow transition hover:bg-[#3d7a3d]">
        <span class="material-symbols-outlined">add_circle</span>
        Registrar Nuevo Gasto
      </button>

    </template>

    <!-- ════════════════════════════════════════ -->
    <!-- TAB: INGRESOS                           -->
    <!-- ════════════════════════════════════════ -->
    <template v-else-if="tabId === 'ingresos'">

      <!-- 3 KPI cards verticales -->
      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col gap-1 rounded-2xl bg-[#f0f9f0] border border-[#4c9a4c]/10 p-5">
          <div class="flex justify-between items-start">
            <p class="text-[#4c9a4c] font-bold text-sm">Ingreso Bruto Mensual</p>
            <span class="material-symbols-outlined text-[#4c9a4c]">account_balance_wallet</span>
          </div>
          <p class="text-3xl font-extrabold text-[#3d7a3d] mt-1">$12,450.00</p>
          <div class="flex items-center gap-1 text-[#3d7a3d] mt-2">
            <span class="material-symbols-outlined text-sm">trending_up</span>
            <p class="text-xs font-bold">+12% vs. mes anterior</p>
          </div>
        </div>
        <div class="flex flex-col gap-1 rounded-2xl bg-[#fdf8f3] border border-[#6E420C]/10 p-5">
          <div class="flex justify-between items-start">
            <p class="text-[#6E420C] font-bold text-sm">Venta de Ganado</p>
            <span class="material-symbols-outlined text-[#6E420C]">pest_control_rodent</span>
          </div>
          <p class="text-3xl font-extrabold text-[#6E420C] mt-1">$8,200.00</p>
          <p class="text-xs font-bold text-[#6E420C] mt-2">66% del ingreso total</p>
        </div>
        <div class="flex flex-col gap-1 rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
          <div class="flex justify-between items-start">
            <p class="text-gray-500 font-bold text-sm">Venta Leche/Prod.</p>
            <span class="material-symbols-outlined text-gray-400">water_drop</span>
          </div>
          <p class="text-3xl font-extrabold text-gray-900 mt-1">$4,250.00</p>
          <div class="flex items-center gap-1 text-gray-500 mt-2">
            <span class="material-symbols-outlined text-sm">info</span>
            <p class="text-xs font-bold">Producción estable</p>
          </div>
        </div>
      </div>

      <!-- Barras Venta Animales vs Otros -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col mb-6">
          <h3 class="text-lg font-extrabold text-gray-900">Venta Animales vs Otros</h3>
          <p class="text-xs text-gray-500 font-medium">Comparativa semestral (Miles USD)</p>
          <div class="flex gap-4 mt-3">
            <div class="flex items-center gap-1"><span class="size-2 rounded-full bg-[#6E420C]"></span><span class="text-[11px] text-gray-600 font-bold">Animales</span></div>
            <div class="flex items-center gap-1"><span class="size-2 rounded-full bg-[#4c9a4c]"></span><span class="text-[11px] text-gray-600 font-bold">Otros</span></div>
          </div>
        </div>
        <div class="flex items-end justify-between h-48 gap-3 pt-4">
          <div v-for="(m, i) in mesesIngresos" :key="i" class="flex flex-col items-center gap-2 flex-1">
            <div class="flex items-end gap-1 w-full h-full">
              <div class="bg-[#6E420C] w-full rounded-t-md" :style="`height:${m.ani}%`"></div>
              <div class="bg-[#4c9a4c] w-full rounded-t-md" :style="`height:${m.ot}%`"></div>
            </div>
            <span class="text-[10px] font-bold text-gray-400">{{ m.label }}</span>
          </div>
        </div>
      </div>

      <!-- Rendimiento financiero + donut -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Rendimiento Financiero</h3>
        <div class="flex items-center justify-between gap-6">
          <div class="relative size-28 flex-shrink-0">
            <svg class="size-full" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#f3f4f6" stroke-width="4"/>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="#4c9a4c" stroke-dasharray="78,100" stroke-linecap="round" stroke-width="4" transform="rotate(90 18 18)"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-extrabold text-gray-900">78%</span>
              <span class="text-[8px] text-gray-400 font-bold uppercase">Eficiencia</span>
            </div>
          </div>
          <div class="flex-1 ml-6 space-y-4">
            <div>
              <p class="text-xs text-gray-500 font-bold mb-1">Margen Operativo</p>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div class="bg-[#6E420C] h-full rounded-full" style="width:62%"></div>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-bold mb-1">Cumplimiento Meta</p>
              <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div class="bg-[#4c9a4c] h-full rounded-full" style="width:85%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ventas recientes (backend) -->
      <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-lg font-bold text-gray-900">Ventas Recientes</h3>
          <button class="text-[#4c9a4c] text-sm font-bold">Ver todo</button>
        </div>
        <div class="space-y-4">
          <div v-for="v in store.ventas.slice(0,5)" :key="v.id"
            class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-full bg-[#f3eee7] flex items-center justify-center">
                <span class="material-symbols-outlined text-[#6E420C] text-sm">shopping_cart</span>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">{{ v.concepto || 'Venta' }}</p>
                <p class="text-[11px] text-gray-500">{{ v.fecha }}</p>
              </div>
            </div>
            <p class="text-sm font-extrabold text-[#6E420C]">+${{ v.monto }}</p>
          </div>
          <!-- Placeholder si sin datos -->
          <template v-if="store.ventas.length === 0">
            <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full bg-[#f3eee7] flex items-center justify-center">
                  <span class="material-symbols-outlined text-[#6E420C] text-sm">shopping_cart</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">Lote 4 Vacas Jersey</p>
                  <p class="text-[11px] text-gray-500">12 Jun, 2024</p>
                </div>
              </div>
              <p class="text-sm font-extrabold text-[#6E420C]">+$3,200.00</p>
            </div>
            <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full bg-[#e7f3e7] flex items-center justify-center">
                  <span class="material-symbols-outlined text-[#4c9a4c] text-sm">water_drop</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-900">Venta Leche (Semanal)</p>
                  <p class="text-[11px] text-gray-500">10 Jun, 2024</p>
                </div>
              </div>
              <p class="text-sm font-extrabold text-[#3d7a3d]">+$850.00</p>
            </div>
          </template>
        </div>
      </div>

      <!-- Botones acción -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <button @click="modalVenta = true"
          class="flex items-center justify-center gap-2 bg-[#4c9a4c] text-white font-bold py-4 rounded-xl shadow-sm hover:bg-[#3d7a3d]">
          <span class="material-symbols-outlined">add_circle</span>
          <span class="text-sm">Nueva Venta</span>
        </button>
        <button @click="generarReportePDF"
          class="flex items-center justify-center gap-2 bg-[#6E420C] text-white font-bold py-4 rounded-xl shadow-sm hover:bg-[#5a360a]">
          <span class="material-symbols-outlined">description</span>
          <span class="text-sm">Reporte PDF</span>
        </button>
      </div>

    </template>

    <!-- ════════════════════════════════════════ -->
    <!-- TAB: NACIMIENTOS                        -->
    <!-- ════════════════════════════════════════ -->
    <template v-else-if="tabId === 'nacimientos'">

      <!-- 2 KPI cards coloreados -->
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1 rounded-2xl bg-[#4c9a4c] text-white p-5 shadow-lg">
          <p class="text-[10px] font-bold opacity-80 uppercase tracking-widest">Nacimientos Trimestre</p>
          <div class="flex items-end justify-between mt-1">
            <p class="text-4xl font-extrabold">{{ store.nacimientos.length || 42 }}</p>
            <span class="material-symbols-outlined opacity-30 text-3xl">counter_1</span>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <span class="material-symbols-outlined text-xs">trending_up</span>
            <p class="text-[10px] font-bold">+12% vs. T1</p>
          </div>
        </div>
        <div class="flex flex-col gap-1 rounded-2xl bg-[#6E420C] text-white p-5 shadow-lg">
          <p class="text-[10px] font-bold opacity-80 uppercase tracking-widest">Tasa Supervivencia</p>
          <div class="flex items-end justify-between mt-1">
            <p class="text-4xl font-extrabold">98%</p>
            <span class="material-symbols-outlined opacity-30 text-3xl">verified_user</span>
          </div>
          <p class="text-[10px] font-bold mt-2 opacity-80">Neonatal</p>
        </div>
      </div>

      <!-- Donut distribución sexo -->
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 class="text-sm font-extrabold text-gray-800 mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-[#4c9a4c] text-xl">wc</span>
          DISTRIBUCIÓN POR SEXO
        </h3>
        <div class="flex items-center justify-between gap-8">
          <div class="relative h-32 w-32 flex-shrink-0">
            <svg class="h-full w-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#f3eee7" stroke-width="4"/>
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#6E420C"
                stroke-dasharray="55 100" stroke-linecap="round" stroke-width="4" transform="rotate(-90 18 18)"/>
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#4c9a4c"
                stroke-dasharray="45 100" stroke-dashoffset="-55" stroke-linecap="round" stroke-width="4" transform="rotate(-90 18 18)"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase">Total</span>
              <span class="text-xl font-extrabold text-gray-800">{{ store.nacimientos.length || 42 }}</span>
            </div>
          </div>
          <div class="flex-1 space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-[#6E420C]"></div>
                <span class="text-sm font-bold text-gray-600">Macho</span>
              </div>
              <span class="text-sm font-extrabold text-[#6E420C]">{{ machos }} ({{ pctMachos }}%)</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-[#4c9a4c]"></div>
                <span class="text-sm font-bold text-gray-600">Hembra</span>
              </div>
              <span class="text-sm font-extrabold text-[#4c9a4c]">{{ hembras }} ({{ pctHembras }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estacionalidad anual SVG -->
      <div class="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-sm font-extrabold text-gray-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-[#6E420C] text-xl">stacked_line_chart</span>
            ESTACIONALIDAD ANUAL
          </h3>
          <span class="text-[9px] font-bold text-[#6E420C] bg-[#f3eee7] px-2.5 py-1 rounded-full uppercase">Histórico 2024</span>
        </div>
        <div class="h-44 w-full relative px-2">
          <svg class="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="#4c9a4c" stop-opacity="0.15"/>
                <stop offset="100%" stop-color="#4c9a4c" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0,100 L0,70 Q40,40 75,60 T150,30 T225,50 T300,10 L300,100 Z" fill="url(#chartGradient)"/>
            <path d="M0,70 Q40,40 75,60 T150,30 T225,50 T300,10" fill="none" stroke="#6E420C" stroke-linecap="round" stroke-width="3"/>
            <circle cx="75"  cy="60" fill="#6E420C" r="5" stroke="white" stroke-width="2"/>
            <circle cx="150" cy="30" fill="#6E420C" r="5" stroke="white" stroke-width="2"/>
            <circle cx="300" cy="10" fill="#6E420C" r="5" stroke="white" stroke-width="2"/>
          </svg>
        </div>
        <div class="flex justify-between mt-4 text-[10px] font-extrabold text-gray-400 px-1">
          <span>ENE</span><span>ABR</span><span>JUL</span><span>OCT</span><span>DIC</span>
        </div>
      </div>

      <!-- Próximos partos -->
      <div class="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
        <div class="bg-[#6E420C] px-6 py-4 flex justify-between items-center">
          <h3 class="text-sm font-extrabold text-white flex items-center gap-2">
            <span class="material-symbols-outlined">calendar_today</span>
            PRÓXIMOS PARTOS
          </h3>
          <button class="text-[10px] font-extrabold text-white bg-white/10 border border-white/30 rounded-full px-4 py-2 hover:bg-white/20 uppercase">Ver todos</button>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="p in proximosPartos" :key="p.nombre"
            class="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div class="w-12 h-12 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border"
              :class="p.bg">
              <span class="text-[9px] font-extrabold uppercase" :class="p.textColor">{{ p.mes }}</span>
              <span class="text-xl font-extrabold leading-none" :class="p.textColor">{{ p.dia }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-extrabold text-gray-800 truncate">{{ p.nombre }}</p>
              <p class="text-[11px] font-medium text-gray-500">Estado: {{ p.estado }}</p>
            </div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="grid grid-cols-2 gap-4 pt-2">
        <button @click="modalNacimiento = true"
          class="flex items-center justify-center gap-2 h-14 bg-[#4c9a4c] rounded-2xl text-white font-bold text-sm shadow-lg hover:bg-[#3d7a3d]">
          <span class="material-symbols-outlined text-xl">add_circle</span>
          Nuevo Registro
        </button>
        <button class="flex items-center justify-center gap-2 h-14 bg-[#6E420C] rounded-2xl text-white font-bold text-sm shadow-lg hover:bg-[#5a360a]">
          <span class="material-symbols-outlined text-xl">assignment</span>
          Reporte Trim.
        </button>
      </div>

    </template>

    <!-- ════════════════════════════════════════ -->
    <!-- TAB: PRODUCCIÓN                         -->
    <!-- ════════════════════════════════════════ -->
    <template v-else-if="tabId === 'produccion'">

      <!-- Filtros período -->
      <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button class="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#4c9a4c] text-white px-6 font-bold shadow-sm hover:bg-[#3d7a3d]">
          <span class="material-symbols-outlined text-base">calendar_today</span> Mes Actual
        </button>
        <button class="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#6E420C] text-white px-6 font-bold shadow-sm hover:bg-[#5a360a]">
          <span class="material-symbols-outlined text-base">date_range</span> Trimestre
        </button>
        <button class="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-white border border-gray-200 text-[#6E420C] px-6 font-bold hover:bg-[#f3eee7]">
          <span class="material-symbols-outlined text-base">bar_chart</span> Año
        </button>
      </div>

      <!-- 3 KPI cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-[#e7f3e7] rounded-xl text-[#4c9a4c]"><span class="material-symbols-outlined">water_drop</span></div>
            <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+4.2%</span>
          </div>
          <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">Producción Diaria</p>
          <p class="text-3xl font-extrabold text-[#1a1a1a] mt-1">1,240 <span class="text-lg font-medium text-gray-500">Lts</span></p>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-[#f3eee7] rounded-xl text-[#6E420C]"><span class="material-symbols-outlined">analytics</span></div>
            <span class="text-xs font-bold text-[#6E420C] bg-[#f3eee7] px-2 py-1 rounded-full">Estable</span>
          </div>
          <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">Promedio por Vaca</p>
          <p class="text-3xl font-extrabold text-[#1a1a1a] mt-1">18.5 <span class="text-lg font-medium text-gray-500">Lts</span></p>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-blue-50 rounded-xl text-blue-600"><span class="material-symbols-outlined">verified</span></div>
            <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Alta</span>
          </div>
          <p class="text-sm font-semibold uppercase tracking-wide text-gray-500">Calidad de Producción</p>
          <p class="text-3xl font-extrabold text-[#1a1a1a] mt-1">98.2 <span class="text-lg font-medium text-gray-500">%</span></p>
        </div>
      </div>

      <!-- 2 columnas: Top 5 vacas + Tendencia mensual -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <!-- Top 5 vacas barras progreso -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#6E420C]">Producción Top 5 Vacas</h3>
            <span class="text-xs font-bold text-[#4c9a4c] uppercase">Hoy</span>
          </div>
          <div class="space-y-5">
            <div v-for="v in topVacas" :key="v.nombre" class="space-y-2">
              <div class="flex justify-between text-sm font-bold">
                <span>{{ v.nombre }}</span>
                <span class="text-[#4c9a4c]">{{ v.litros }} L</span>
              </div>
              <div class="h-4 w-full bg-[#e7f3e7] rounded-full overflow-hidden">
                <div class="h-full bg-[#4c9a4c] rounded-full transition-all" :style="`width:${v.pct}%`"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tendencia mensual (barras thin estilo HTML) -->
        <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#6E420C]">Tendencia Mensual</h3>
            <div class="flex gap-2">
              <div class="flex items-center gap-1">
                <div class="w-3 h-3 rounded-full bg-[#6E420C]"></div>
                <span class="text-[10px] font-bold uppercase text-gray-500">Total Litros</span>
              </div>
            </div>
          </div>
          <div class="relative h-64 w-full flex items-end justify-between px-2 pt-10">
            <div class="absolute inset-0 flex flex-col justify-between py-10 pointer-events-none">
              <div class="border-t border-dashed border-gray-200 w-full"></div>
              <div class="border-t border-dashed border-gray-200 w-full"></div>
              <div class="border-t border-dashed border-gray-200 w-full"></div>
            </div>
            <div v-for="(m, i) in tendenciaMensual" :key="i" class="flex flex-col items-center gap-2 z-10">
              <div class="w-2 h-20 bg-[#6E420C]/20 rounded-t-full relative">
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#6E420C]">{{ m.label2 }}</div>
                <div class="absolute bottom-0 w-2 rounded-t-full"
                  :class="i === tendenciaMensual.length-1 ? 'bg-[#6E420C] ring-2 ring-primary ring-offset-2' : 'bg-[#6E420C]'"
                  :style="`height:${m.h}px`"></div>
              </div>
              <span class="text-[10px] font-bold" :class="i === tendenciaMensual.length-1 ? 'text-[#4c9a4c]' : 'text-gray-500'">{{ m.label }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Tabla Desglose de Calidad (fiel al HTML) -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-bold text-[#6E420C]">Desglose de Calidad</h3>
          <button class="text-[#4c9a4c] text-sm font-bold flex items-center gap-1">
            Ver histórico <span class="material-symbols-outlined text-sm">open_in_new</span>
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#e7f3e7]/30">
                <th class="px-6 py-4 text-xs font-bold text-[#6E420C] uppercase tracking-wider">Parámetro</th>
                <th class="px-6 py-4 text-xs font-bold text-[#6E420C] uppercase tracking-wider">Valor Actual</th>
                <th class="px-6 py-4 text-xs font-bold text-[#6E420C] uppercase tracking-wider">Estado</th>
                <th class="px-6 py-4 text-xs font-bold text-[#6E420C] uppercase tracking-wider">Variación</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr>
                <td class="px-6 py-4 font-bold text-sm">Grasa</td>
                <td class="px-6 py-4 text-sm">4.2%</td>
                <td class="px-6 py-4"><span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Óptimo</span></td>
                <td class="px-6 py-4 text-green-600 font-bold text-sm">+0.1%</td>
              </tr>
              <tr>
                <td class="px-6 py-4 font-bold text-sm">Proteína</td>
                <td class="px-6 py-4 text-sm">3.4%</td>
                <td class="px-6 py-4"><span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Óptimo</span></td>
                <td class="px-6 py-4 text-[#6E420C] font-bold text-sm">0.0%</td>
              </tr>
              <tr>
                <td class="px-6 py-4 font-bold text-sm">Células Somáticas</td>
                <td class="px-6 py-4 text-sm">180k/ml</td>
                <td class="px-6 py-4"><span class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">Atención</span></td>
                <td class="px-6 py-4 text-red-500 font-bold text-sm">+15k</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </template>

    <!-- ══════════════════════════════════════════════════ -->
    <!-- MODALES                                            -->
    <!-- ══════════════════════════════════════════════════ -->

    <!-- Modal: Nueva Venta (fiel a registro-venta.html) -->
    <Teleport to="body">
      <div v-if="modalVenta" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="modalVenta = false">
        <div class="w-full max-w-xl rounded-2xl bg-white shadow-xl overflow-hidden">
          <div class="bg-[#6E420C]/5 px-8 py-6 border-b border-gray-200">
            <h3 class="text-2xl font-extrabold text-[#6E420C]">Nueva Venta</h3>
            <p class="text-sm text-gray-500">Complete los datos de la transacción individual</p>
          </div>
          <div class="p-6 md:p-8">
            <form @submit.prevent="guardarVenta" class="space-y-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-bold text-[#6E420C]">ID Cliente</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c9a4c] opacity-60">person</span>
                  <input v-model="formVenta.id_cliente" placeholder="Ingrese ID del cliente" required
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"/>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-bold text-[#6E420C]">Fecha</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c9a4c] opacity-60">calendar_month</span>
                  <input v-model="formVenta.fecha" type="date" required
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"/>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-bold text-[#6E420C]">Concepto</label>
                <textarea v-model="formVenta.concepto" rows="3" placeholder="Descripción de la venta..."
                  class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"></textarea>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-bold text-[#6E420C]">NCF (Número de Comprobante Fiscal)</label>
                <div class="relative">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4c9a4c] opacity-60">description</span>
                  <input v-model="formVenta.ncf" placeholder="Ej: B0100000001"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"/>
                </div>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="button" @click="modalVenta = false"
                  class="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button type="submit" :disabled="store.cargando"
                  class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#6E420C] py-3 text-sm font-bold text-white shadow-lg hover:bg-[#5a360a] disabled:opacity-60">
                  <span class="material-symbols-outlined text-base">save</span>
                  {{ store.cargando ? 'Guardando...' : 'Guardar Venta' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Nuevo Nacimiento -->
    <Teleport to="body">
      <div v-if="modalNacimiento" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="modalNacimiento = false">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-5 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-[#1a1a1a]">Nuevo Nacimiento</h3>
              <p class="text-sm text-gray-500">Registro de parto</p>
            </div>
            <button @click="modalNacimiento = false" class="text-2xl leading-none text-gray-400">&times;</button>
          </div>
          <form @submit.prevent="guardarNacimiento" class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-bold text-[#6E420C]">ID Bovino (madre) *</label>
              <input v-model="formNac.Id_bovino" type="number" required placeholder="ID de la madre"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"/>
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold text-[#6E420C]">Fecha *</label>
              <input v-model="formNac.fecha" type="date" required
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"/>
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold text-[#6E420C]">Sexo *</label>
              <select v-model="formNac.sexo" required
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]">
                <option value="">Seleccionar...</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold text-[#6E420C]">Observaciones</label>
              <textarea v-model="formNac.observaciones" rows="2" placeholder="Notas del parto..."
                class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"></textarea>
            </div>
            <div class="flex gap-3 pt-1">
              <button type="button" @click="modalNacimiento = false"
                class="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button type="submit" :disabled="store.cargando"
                class="flex-1 rounded-xl bg-[#4c9a4c] py-3 text-sm font-bold text-white hover:bg-[#3d7a3d] disabled:opacity-60">
                {{ store.cargando ? 'Guardando...' : 'Registrar Nacimiento' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Nuevo Gasto -->
    <Teleport to="body">
      <div v-if="modalGasto" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="modalGasto = false">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-5 flex items-center justify-between">
            <h3 class="text-xl font-bold text-[#1a1a1a]">Nuevo Gasto</h3>
            <button @click="modalGasto = false" class="text-2xl leading-none text-gray-400">&times;</button>
          </div>
          <form @submit.prevent="guardarGasto" class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-bold text-[#6E420C]">Categoría *</label>
              <select v-model="formGasto.categoria" required
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]">
                <option value="">Seleccionar...</option>
                <option value="Alimento">Alimento</option>
                <option value="Veterinario">Veterinario</option>
                <option value="Infraestructura">Infraestructura</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold text-[#6E420C]">Fecha *</label>
              <input v-model="formGasto.fecha" type="date" required
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"/>
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold text-[#6E420C]">Descripción</label>
              <input v-model="formGasto.concepto" placeholder="Descripción del gasto"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"/>
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold text-[#6E420C]">Monto ($) *</label>
              <input v-model="formGasto.monto" type="number" step="0.01" required placeholder="0.00"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-[#4c9a4c] focus:outline-none focus:ring-1 focus:ring-[#4c9a4c]"/>
            </div>
            <div class="flex gap-3 pt-1">
              <button type="button" @click="modalGasto = false"
                class="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button type="submit" :disabled="store.cargando"
                class="flex-1 rounded-xl bg-[#6E420C] py-3 text-sm font-bold text-white hover:bg-[#5a360a] disabled:opacity-60">
                {{ store.cargando ? 'Guardando...' : 'Registrar Gasto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useProduccionStore } from '../store/produccion.store.js'
import { produccionService } from '../services/produccion.service.js'

const store = useProduccionStore()

onMounted(async () => {
  await store.cargarNacimientos()
  await store.cargarVentas()
  await store.cargarGastos()
})

// ── Tabs ──────────────────────────────────────────────
const tabId = ref('resumen')
const tabs = [
  { id: 'resumen',     label: 'Reproducción', titulo: 'Resumen General',          subtitulo: 'Indicadores de reproducción y crianza' },
  { id: 'gastos',      label: 'Gastos',       titulo: 'Dashboard de Gastos',       subtitulo: 'Control y análisis de egresos' },
  { id: 'ingresos',    label: 'Ingresos',     titulo: 'Dashboard de Ingresos',     subtitulo: 'Ventas y fuentes de ingreso' },
  { id: 'nacimientos', label: 'Nacimientos',  titulo: 'Dashboard de Nacimientos',  subtitulo: 'Registro y estadísticas de partos' },
  { id: 'produccion',  label: 'Producción',   titulo: 'Producción',                subtitulo: 'Leche y otros productos de la finca' },
]
const tabActivo = computed(() => tabs.find(t => t.id === tabId.value))

// ── Nacimientos: cálculo sexo ─────────────────────────
const machos     = computed(() => store.nacimientos.filter(n => n.sexo === 'Macho').length  || 23)
const hembras    = computed(() => store.nacimientos.filter(n => n.sexo === 'Hembra').length || 19)
const totalNac   = computed(() => machos.value + hembras.value || 42)
const pctMachos  = computed(() => Math.round((machos.value / totalNac.value) * 100))
const pctHembras = computed(() => 100 - pctMachos.value)

// ── Datos estáticos de gráficas (idénticos a los HTMLs) ─
const mesesResumen = [
  {label:'Ene',nac:40,baj:10},{label:'Feb',nac:60,baj:5},
  {label:'Mar',nac:85,baj:15},{label:'Abr',nac:70,baj:10},
  {label:'May',nac:75,baj:12},{label:'Jun',nac:90,baj:8}
]
const mesesIngresos = [
  {label:'ENE',ani:60,ot:30},{label:'FEB',ani:45,ot:40},
  {label:'MAR',ani:85,ot:25},{label:'ABR',ani:70,ot:35},
  {label:'MAY',ani:55,ot:65},{label:'JUN',ani:90,ot:20}
]
const categoriasGasto = [
  {label:'Alimento',        pct:45, valor:'5,600', color:'#6E420C'},
  {label:'Veterinario',     pct:25, valor:'3,112', color:'#4c9a4c'},
  {label:'Infraestructura', pct:15, valor:'1,867', color:'#b45309'},
  {label:'Otros',           pct:15, valor:'1,871', color:'#9ca3af'},
]
const topVacas = [
  {nombre:'Vaca #452 (Bessie)', litros:32.4, pct:95},
  {nombre:'Vaca #210 (Daisy)',  litros:29.8, pct:88},
  {nombre:'Vaca #118 (Luna)',   litros:28.5, pct:84},
  {nombre:'Vaca #095 (Marta)',  litros:26.1, pct:77},
  {nombre:'Vaca #334 (Perla)',  litros:24.9, pct:73},
]
const tendenciaMensual = [
  {label:'Ene',label2:'32k',h:56},{label:'Feb',label2:'34k',h:64},
  {label:'Mar',label2:'38k',h:80},{label:'Abr',label2:'31k',h:48},
  {label:'May',label2:'36k',h:72},{label:'Jun',label2:'40k',h:80},
]
const proximosPartos = [
  {nombre:'Vaca "Mariposa"', mes:'Mayo', dia:12, estado:'Seguimiento especial', bg:'bg-[#e7f3e7] border-[#4c9a4c]/10', textColor:'text-[#4c9a4c]'},
  {nombre:'Vaca "Estrella"', mes:'Mayo', dia:15, estado:'Normal',               bg:'bg-[#f3eee7] border-[#6E420C]/10', textColor:'text-[#6E420C]'},
]

// ── Modales ────────────────────────────────────────────
const modalVenta      = ref(false)
const modalNacimiento = ref(false)
const modalGasto      = ref(false)

const formVenta = reactive({ id_cliente:'', fecha:'', concepto:'', ncf:'' })
const formNac   = reactive({ Id_bovino:'', fecha:'', sexo:'', observaciones:'' })
const formGasto = reactive({ categoria:'', fecha:'', concepto:'', monto:'' })

async function guardarVenta() {
  const ok = await store.crearVenta({ ...formVenta })
  if (ok) { modalVenta.value = false; Object.assign(formVenta, {id_cliente:'',fecha:'',concepto:'',ncf:''}) }
}
async function guardarNacimiento() {
  const ok = await store.crearNacimiento({ ...formNac })
  if (ok) { modalNacimiento.value = false; Object.assign(formNac, {Id_bovino:'',fecha:'',sexo:'',observaciones:''}) }
}
async function guardarGasto() {
  const ok = await store.crearGasto({ ...formGasto })
  if (ok) { modalGasto.value = false; Object.assign(formGasto, {categoria:'',fecha:'',concepto:'',monto:''}) }
}

// ── Reporte PDF (igual que ingresos.html) ──────────────
async function generarReportePDF() {
  try {
    const response = await produccionService.reporteIngresos()
    const blob = response.data
    const url  = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'reporte_ingresos.pdf'
    document.body.appendChild(a); a.click()
    a.remove(); window.URL.revokeObjectURL(url)
  } catch {
    alert('No se pudo generar el reporte PDF')
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>