import { RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: 'createmarker',
    name: 'meosmanage.marker.create',
    component: () => import('@/views/dashboard/settings/meosmanage/markers/Create.vue'),
    meta: {
      title: 'Marker aanmaken',
    },
  },
  {
    path: 'editmarker/:id',
    name: 'meosmanage.marker.edit',
    component: () => import('@/views/dashboard/settings/meosmanage/markers/Edit.vue'),
    meta: {
      title: 'Marker bewerken',
    },
  },
  {
    path: 'createspecialization',
    name: 'meosmanage.specialization.create',
    component: () => import('@/views/dashboard/settings/meosmanage/specializations/Create.vue'),
    meta: {
      title: 'Specialisatie aanmaken',
    },
  },
  {
    path: 'editspecialization/:id',
    name: 'meosmanage.specialization.edit',
    component: () => import('@/views/dashboard/settings/meosmanage/specializations/Edit.vue'),
    meta: {
      title: 'Specialisatie bewerken',
    },
  },
  {
    path: 'createrole',
    name: 'meosmanage.role.create',
    component: () => import('@/views/dashboard/settings/meosmanage/roles/Create.vue'),
    meta: {
      title: 'Rol aanmaken',
    },
  },
  {
    path: 'editrole/:id',
    name: 'meosmanage.role.edit',
    component: () => import('@/views/dashboard/settings/meosmanage/roles/Edit.vue'),
    meta: {
      title: 'Rol bewerken',
    },
  },
  {
    path: 'settings',
    name: 'meosmanage.settings',
    component: () => import('@/views/dashboard/settings/meosmanage/Meos.vue'),
    meta: {
      title: 'Meos beheer',
    },
  }
]

export default routes
