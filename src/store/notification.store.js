import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])

  /**
   * Add a new notification to the queue
   * @param {string} message - The message to display
   * @param {'success'|'error'|'warning'|'info'} type - The type of notification
   * @param {number} duration - Time in ms before auto-dismissal
   */
  function notify(message, type = 'success', duration = 5000) {
    const id = Date.now() + Math.random()
    notifications.value.push({
      id,
      message,
      type,
      duration
    })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    notify,
    remove
  }
})
