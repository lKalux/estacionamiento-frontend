<template>
  <div class="contenedor mt-4">
    <div class="tarjeta-presentacion sombra-suave">
      <h2 class="titulo-presentacion">Bienvenido(a)</h2>
      <p class="texto-presentacion">
        Este es el proyecto <strong>"Control Estacionamiento"</strong>, desarrollado de acuerdo con las especificaciones indicadas.  
        Quiero expresar mis disculpas por no implementar validaciones avanzadas en esta versión, ya que actualmente continúo con mis labores en la empresa y el tiempo ha sido limitado.  
      </p>
      <p class="texto-presentacion">
        Agradezco sinceramente la oportunidad de presentar esta propuesta y quedo atento a cualquier sugerencia o mejora que consideren necesaria.
      </p>
      <p class="firma-presentacion">— Eduardo Palomino</p>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.tarjeta-presentacion {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  color: #2c3e50;
  line-height: 1.6;
}

.titulo-presentacion {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #2c3e50;
}

.texto-presentacion {
  font-size: 1rem;
  margin-bottom: 12px;
}

.firma-presentacion {
  font-size: 1rem;
  font-style: italic;
  color: #555;
  margin-top: 10px;
  text-align: right;
}

.sombra-suave {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* Responsive */
@media (max-width: 768px) {
  .tarjeta-presentacion {
    padding: 20px;
  }
  .titulo-presentacion {
    font-size: 1.5rem;
  }
  .texto-presentacion {
    font-size: 0.95rem;
  }
}
</style>
