import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: 'list',
    name: 'laws.list',
    component: () => import('@/views/dashboard/laws/List.vue'),
    meta: {
      title: 'Wetboek',
    },
  },
]

export default routes