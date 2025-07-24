<template>
  <div class="container mt-4"> 

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
      <h2 class="titulo-seccion">Gestión de Clientes</h2>
      <div class="botones-acciones">
        <button @click="openAddModal" class="btn btn-success mr-2">
          <i class="fas fa-user-plus"></i> Agregar
        </button>
        <button @click="refreshData" class="btn btn-secondary">
          <i class="fas fa-sync-alt"></i> Actualizar
        </button>
      </div>
    </div>

    

    <div class="input-group mb-3">
      <input v-model="filter" @input="filterClients" class="form-control" placeholder="Buscar cliente...">
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
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in filteredClients" :key="client.id">
            <td>{{ client.id }}</td>
            <td>{{ client.nombre }}</td>
            <td>{{ client.apellido || '-' }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.telefono || '-' }}</td>
            <td class="text-center">
              <button @click="editClient(client)" class="btn btn-warning btn-sm mr-1" title="Editar">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteClient(client.id)" class="btn btn-danger btn-sm" title="Eliminar">
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
            <h5 class="modal-title">{{ editingClient ? 'Editar' : 'Nuevo' }} Cliente</h5>
            <button @click="closeModal" class="close text-white">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveClient">
              <div class="form-group">
                <label>Nombre</label>
                <input v-model="clientForm.nombre" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Apellido</label>
                <input v-model="clientForm.apellido" class="form-control">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="clientForm.email" type="email" class="form-control" required>
              </div>
              <div class="form-group">
                <label>Teléfono (opcional)</label>
                <input 
                  v-model="clientForm.telefono" 
                  type="tel" 
                  class="form-control"
                  pattern="[0-9]{6,}" 
                  title="Debe contener al menos 6 números" 
                  @input="validatePhone"
                >
                <small v-if="phoneError" class="text-danger">{{ phoneError }}</small>
              </div>
              <div class="d-flex justify-content-end">
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
      clients: [],
      filteredClients: [],
      filter: '',
      showModal: false,
      clientForm: { id: 0, nombre: '', apellido: '', email: '', telefono: '' },
      editingClient: false,
      originalForm: null,
      loading: false,        
      phoneError: ''        
    }
  },
  mounted() {
    this.fetchClients()
  },
  methods: {
    fetchClients() {
      this.loading = true
      axios.get(process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/clientes', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      }).then(response => {
        this.clients = response.data
        this.filteredClients = [...this.clients]
      }).catch(err => {
        Swal.fire('Error', 'No se pudieron cargar los clientes', 'error')
        console.error(err)
      }).finally(() => {
        this.loading = false
      })
    },
    refreshData() {
      this.fetchClients()
    },
    filterClients() {
      this.filteredClients = this.clients.filter(client =>
        client.nombre.toLowerCase().includes(this.filter.toLowerCase()) ||
        (client.apellido && client.apellido.toLowerCase().includes(this.filter.toLowerCase()))
      )
    },
    openAddModal() { 
      this.clientForm = { id: 0, nombre: '', apellido: '', email: '', telefono: '' }
      this.editingClient = false
      this.originalForm = null
      this.phoneError = ''
      this.showModal = true
    },
    editClient(client) {
      this.clientForm = { ...client }
      this.editingClient = true
      this.originalForm = { ...client }  
      this.phoneError = ''
      this.showModal = true
    },
    saveClient() {
      if (this.clientForm.telefono && this.phoneError) return

      const url = this.editingClient
        ? process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/clientes/' + this.clientForm.id
        : process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/clientes'
      const method = this.editingClient ? 'put' : 'post'

      axios[method](url, this.clientForm, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      }).then(() => {
        this.fetchClients()
        this.closeModal()
        Swal.fire('¡Éxito!', `Cliente ${this.editingClient ? 'actualizado' : 'registrado'} correctamente`, 'success')
      }).catch(err => {
        Swal.fire('Error', 'No se pudo guardar el cliente', 'error')
        console.error(err)
      })
    },
    async deleteClient(id) {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el cliente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })
      if (!result.isConfirmed) return

      axios.delete(process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/clientes/' + id, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      }).then(() => {
        this.fetchClients()
        Swal.fire('¡Eliminado!', 'El cliente fue eliminado correctamente', 'success')
      }).catch(err => {
        Swal.fire('Error', 'No se pudo eliminar el cliente', 'error')
        console.error(err)
      })
    },
    closeModal() { 
      this.showModal = false
    },
    validatePhone() {
      const phone = this.clientForm.telefono
      if (!phone) {
        this.phoneError = ''         
        return
      }
      if (!/^[0-9]{6,}$/.test(phone)) {
        this.phoneError = 'El teléfono debe tener al menos 6 números y solo dígitos'
      } else {
        this.phoneError = ''
      }
    }
  }
}
</script>


<style scoped> 
.botones-acciones .btn + .btn {
  margin-left: .5rem;
}
</style>