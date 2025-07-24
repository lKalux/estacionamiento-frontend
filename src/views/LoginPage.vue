<template>
  <div class="login-container">
    <div class="card shadow">
      <div class="card-header text-center">
        <h1 class="project-title">CONTROL ESTACIONAMIENTO</h1>
      </div>
      <div class="card-body">
        <h2 class="text-center mb-4">Iniciar Sesión</h2>
        <form @submit.prevent="login">
          <div class="form-group mb-3">
            <label class="form-label">Usuario</label>
            <input v-model="username" type="text" class="form-control" placeholder="Ingresa tu usuario" required>
          </div>
          <div class="form-group mb-4">
            <label class="form-label">Contraseña</label>
            <input v-model="password" type="password" class="form-control" placeholder="Ingresa tu contraseña" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">Iniciar</button>
        </form>
        <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '../router'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/Auth/login', 
          { username: this.username, password: this.password }
        )
        localStorage.setItem('token', response.data.token)
        const redirect = this.$route.query.redirect || '/inicio'
        router.push(redirect)
      } catch (err) {
        this.error = 'Error en las credenciales'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 400px;
  border: none;
  border-radius: 10px;
  background-color: #ffffff;
  padding: 25px;
}

.shadow {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.form-label {
  font-weight: 600;
  font-size: 14px;
}

.form-control {
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
}

.btn-primary {
  background-color: #2c3e50;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-size: 16px;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background-color: #1a252f;
}
</style>
