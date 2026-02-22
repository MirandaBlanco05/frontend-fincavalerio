// src/modules/bovino/services/bovino.service.js
import api from '@/core/api/axios.js'

const BASE = '/bovino'

export const bovinoService = {
  listar()              { return api.get(`${BASE}/listar`) },
  crear(datos)          { return api.post(`${BASE}/crear`, datos) },
  actualizar(id, datos) { return api.put(`${BASE}/actualizar/${id}`, datos) },
  eliminar(id)          { return api.delete(`${BASE}/eliminar/${id}`) }
}