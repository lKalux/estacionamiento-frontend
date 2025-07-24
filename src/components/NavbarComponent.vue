<template>
  <nav  class="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
    <div class="container">
      <a class="navbar-brand fw-bold project-title">Control Estacionamiento</a>
 
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button> 

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/inicio" class="nav-link" exact-active-class="active">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/clientes" class="nav-link" exact-active-class="active">Clientes</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/autos" class="nav-link" exact-active-class="active">Autos</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/plazas" class="nav-link" exact-active-class="active">Plazas</router-link>
          </li>
        </ul>

        <button @click="logout" class="btn btn-outline-primary btn-sm logout-btn">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
import router from '../router'

export default { 
  methods: {
    logout() {
      localStorage.removeItem('token')
      router.push('/')
    }
  }
}
</script>

<style scoped>
:root {
  --primary-dark: #2c3e50;
  --text-dark: #333333;
  --border-color: #e5e7eb;
}

.navbar {
  z-index: 1000;
  background-color: #ffffff !important;
  border-bottom: 1px solid var(--border-color);
}

.project-title {
  color: var(--primary-dark);
  letter-spacing: 0.5px;
}

.nav-link {
  color: var(--text-dark) !important;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-dark) !important;
}

.nav-link.active {
  color: var(--primary-dark) !important;
  border-bottom: 2px solid var(--primary-dark);
}

.logout-btn {
  color: var(--primary-dark);
  border-color: var(--primary-dark);
}

.logout-btn:hover {
  background-color: var(--primary-dark);
  color: #fff;
}
</style>
