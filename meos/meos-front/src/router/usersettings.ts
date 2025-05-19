import { RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: 'list',
    name: 'settings.users.list',
    component: () => import('@/views/dashboard/settings/users/List.vue'),
    meta: {
      title: 'Gebruikers',
    },
  },
  {
    path: 'create',
    name: 'settings.users.create',
    component: () => import('@/views/dashboard/settings/users/Create.vue'),
    meta: {
      title: 'Gebruiker aanmaken',
    },
  },
  {
    path: 'edit/:id',
    name: 'settings.users.edit',
    component: () => import('@/views/dashboard/settings/users/Edit.vue'),
    meta: {
      title: 'Gebruiker bewerken',
    },
  }
]

export default routes
