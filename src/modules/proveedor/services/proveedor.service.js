const API_URL = 'http://localhost:3000/api/proveedor'

const proveedorService = {
  async listar() {
    const res = await fetch(`${API_URL}/listar`)
    if (!res.ok) throw new Error('Error al listar proveedores')
    return await res.json()
  },

  async obtener(id) {
    const res = await fetch(`${API_URL}/${id}`)
    if (!res.ok) throw new Error('Error al obtener proveedor')
    return await res.json()
  },

  async crear(datos) {
    const res = await fetch(`${API_URL}/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al crear proveedor')
    return await res.json()
  },

  async actualizar(id, datos) {
    const res = await fetch(`${API_URL}/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
    if (!res.ok) throw new Error('Error al actualizar proveedor')
    return await res.json()
  },

  async eliminar(id) {
    const res = await fetch(`${API_URL}/eliminar/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Error al eliminar proveedor')
    return await res.json()
  }
}

export default proveedorService