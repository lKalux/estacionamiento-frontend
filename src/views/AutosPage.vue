<template>
  <div class="container mt-4">
 
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
      <h2 class="mb-3 mb-md-0">
        <i class="fas fa-car me-2"></i> Gestión de Autos
      </h2>
      <div class="botones-acciones">
        <button @click="openAddModal" class="btn btn-success mr-2">
          <i class="fas fa-plus"></i> Agregar
        </button>
        <button @click="refreshData" class="btn btn-secondary" :disabled="loading">
          <i class="fas fa-sync-alt"></i> Actualizar
        </button>
      </div>
    </div>
 
    <div class="input-group mb-3">
      <input
        v-model="filter"
        @input="filterAutos"
        class="form-control"
        placeholder="Filtrar por Marca, Modelo o Patente..."
      />
      <div class="input-group-append">
        <span class="input-group-text"><i class="fas fa-search"></i></span>
      </div>
    </div>
 
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
      <p class="mt-2">Cargando datos...</p>
    </div>
 
    <div v-else class="table-responsive">
      <table class="table table-hover table-striped align-middle">
        <thead class="thead-dark">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Patente</th>
            <th>Año</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="auto in filteredAutos" :key="auto.id">
            <td>{{ auto.id }}</td>
            <td>{{ auto.cliente ? auto.cliente.nombre + ' ' + (auto.cliente.apellido || '') : auto.clienteId }}</td>
            <td>{{ auto.marca }}</td>
            <td>{{ auto.modelo }}</td>
            <td>{{ auto.patente }}</td>
            <td>{{ auto.anio || '-' }}</td>
            <td class="text-center botones-acciones">
              <button @click="editAuto(auto)" class="btn btn-warning btn-sm mr-1" title="Editar">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteAuto(auto.id)" class="btn btn-danger btn-sm" title="Eliminar">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
 
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="fas fa-car me-2"></i>{{ editingAuto ? 'Editar' : 'Nuevo' }} Auto
            </h5>
            <button @click="closeModal" class="close text-white">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveAuto">
              <div class="form-group mb-3">
                <label>Cliente</label>
                <select v-model.number="autoForm.clienteId" class="form-control" required>
                  <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.nombre }} {{ client.apellido || '' }}
                  </option>
                </select>
              </div>
              <div class="form-group mb-3">
                <label>Marca</label>
                <input v-model="autoForm.marca" class="form-control" required />
              </div>
              <div class="form-group mb-3">
                <label>Modelo</label>
                <input v-model="autoForm.modelo" class="form-control" required />
              </div>
              <div class="form-group mb-3">
                <label>Patente</label>
                <input v-model="autoForm.patente" class="form-control" required />
              </div>
              <div class="form-group mb-3">
                <label>Año (opcional)</label>
                <input v-model.number="autoForm.anio" type="number" class="form-control" />
              </div>
              <div class="text-end">
                <button type="submit" class="btn btn-primary mr-2">
                  <i class="fas fa-save"></i> Guardar
                </button>
                <button @click="closeModal" type="button" class="btn btn-secondary">
                  <i class="fas fa-times"></i> Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      autos: [],
      filteredAutos: [],
      clients: [],
      filter: '',
      loading: false,
      showModal: false,
      autoForm: { id: 0, clienteId: 0, marca: '', modelo: '', patente: '', anio: null },
      editingAuto: false,
      originalForm: null
    }
  },
  mounted() {
    this.fetchAutos()
    this.fetchClients()
  },
  methods: {
    fetchAutos() {
      this.loading = true
      axios.get(process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/autos', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        params: { filtro: this.filter }
      })
      .then(res => {
        this.autos = res.data
        this.filteredAutos = [...this.autos]
      })
      .catch(err => {
        console.error('Error fetching autos:', err)
        Swal.fire('Error', 'No se pudieron cargar los autos.', 'error')
      })
      .finally(() => (this.loading = false))
    },
    fetchClients() {
      axios.get(process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/clientes', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      .then(res => (this.clients = res.data))
      .catch(err => {
        console.error('Error fetching clients:', err)
        Swal.fire('Error', 'No se pudieron cargar los clientes.', 'error')
      })
    },
    refreshData() {
      this.fetchAutos()
    },
    filterAutos() {
      this.fetchAutos()
    },
    openAddModal() {
      this.autoForm = { id: 0, clienteId: 0, marca: '', modelo: '', patente: '', anio: null }
      this.editingAuto = false
      this.showModal = true
    },
    editAuto(auto) {
      this.autoForm = { ...auto }
      this.editingAuto = true
      this.originalForm = { ...auto }
      this.showModal = true
    },
    saveAuto() {
      const url = this.editingAuto
        ? process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/autos/' + this.autoForm.id
        : process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/autos'
      const method = this.editingAuto ? 'put' : 'post'
      const payload = { ...this.autoForm, clienteId: Number(this.autoForm.clienteId) }

      axios[method](url, payload, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      .then(() => {
        this.fetchAutos()
        this.closeModal()
        Swal.fire('¡Éxito!', `Auto ${this.editingAuto ? 'actualizado' : 'registrado'} correctamente.`, 'success')
      })
      .catch(err => {
        console.error('Error saving auto:', err)
        Swal.fire('Error', 'No se pudo guardar el auto.', 'error')
      })
    },
    async deleteAuto(id) {
      const result = await Swal.fire({
        title: '¿Eliminar auto?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })
      if (!result.isConfirmed) return

      axios.delete(process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/autos/' + id, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      .then(() => {
        this.fetchAutos()
        Swal.fire('¡Eliminado!', 'El auto fue eliminado correctamente.', 'success')
      })
      .catch(err => {
        console.error('Error deleting auto:', err)
        Swal.fire('Error', err.response?.data?.error || 'No se pudo eliminar el auto.', 'error')
      })
    },
    closeModal() {
      this.showModal = false
    }
  }
}
</script>

<style scoped>
.botones-acciones .btn + .btn {
  margin-left: .5rem;
}
</style>
