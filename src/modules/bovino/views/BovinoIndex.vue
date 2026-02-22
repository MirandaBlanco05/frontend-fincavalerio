<template>
  <!-- Esta vista es el contenedor del módulo bovino.
       Las sub-rutas (lista y formulario) se renderizan aquí. -->
  <RouterView />
</template>

<script setup>
// El módulo bovino usa sub-rutas definidas en el router.
// BovinoList  → /bovinos
// BovinoForm  → /bovinos/nuevo  y  /bovinos/editar/:id
</script>