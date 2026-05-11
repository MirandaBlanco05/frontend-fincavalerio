const API_URL = 'http://localhost:3000/api/cliente'

const clienteService = {
  async listar() {
    const res = await fetch(`${API_URL}/listar`)
    if (!res.ok) throw new Error('Error al listar clientes')
    return await res.json()
  },

  async obtener(id) {
    const res = await fetch(`${API_URL}/${id}`)
    if (!res.ok) throw new Error('Error al obtener cliente')
    return await res.json()
  },

  async crear(datos) {
    const res = await fetch(`${API_URL}/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al crear cliente')
    return await res.json()
  },

  async actualizar(id, datos) {
    const res = await fetch(`${API_URL}/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al actualizar cliente')
    return await res.json()
  },

  async eliminar(id) {
    const res = await fetch(`${API_URL}/eliminar/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Error al eliminar cliente')
    return await res.json()
  }
}

export default clienteService