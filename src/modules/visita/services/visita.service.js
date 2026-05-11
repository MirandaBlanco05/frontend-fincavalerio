// src/modules/visita/services/visita.service.js
import api from '@/core/api/axios.js'

const BASE = '/visita'

export const visitaService = {
  listar()             { return api.get(`${BASE}/listar`) },
  crear(datos)         { return api.post(`${BASE}/crear`, datos) },
  eliminar(id)         { return api.delete(`${BASE}/eliminar/${id}`) },
  listarVeterinarios() { return api.get('/visita/veterinarios') },
  listarBovinos()      { return api.get('/bovino/listar') },
  listarMotivos()      { return api.get('/visita/motivos') }
}