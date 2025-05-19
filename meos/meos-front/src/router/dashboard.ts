import { RouteRecordRaw } from 'vue-router'
import settingChilds from './settings'
import playerChilds from './Players'
import reportsChilds from './Reports'
import vehicleChilds from './Vehicles'
import lawsChilds from './Laws'

const routes: Array<RouteRecordRaw> = [
  {
    path: 'home',
    name: 'dashboard.home',
    component: () => import('@/views/dashboard/Home.vue'),
    meta: {
      title: 'Dashboard',
    },
  },
  {
    path: 'settings',
    name: 'settings',
    component: () => import('@/views/dashboard/Settings.vue'),
    redirect: (to) => ({ name: 'settings.profile' }),
    children: settingChilds,
    meta: {
      title: 'Instellingen'
    }
  },
  {
    path: 'map',
    name: 'dashboard.map',
    component: () => import('@/views/dashboard/map/Map.vue'),
    meta: {
      title: 'Kaart',
    },
  },
  {
    path: 'players',
    name: 'dashboard.players',
    component: () => import('@/views/dashboard/Players.vue'),
    redirect: (to) => ({ name: 'players.list' }),
    children: playerChilds,
    meta: {
      title: 'Personen',
    },
  },
  {
    path: 'vehicles',
    name: 'dashboard.vehicles',
    component: () => import('@/views/dashboard/Vehicles.vue'),
    redirect: (to) => ({ name: 'vehicles.list' }),
    children: vehicleChilds,
    meta: {
      title: 'Voertuigen',
    },
  },
  {
    path: 'reports',
    name: 'dashboard.reports',
    component: () => import('@/views/dashboard/Reports.vue'),
    redirect: (to) => ({ name: 'reports.list' }),
    children: reportsChilds,
    meta: {
      title: 'Rapportages',
    },
  },
  {
    path: 'laws',
    name: 'dashboard.laws',
    component: () => import('@/views/dashboard/laws/List.vue'),
    redirect: (to) => ({ name: 'laws.list' }),
    children: lawsChilds,
    meta: {
      title: 'Wetboek',
    },
  }
]

export default routes
