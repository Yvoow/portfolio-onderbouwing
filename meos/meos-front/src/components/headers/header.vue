<script setup lang="ts">
import { ref, inject } from 'vue'
import { useStore } from 'vuex'
import axios, { AxiosStatic } from 'axios'
import { useRouter, useRoute } from 'vue-router';
import changeMode from '@/utils/mode'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const api: AxiosStatic = inject('axios', axios);
const store = useStore()
const router = useRouter()
const route = useRoute()
const openedItem = ref(null)
const isMobileMenuOpen = ref(false)

const navItems = ref([
  { name: t('Home'), routename: 'dashboard.home', icon: 'fas fa-home' },
  { name: t('Map'), routename: 'dashboard.map', icon: 'fas fa-map' },
  { name: t('Reports'), routename: 'dashboard.reports', icon: 'fas fa-file-alt' },
  { name: t('Persons'), routename: 'dashboard.players', icon: 'fas fa-users' },
  { name: t('Vehicles'), routename: 'dashboard.vehicles', icon: 'fas fa-car' },
  { name: t('Code of law'), routename: 'dashboard.laws', icon: 'fas fa-book' },

  { name: t('Settings'), routename: 'settings', icon: 'fas fa-cog', children: [
    { name: t('Profile'), routename: 'settings.profile' },
    { name: t('Data'), routename: 'settings.preferences' },
    { name: t('Users'), routename: 'settings.users' },
    { name: t('Server'), routename: 'settings.servermanage' },
    { name: t('Meos'), routename: 'settings.meosmanage' },
  ] },
])

function handleClick(item: any) {
  if (!item.children) {
    router.push({ name: item.routename })
    isMobileMenuOpen.value = false
  } else {
    if (openedItem.value === item) {
      openedItem.value = null
    } else {
      openedItem.value = item
    }
  }
}

const isActive = (routeName: string) => {
  return route.name === routeName || route.name?.toString().startsWith(routeName + '.')
}

const logOut = () => {
  localStorage.removeItem('fusionToken')
  router.replace({ name: 'auth'})
}

</script>
<template>
  <div class="fixed top-0 left-0 right-0 z-50">
    <div class="hidden md:block">
      <div class="flex items-center justify-between px-6 py-3 dark:bg-secondary-dark/80 bg-white/80 backdrop-blur-sm border-b dark:border-tertiary-dark border-tertiary-light">
        <div class="flex items-center space-x-2">
          <img class="h-8 w-auto dark:invert-0 invert" src="/logowit.png" alt="Logo" />
          <span class="font-semibold tracking-wide text-sm dark:text-text-dark text-text-light">FUSION</span>
        </div>

        <nav class="flex items-center space-x-6">
          <div v-for="item in navItems" :key="item.name" class="relative">
            <button
              @click="handleClick(item)"
              :class="[
                'group flex items-center text-sm font-medium px-2 py-1.5 rounded-md transition-colors',
                isActive(item.routename)
                  ? 'dark:bg-tertiary-dark bg-tertiary-light dark:text-text-dark text-text-light'
                  : 'dark:text-text-dark-secondary text-text-light-secondary hover:dark:text-text-dark hover:text-text-light'
              ]"
            >
              <i :class="[item.icon, 'mr-2 text-xs']"></i>
              {{ item.name }}
              <i v-if="item.children" class="fas fa-chevron-down ml-1.5 text-xs transition-transform" :class="{'rotate-180': openedItem === item}"></i>
            </button>

            <div
              v-if="item.children && openedItem === item"
              class="absolute right-0 mt-1 w-48 origin-top-right rounded-md dark:bg-secondary-dark bg-white shadow-lg ring-1 dark:ring-tertiary-dark ring-tertiary-light focus:outline-none transition-all duration-200 z-50"
            >
              <div class="py-1">
                <RouterLink
                  v-for="child in item.children"
                  :key="child.name"
                  :to="{ name: child.routename }"
                  class="block px-4 py-2 text-sm dark:text-text-dark-secondary text-text-light-secondary hover:dark:bg-tertiary-dark hover:bg-tertiary-light hover:dark:text-text-dark hover:text-text-light"
                >
                  {{ child.name }}
                </RouterLink>
                <button
                  v-if="item.routename === 'settings'"
                  @click="logOut"
                  class="block w-full text-left px-4 py-2 text-sm text-danger hover:dark:bg-tertiary-dark hover:bg-tertiary-light"
                >
                  {{ t('Logout') }}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div class="flex items-center space-x-3">
          <button
            @click="changeMode()"
            class="flex items-center justify-center h-8 w-8 rounded-full dark:bg-tertiary-dark bg-tertiary-light transition-colors"
          >
            <i class="fas fa-moon dark:block hidden dark:text-text-dark text-text-dark"></i>
            <i class="fas fa-sun dark:hidden block dark:text-text-dark text-text-dark"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="md:hidden">
      <div class="flex items-center justify-between px-4 py-2 dark:bg-secondary-dark bg-white shadow-sm border-b dark:border-tertiary-dark border-tertiary-light">
        <div class="flex items-center space-x-2">
          <img class="h-7 w-auto dark:invert-0 invert" src="/logowit.png" alt="Logo" />
          <span class="font-semibold tracking-wide text-sm dark:text-text-dark text-text-light">FUSION</span>
        </div>

        <div class="flex items-center space-x-3">
          <button
            @click="changeMode()"
            class="flex items-center justify-center h-8 w-8 rounded-full dark:bg-tertiary-dark bg-tertiary-light transition-colors"
          >
            <i class="fas fa-moon dark:block hidden dark:text-text-dark text-text-dark"></i>
            <i class="fas fa-sun dark:hidden block dark:text-text-dark text-text-dark"></i>
          </button>

          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="flex items-center justify-center h-8 w-8 rounded-full dark:bg-tertiary-dark bg-tertiary-light"
          >
            <i class="fas" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
          </button>
        </div>
      </div>

      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 top-[52px] dark:bg-secondary-dark bg-white z-40 overflow-y-auto"
      >
        <nav class="px-4 py-2 space-y-1">
          <div v-for="item in navItems" :key="item.name">
            <button
              @click="handleClick(item)"
              :class="[
                'w-full flex items-center justify-between text-sm font-medium px-3 py-2.5 rounded-lg transition-colors',
                isActive(item.routename)
                  ? 'dark:bg-tertiary-dark bg-tertiary-light dark:text-text-dark text-text-light'
                  : 'dark:text-text-dark-secondary text-text-light-secondary'
              ]"
            >
              <div class="flex items-center">
                <i :class="[item.icon, 'mr-3 text-sm']"></i>
                {{ item.name }}
              </div>
              <i v-if="item.children" class="fas fa-chevron-down text-xs transition-transform" :class="{'rotate-180': openedItem === item}"></i>
            </button>

            <div v-if="item.children && openedItem === item" class="mt-1 ml-6 space-y-1">
              <RouterLink
                v-for="child in item.children"
                :key="child.name"
                :to="{ name: child.routename }"
                class="block px-3 py-2 text-sm rounded-lg dark:text-text-dark-secondary text-text-light-secondary hover:dark:bg-tertiary-dark hover:bg-tertiary-light hover:dark:text-text-dark hover:text-text-light"
              >
                {{ child.name }}
              </RouterLink>
              <button
                v-if="item.routename === 'settings'"
                @click="logOut"
                class="block w-full text-left px-3 py-2 text-sm rounded-lg text-danger hover:dark:bg-tertiary-dark hover:bg-tertiary-light"
              >
                {{ t('Logout') }}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>

  <!-- Spacer to prevent content from being hidden behind the header -->
  <div class="h-14 md:h-14"></div>
</template>
<style scoped>
/* Fade transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
