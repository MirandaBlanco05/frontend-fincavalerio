import api from '@/core/api/axios.js'

export const metodoPagoService = {
  listar() {
    return api.get('/metodopago').then(res => res.data)
  }
}
