import { createRouter, createWebHistory } from 'vue-router'
import dashboardChildren from '@/router/dashboard'
import axios, { AxiosStatic } from 'axios'
import { inject } from 'vue'
import store from '@/store'

const isAuthenticated = async() => {
  const api: AxiosStatic = inject('axios', axios)
  const token = localStorage.getItem('fusionToken')
  try {
    const response = await api.get('/isLoggedIn', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status === 200) {
      localStorage.setItem('fusionToken', response.data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      store.commit('user/setId', response.data.user.id)
      store.commit('user/setUsername', response.data.user.username)
      store.commit('user/setName', response.data.user.name)
      store.commit('user/setBelongsToServer', response.data.user.belongsToServer)
      store.commit('user/setRole', response.data.user.role)
      store.commit('user/setRoleIcon', response.data.user.roleicon)
      store.commit('user/setServerAdmin', response.data.user.serverAdmin)
      store.commit('user/setMeosAdmin', response.data.user.meosAdmin)
      store.commit('user/setCallsign', response.data.user.callsign)
      store.commit('user/setSpecializations', response.data.user.specializations)
      store.commit('user/setGPS', response.data.user.GPS)
      store.commit('user/setLanguage', response.data.user.language)

      store.commit('servervars/setVars', response.data.servervars)
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: () => import('@/views/Auth.vue'),
      meta: {
        title: 'Auth',
      },
    },
    {
      path: '/db',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      redirect: (to) => ({ name: 'dashboard.home' }),
      beforeEnter: async (to, from, next) => {
        const isAuth = await isAuthenticated()
        if (!isAuth) {
          return next({ name: 'auth' })
        }
        next()
      },
      children: dashboardChildren,
      meta: {
        title: 'Dashboard',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/404.vue'),
      meta: {
        title: 'Not Found',
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  next()
  if (to.meta.requiresNewData) {
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      return next({ name: 'auth' })
    }
  }
})
router.beforeEach((to, from) => {
  to.meta.title ? document.title = 'MEOS | ' + to.meta.title : document.title = 'MEOS'
});

export default router
