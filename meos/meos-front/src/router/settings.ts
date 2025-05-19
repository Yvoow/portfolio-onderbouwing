import { RouteRecordRaw } from 'vue-router'
import meosManage from './meosmanage'
import userSettings from './usersettings'
import ManageChilds from './manage'

const routes: Array<RouteRecordRaw> = [
  {
    path: 'profile',
    name: 'settings.profile',
    component: () => import('@/views/dashboard/settings/Profile.vue'),
    meta: {
      title: 'Profiel',
    },
  },
  {
    path: 'users',
    name: 'settings.users',
    component: () => import('@/views/dashboard/settings/Users.vue'),
    redirect: (to) => ({ name: 'settings.users.list' }),
    children: userSettings,
    meta: {
      title: 'Gebruikers',
      requiresNewData: true
    },
  },
  {
    path: 'preferences',
    name: 'settings.preferences',
    component: () => import('@/views/dashboard/settings/Preferences.vue'),
    meta: {
      title: 'Voorkeuren',
    },
  },
  {
    path: 'manage',
    name: 'settings.servermanage',
    component: () => import('@/views/dashboard/settings/Manage.vue'),
    redirect: (to) => ({ name: 'manage.server' }),
    children: ManageChilds,
    meta: {
      title: 'Beheer',
    },
  },
  {
    path: 'meosmanage',
    name: 'settings.meosmanage',
    component: () => import('@/views/dashboard/settings/MeosManage.vue'),
    redirect: (to) => ({ name: 'meosmanage.settings' }),
    children: meosManage,
    meta: {
      requiresNewData: true,
      title: 'Meos beheer',
    },
  }
]

export default routes
