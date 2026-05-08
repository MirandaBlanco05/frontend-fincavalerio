// src/modules/visita/services/visita.service.js
import api from '@/core/api/axios.js'

const BASE = '/visita'

export const visitaService = {
  listar()             { return api.get(`${BASE}/listar`) },
  crear(datos)         { return api.post(`${BASE}/crear`, datos) },
  eliminar(id)         { return api.delete(`${BASE}/eliminar/${id}`) },
  listarVeterinarios() { 
    return api.get('/veterinario/listar')
  },
  listarBovinos()      { return api.get('/bovino/listar') },
  listarMotivos()      { 
    // Fallback motives since backend doesn't have an endpoint
    return Promise.resolve({
      data: [
        { Id_motivo: 1, motivo: 'Chequeo general' },
        { Id_motivo: 2, motivo: 'Vacunación' },
        { Id_motivo: 3, motivo: 'Inseminación' },
        { Id_motivo: 4, motivo: 'Embarazo' },
        { Id_motivo: 5, motivo: 'Enfermedad' }
      ]
    })
  }
}