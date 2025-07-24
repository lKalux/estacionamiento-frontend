import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/',
    component: () => import('@/layouts/FullLayout.vue'),
    meta: { requiresAuth: true }, 
    children: [
      { path: '/inicio', name: 'InicioPage', component: () => import('@/views/InicioPage.vue') },
      { path: '/clientes', name: 'ClientesPage', component: () => import('@/views/ClientesPage.vue') },
      { path: '/autos', name: 'AutosPage', component: () => import('@/views/AutosPage.vue') },
      { path: '/plazas', name: 'PlazasPage', component: () => import('@/views/PlazasPage.vue') }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const token = localStorage.getItem('token')

  if (requiresAuth && !token) { 
    next({ name: 'LoginPage', query: { redirect: to.fullPath } })
  } else if (token && to.name === 'LoginPage') { 
    next({ path: '/inicio' })
  } else {
    next()
  }
})

export default router
