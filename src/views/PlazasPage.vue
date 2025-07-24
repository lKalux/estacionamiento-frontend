<template>
  <div class="container mt-4">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
      <h2 class="mb-3 mb-md-0">
        <i class="fas fa-parking mr-2"></i> Gestión de Plazas 
      </h2>
      <div>
        <button @click="openAddModal" class="btn btn-success mr-2">
          <i class="fas fa-plus"></i> Nueva Plaza
        </button>
        <button @click="refreshData" class="btn btn-secondary" :disabled="loading">
          <i class="fas fa-sync-alt"></i> Actualizar
        </button>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Cargando datos...</p>
    </div>

    <div v-else class="row">
      <!-- CLIENTES (arrastrables - no desaparecen) -->
      <div class="col-md-4 mb-3">
        <h5><i class="fas fa-users mr-2"></i>Clientes</h5>
        <draggable
          :list="clientes"
          :group="{ name: 'clientes', pull: 'clone', put: false }"
          :sort="false"
          item-key="id"
          class="list-group"
        >
          <div
            v-for="c in clientes"
            :key="c.id"
            class="list-group-item cursor-grab"
            :data-id="c.id"
          >
            {{ c.nombre }} {{ c.apellido || '' }}
          </div>
        </draggable>
      </div>

      <!-- PLAZAS -->
      <div class="col-md-8">
        <h5><i class="fas fa-th-large mr-2"></i>Plazas</h5>

        <div class="row">
          <div
            v-for="plaza in plazas"
            :key="plaza.id"
            class="col-sm-6 col-lg-4 mb-3"
          >
            <div
              class="card h-100 plaza-card"
              :class="plaza.estado === 'Libre' ? 'plaza-libre' : 'plaza-ocupada'"
            >
              <div class="card-body p-2 text-center">
                <h6 class="card-title mb-2">Plaza #{{ plaza.numeroPlaza }}</h6>
                <p class="small mb-2">
                  <strong>Estado:</strong> {{ plaza.estado }}
                </p>

                <p class="small mb-2" v-if="plaza.cliente">
                  <i class="fas fa-user"></i>
                  {{ plaza.cliente.nombre }} {{ plaza.cliente.apellido || '' }}
                </p>
                <p class="small mb-2" v-else>- Sin asignar -</p>

                <!-- Dropzone solo si está libre -->
                <draggable
                  v-if="plaza.estado === 'Libre'"
                  :list="[]"
                  :group="{ name: 'clientes', pull: false, put: true }"
                  @add="onAssign($event, plaza)"
                  class="dropzone-libre p-2 text-center border rounded"
                >
                  <span class="text-muted small">Arrastra un cliente aquí</span>
                </draggable>

                <!-- Revocar -->
                <button
                  v-if="plaza.clienteId"
                  class="btn btn-info btn-sm mt-2"
                  @click="revocarPlaza(plaza.id)"
                >
                  <i class="fas fa-undo"></i> Revocar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- (Opcional) Zona para revocar por drag & drop -->
        <!--
        <div class="mt-4 p-4 text-center border border-danger rounded">
          <i class="fas fa-trash-alt text-danger"></i> Soltar aquí para revocar
        </div>
        -->
      </div>
    </div>

    <!-- MODAL Nueva Plaza -->
    <div v-if="showModal" class="modal" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Nueva Plaza</h5>
            <button @click="closeModal" class="close text-white">×</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="savePlaza">
              <div class="form-group">
                <label>Número de Plaza</label>
                <input v-model="plazaForm.numeroPlaza" class="form-control" required>
              </div>
              <div class="d-flex justify-content-end mt-3">
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
import draggable from 'vuedraggable'
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  components: { draggable },
  data() {
    return {
      clientes: [],
      plazas: [],
      loading: false,
      showModal: false,
      plazaForm: { id: 0, numeroPlaza: '' } // Estado será Libre por defecto
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const [clRes, plRes] = await Promise.all([
          axios.get(process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/clientes', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
          }),
          axios.get(process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/plazas', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
          })
        ])
        this.clientes = clRes.data
        this.plazas = plRes.data
      } catch (e) {
        Swal.fire('Error', 'No se pudo cargar la información.', 'error')
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    refreshData() {
      this.loadData()
    },

    // Asignar cliente arrastrado a la plaza
    async onAssign(evt, plaza) {
      const clienteId = Number(evt.item.dataset.id)
      if (!clienteId) return

      try {
        await axios.put(
          process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + `/plazas/${plaza.id}`,
          {
            ...plaza,
            clienteId,
            estado: 'Ocupada',
            fechaAsignacion: new Date(),
            fechaRevocacion: null
          },
          { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
        )
        await this.loadData()
        Swal.fire('¡Asignado!', 'El cliente fue asignado a la plaza.', 'success')
      } catch (e) {
        Swal.fire('Error', 'No se pudo asignar el cliente a la plaza.', 'error')
        console.error('Error asignando plaza', e)
      }
    },

    async revocarPlaza(id) {
      const result = await Swal.fire({
        title: '¿Revocar esta plaza?',
        text: 'La plaza volverá a estar libre.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, revocar',
        cancelButtonText: 'Cancelar'
      })
      if (!result.isConfirmed) return

      try {
        await axios.post(
          process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + `/plazas/${id}/Revocar`,
          {},
          { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
        )
        await this.loadData()
        Swal.fire('¡Revocada!', 'La plaza fue liberada.', 'success')
      } catch (e) {
        Swal.fire('Error', 'No se pudo revocar la plaza.', 'error')
        console.error('Error revocando plaza', e)
      }
    },

    openAddModal() {
      this.plazaForm = { id: 0, numeroPlaza: '' }
      this.showModal = true
    },

    async savePlaza() {
      try {
        await axios.post(
          process.env.VUE_APP_API_URL + process.env.VUE_APP_API_BASE + '/plazas',
          {
            ...this.plazaForm,
            estado: 'Libre',
            clienteId: null,
            fechaAsignacion: null,
            fechaRevocacion: null
          },
          { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } }
        )
        this.showModal = false
        await this.loadData()
        Swal.fire('¡Guardado!', 'La plaza fue creada exitosamente.', 'success')
      } catch (e) {
        Swal.fire('Error', 'No se pudo crear la plaza.', 'error')
        console.error('Error creando plaza', e)
      }
    },

    closeModal() {
      this.showModal = false
    }
  }
}
</script>

<style scoped>
.cursor-grab { cursor: grab; }
.plaza-card { transition: all 0.2s; }
.plaza-libre { border: 2px dashed #6c757d; background: #f8f9fa; }
.plaza-ocupada { border: 2px solid #28a745; background: #e6ffe6; }
.dropzone-libre {
  min-height: 40px;
  background-color: #f1f1f1;
}
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
