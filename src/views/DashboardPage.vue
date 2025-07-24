<template>
      <div class="dashboard">
        <nav class="navbar navbar-light bg-light">
          <a class="navbar-brand">Control Estacionamiento</a>
          <button @click="logout" class="btn btn-outline-danger">Salir</button>
        </nav>
        <div class="container mt-4">
          <h2>Bienvenido, {{ username }}!</h2>
          <div class="row">
            <div class="col-md-4">
              <div class="card">
                <div class="card-body text-center">
                  <h5>Clientes</h5>
                  <router-link to="/clients" class="btn btn-primary">Gestionar</router-link>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body text-center">
                  <h5>Autos</h5>
                  <router-link to="/cars" class="btn btn-primary">Gestionar</router-link>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-body text-center">
                  <h5>Plazas</h5>
                  <router-link to="/parking-spaces" class="btn btn-primary">Gestionar</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <script>
    import router from '../router'

    export default {
      computed: {
        username() {
          return localStorage.getItem('token') ? 'Admin' : ''
        }
      },
      methods: {
        logout() {
          localStorage.removeItem('token')
          router.push('/')
        }
      }
    }
    </script>

    <style scoped>
    .dashboard { padding-top: 60px; }
    </style>