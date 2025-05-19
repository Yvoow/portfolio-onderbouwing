import { RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: 'server',
    name: 'manage.server',
    component: () => import('@/views/dashboard/settings/manage/Server.vue'),
    meta: {
      title: 'Server',
    },
  },
]

export default routes
