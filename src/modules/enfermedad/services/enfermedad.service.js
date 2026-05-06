import api from '@/core/api/axios.js'

export default {
  listar() {
    return api.get('/enfermedad/listar')
  }
}