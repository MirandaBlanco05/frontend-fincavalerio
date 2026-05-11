const API_URL = 'http://localhost:3000/api/producto'

const productoService = {
  async listar() {
    const res = await fetch(`${API_URL}/listar`)
    if (!res.ok) throw new Error('Error al listar productos')
    return await res.json()
  },

  async crear(datos) {
    const res = await fetch(`${API_URL}/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al crear producto')
    return await res.json()
  },

  async actualizar(id, datos) {
    const res = await fetch(`${API_URL}/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al actualizar producto')
    return await res.json()
  },

  async eliminar(id) {
    const res = await fetch(`${API_URL}/eliminar/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Error al eliminar producto')
    return await res.json()
  }
}

export default productoService