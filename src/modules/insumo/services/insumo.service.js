import api from '@/core/api/axios.js'

const BASE = '/insumo'

const insumoService = {
  listar() {
    return api.get(`${BASE}/listar`).then(res => res.data)
  },

  crear(datos) {
    return api.post(`${BASE}/crear`, datos).then(res => res.data)
  },

  actualizar(id, datos) {
    return api.put(`${BASE}/update/${id}`, datos).then(res => res.data)
  },

  eliminar(id) {
    return api.delete(`${BASE}/eliminar/${id}`).then(res => res.data)
  }
}

export default insumoService