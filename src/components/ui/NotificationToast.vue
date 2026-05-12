<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup name="toast">
        <div 
          v-for="n in store.notifications" 
          :key="n.id"
          class="pointer-events-auto relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-4 shadow-2xl backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-95 sm:min-w-[320px] max-w-md"
          :class="getTypeStyles(n.type)"
        >
          <div class="flex items-start gap-3">
            <div 
              class="flex size-10 shrink-0 items-center justify-center rounded-xl shadow-inner"
              :class="getIconContainerStyles(n.type)"
            >
              <span class="material-symbols-outlined text-2xl">{{ getIcon(n.type) }}</span>
            </div>
            
            <div class="flex-1 pt-0.5">
              <h4 class="text-sm font-black uppercase tracking-wider opacity-60">{{ getTypeLabel(n.type) }}</h4>
              <p class="mt-0.5 text-sm font-bold text-gray-900 leading-snug">{{ n.message }}</p>
            </div>

            <button 
              @click="store.remove(n.id)"
              class="group flex size-8 items-center justify-center rounded-full transition-all hover:bg-black/5 active:bg-black/10"
            >
              <span class="material-symbols-outlined text-gray-400 transition-colors group-hover:text-gray-600">close</span>
            </button>
          </div>

          <!-- Progress bar -->
          <div v-if="n.duration > 0" class="absolute bottom-0 left-0 h-1 w-full bg-black/5">
            <div 
              class="h-full bg-current opacity-40 transition-all duration-[4000ms] ease-linear"
              :style="{ width: '0%', animation: `progress ${n.duration}ms linear forwards` }"
            ></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useNotificationStore } from '@/store/notification.store.js'

const store = useNotificationStore()

const getTypeStyles = (type) => {
  switch (type) {
    case 'success': return 'text-emerald-600'
    case 'error': return 'text-rose-600'
    case 'warning': return 'text-amber-600'
    case 'info': return 'text-sky-600'
    default: return 'text-gray-600'
  }
}

const getIconContainerStyles = (type) => {
  switch (type) {
    case 'success': return 'bg-emerald-50 text-emerald-600'
    case 'error': return 'bg-rose-50 text-rose-600'
    case 'warning': return 'bg-amber-50 text-amber-600'
    case 'info': return 'bg-sky-50 text-sky-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}

const getIcon = (type) => {
  switch (type) {
    case 'success': return 'check_circle'
    case 'error': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'notifications'
  }
}

const getTypeLabel = (type) => {
  switch (type) {
    case 'success': return 'Éxito'
    case 'error': return 'Error'
    case 'warning': return 'Atención'
    case 'info': return 'Información'
    default: return 'Aviso'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
