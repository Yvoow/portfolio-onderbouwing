import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: 'list',
    name: 'vehicles.list',
    component: () => import('@/views/dashboard/vehicles/List.vue'),
    meta: {
      title: 'Voertuigen',
    },
  },
  {
    path: ':plate',
    name: 'vehicles.view',
    component: () => import('@/views/dashboard/vehicles/View.vue'),
    meta: {
      title: 'Voertuig Details',
    },
  }
]

export default routes
