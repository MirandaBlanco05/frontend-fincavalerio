<template>
  <div class="factura-print" ref="facturaRef" style="display: none;">
    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        <img 
          src="/logo.png" 
          alt="Finca Valerio" 
          class="logo-img"
          @error="(e) => e.target.style.display = 'none'"
        />
      </div>
      <div class="title-section">
        <h1>FACTURA<br>VENTA</h1>
      </div>
    </div>

    <!-- Info Section -->
    <div class="info-section">
      <p><strong>Factura nº:</strong> {{ factura.numero_factura }}</p>
      <p><strong>Fecha:</strong> {{ formatearFecha(factura.fecha) }}</p>
      <p><strong>Cliente:</strong> {{ factura.cliente_nombre }}</p>
      <p v-if="factura.cliente_rnc"><strong>RNC:</strong> {{ factura.cliente_rnc }}</p>
    </div>

    <!-- Tabla Productos -->
    <table class="productos-table">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in factura.productos" :key="idx">
          <td>{{ item.descripcion }}</td>
          <td>{{ item.cantidad }}</td>
          <td>{{ formatearMoneda(item.precio) }}</td>
          <td>{{ formatearMoneda(item.total) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totales -->
    <div class="totales-section">
      <div class="totales-grid">
        <span>Subtotal</span>
        <span>{{ formatearMoneda(factura.subtotal) }}</span>
      </div>
      <div class="totales-grid">
        <span>Impuestos</span>
        <span>{{ formatearMoneda(factura.impuestos) }}</span>
      </div>
      <div class="totales-grid total-final">
        <span><strong>TOTAL</strong></span>
        <span><strong>{{ formatearMoneda(factura.total) }}</strong></span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-col">
        <h3>Contacto:</h3>
        <p>(55) 1234 - 5678</p>
        <p>@Fincavalerio.com</p>
        <p>www.fincavalerio.com</p>
      </div>
      <div class="footer-col">
        <h3>Información de pago:</h3>
        <p><strong>Nombre del banco:</strong> {{ factura.banco || 'Banreservas' }}</p>
        <p><strong>Número de cuenta:</strong> {{ factura.cuenta || '0123 4567 8901' }}</p>
        <p><strong>Alias de cuenta:</strong> {{ factura.alias || 'Finca Valerio' }}</p>
        <p><strong>Fecha de pago:</strong> {{ formatearFecha(factura.fecha) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineExpose } from 'vue'

const props = defineProps({
  factura: {
    type: Object,
    required: true,
    default: () => ({
      numero_factura: '',
      fecha: '',
      cliente_nombre: '',
      cliente_rnc: '',
      productos: [],
      subtotal: 0,
      impuestos: 0,
      total: 0,
      banco: '',
      cuenta: '',
      alias: ''
    })
  }
})

const facturaRef = ref(null)

function formatearFecha(fecha) {
  if (!fecha) return ''
  const date = new Date(fecha)
  return `${date.getDate()} de ${date.toLocaleDateString('es-DO', { month: 'long' })} de ${date.getFullYear()}`
}

function formatearMoneda(valor) {
  return `${(valor || 0).toLocaleString('es-DO')}$`
}

function imprimir() {
  if (!facturaRef.value) return
  
  // Mostrar el componente temporalmente
  facturaRef.value.style.display = 'block'
  
  // Crear iframe oculto para imprimir
  const iframe = document.createElement('iframe')
  iframe.style.position = 'absolute'
  iframe.style.width = '0px'
  iframe.style.height = '0px'
  iframe.style.border = 'none'
  document.body.appendChild(iframe)
  
  const iframeDoc = iframe.contentWindow.document
  
  // Copiar estilos y contenido
  iframeDoc.open()
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura ${props.factura.numero_factura}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          @page { margin: 20mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'DM Sans', sans-serif; color: #1a1a1a; line-height: 1.6; }
          ${getStyles()}
        </style>
      </head>
      <body>
        ${facturaRef.value.innerHTML}
      </body>
    </html>
  `)
  iframeDoc.close()
  
  // Esperar a que carguen las fuentes e imprimir
  setTimeout(() => {
    iframe.contentWindow.print()
    setTimeout(() => {
      document.body.removeChild(iframe)
      facturaRef.value.style.display = 'none'
    }, 100)
  }, 500)
}

function getStyles() {
  return `
    .factura-print {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: white;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
    }
    .logo-img {
      max-width: 150px;
      max-height: 80px;
      object-fit: contain;
    }
    .title-section h1 {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin: 0;
      text-align: right;
    }
    .info-section {
      margin-bottom: 30px;
    }
    .info-section p {
      margin: 8px 0;
      font-size: 1rem;
    }
    .productos-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .productos-table thead {
      background: #1a1a1a;
      color: white;
    }
    .productos-table th {
      padding: 12px;
      text-align: left;
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
    }
    .productos-table td {
      padding: 12px;
      font-size: 0.95rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .productos-table tbody tr:last-child td {
      border-bottom: 2px solid #1a1a1a;
    }
    .totales-section {
      margin-left: auto;
      max-width: 350px;
      margin-bottom: 40px;
    }
    .totales-grid {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 20px;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 1rem;
    }
    .totales-grid.total-final {
      border-top: 2px solid #1a1a1a;
      border-bottom: 2px solid #1a1a1a;
      padding: 15px 0;
      font-size: 1.2rem;
      margin-top: 10px;
    }
    .footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      padding-top: 30px;
      border-top: 2px solid #f0f0f0;
    }
    .footer-col h3 {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .footer-col p {
      margin: 6px 0;
      font-size: 0.9rem;
    }
  `
}

defineExpose({ imprimir })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.factura-print {
  font-family: 'DM Sans', sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background: white;
  color: #1a1a1a;
  line-height: 1.6;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.logo-img {
  max-width: 150px;
  max-height: 80px;
  object-fit: contain;
}

.title-section h1 {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0;
  text-align: right;
}

.info-section {
  margin-bottom: 30px;
}

.info-section p {
  margin: 8px 0;
  font-size: 1rem;
}

.info-section strong {
  font-weight: 700;
}

.productos-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.productos-table thead {
  background: #1a1a1a;
  color: white;
}

.productos-table th {
  padding: 12px;
  text-align: left;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.productos-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

.productos-table td {
  padding: 12px;
  font-size: 0.95rem;
}

.productos-table tbody tr:last-child {
  border-bottom: 2px solid #1a1a1a;
}

.totales-section {
  margin-left: auto;
  max-width: 350px;
  margin-bottom: 40px;
}

.totales-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1rem;
}

.totales-grid.total-final {
  border-top: 2px solid #1a1a1a;
  border-bottom: 2px solid #1a1a1a;
  padding: 15px 0;
  font-size: 1.2rem;
  margin-top: 10px;
}

.footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding-top: 30px;
  border-top: 2px solid #f0f0f0;
}

.footer-col h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.footer-col p {
  margin: 6px 0;
  font-size: 0.9rem;
}
</style>