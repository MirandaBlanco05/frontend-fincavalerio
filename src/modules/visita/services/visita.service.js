// src/modules/visita/services/visita.service.js
import api from '@/core/api/axios.js'

const BASE = '/visita'

export const visitaService = {
  listar()             { return api.get(`${BASE}/listar`) },
  crear(datos)         { return api.post(`${BASE}/crear`, datos) },
  eliminar(id)         { return api.delete(`${BASE}/eliminar/${id}`) },
  listarVeterinarios() { 
    return api.get('/veterinario/listar').then(res => {
      if (res.data && Array.isArray(res.data)) {
        res.data = res.data.map(v => ({
          ...v,
          Id_veterinario: v.id_veterinario // Aseguramos compatibilidad con nombres de campos
        }))
      }
      return res
    })
  },
  listarBovinos()      { return api.get('/bovino/listar') },
  listarMotivos() { 
    return api.get(`${BASE}/catalogos/motivos`).then(res => {
      if (res.data && Array.isArray(res.data)) {
        res.data = res.data.map(m => ({
          ...m,
          Id_motivo: m.id_motivo // Aseguramos compatibilidad
        }))
      }
      return res
    })
  }
}