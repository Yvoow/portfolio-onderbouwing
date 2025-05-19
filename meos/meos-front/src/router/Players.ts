import { RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: 'list',
    name: 'players.list',
    component: () => import('@/views/dashboard/players/List.vue'),
    meta: {
      title: 'Personen',
    },
  },
  {
    path: 'view/:id',
    name: 'players.view',
    component: () => import('@/views/dashboard/players/View.vue'),
    meta: {
      title: 'Persoon bekijken',
    },
  }
]

export default routes
