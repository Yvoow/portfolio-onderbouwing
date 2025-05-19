import { RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: 'create/:id?',
    name: 'reports.create',
    component: () => import('@/views/dashboard/reports/Create.vue'),
    meta: {
      title: 'Rapportage aanmaken',
    },
  },
  {
    path: 'list',
    name: 'reports.list',
    component: () => import('@/views/dashboard/reports/List.vue'),
    meta: {
      title: 'Rapportages',
    },
  },
  {
    path: 'view/:id',
    name: 'reports.view',
    component: () => import('@/views/dashboard/reports/View.vue'),
    meta: {
      title: 'Rapportage bekijken',
    },
  }
]

export default routes
