<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none sm:max-w-md w-full px-6 sm:px-0">
      <TransitionGroup name="toast">
        <div
          v-for="n in store.notifications"
          :key="n.id"
          class="pointer-events-auto relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]"
          :class="containerClasses(n.type)"
        >
          <!-- Progress Bar -->
          <div 
            class="absolute bottom-0 left-0 h-1 transition-all duration-[duration] ease-linear"
            :class="progressClasses(n.type)"
            :style="{ width: '100%', animation: `progress ${n.duration}ms linear forwards` }"
          ></div>

          <div class="flex items-start gap-3">
            <div class="flex size-10 shrink-0 items-center justify-center rounded-xl" :class="iconContainerClasses(n.type)">
              <span class="material-symbols-outlined text-2xl">{{ getIcon(n.type) }}</span>
            </div>
            
            <div class="flex-1 pt-1">
              <h4 class="text-sm font-extrabold text-gray-900 leading-tight">{{ getTitle(n.type) }}</h4>
              <p class="mt-1 text-xs font-medium text-gray-600 leading-relaxed">{{ n.message }}</p>
            </div>

            <button 
              @click="store.remove(n.id)"
              class="ml-2 flex size-6 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useNotificationStore } from '@/store/notification.store.js'

const store = useNotificationStore()

function getIcon(type) {
  switch (type) {
    case 'success': return 'check_circle'
    case 'error':   return 'error'
    case 'warning': return 'warning'
    case 'info':    return 'info'
    default:        return 'notifications'
  }
}

function getTitle(type) {
  switch (type) {
    case 'success': return 'Éxito'
    case 'error':   return 'Error'
    case 'warning': return 'Atención'
    case 'info':    return 'Información'
    default:        return 'Notificación'
  }
}

function containerClasses(type) {
  switch (type) {
    case 'success': return 'ring-1 ring-green-500/20 shadow-green-500/10'
    case 'error':   return 'ring-1 ring-red-500/20 shadow-red-500/10'
    case 'warning': return 'ring-1 ring-amber-500/20 shadow-amber-500/10'
    case 'info':    return 'ring-1 ring-blue-500/20 shadow-blue-500/10'
    default:        return ''
  }
}

function iconContainerClasses(type) {
  switch (type) {
    case 'success': return 'bg-green-100 text-green-600'
    case 'error':   return 'bg-red-100 text-red-600'
    case 'warning': return 'bg-amber-100 text-amber-600'
    case 'info':    return 'bg-blue-100 text-blue-600'
    default:        return 'bg-gray-100 text-gray-600'
  }
}

function progressClasses(type) {
  switch (type) {
    case 'success': return 'bg-green-500'
    case 'error':   return 'bg-red-500'
    case 'warning': return 'bg-amber-500'
    case 'info':    return 'bg-blue-500'
    default:        return 'bg-gray-500'
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
  transform: translateX(100px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
