<script setup lang="ts">
import { ref, Ref, watch, inject, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios, { AxiosStatic } from 'axios'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const publicPath = window.location.origin
const loading: Ref<boolean> = ref(false)
const store = useStore()
const router = useRouter()
const api: AxiosStatic = inject('axios', axios)
const amountsTried: Ref<number> = ref(0)
const showChangelogModal: Ref<boolean> = ref(false)
const showLatestChangelog = ref(false)

const changelogs = ref([])

const credentials = ref({
  username: '',
  password: ''
})

const login = async() => {
  if (!credentials.value.username || !credentials.value.password) {
    store.dispatch('notification/show', {
      type: 'error',
      message: 'Vul alle velden in'
    })
    return
  }

  if (amountsTried.value >= 3) {
    store.dispatch('notification/show', {
      type: 'error',
      message: 'Je hebt te vaak geprobeerd in te loggen, probeer het later opnieuw'
    })
    return
  }

  try {
    loading.value = true
    amountsTried.value++
    const response = await api.post('/login', credentials.value)
    if (response.status === 200) {
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      localStorage.setItem('fusionToken', response.data.token)
      store.commit('user/setId', response.data.user.id)
      store.commit('user/setUsername', response.data.user.username)
      store.commit('user/setName', response.data.user.name)
      store.commit('user/setBelongsToServer', response.data.user.belongsToServer)
      store.commit('user/setRole', response.data.user.role)
      store.commit('user/setRoleIcon', response.data.user.roleicon)
      store.commit('user/setServerAdmin', response.data.user.serverAdmin)
      store.commit('user/setMeosAdmin', response.data.user.meosAdmin)
      store.commit('user/setCallsign', response.data.user.callsign)
      store.commit('user/setSpecializations', response.data.user.specializations)
      store.commit('user/setGPS', response.data.user.GPS)

      await nextTick();
      router.replace({ name: 'dashboard' })
    }
  } catch (error) {
    if (error.response.status === 400) {
      store.dispatch('notification/show', {
        type: 'error',
        message: 'Vul alle velden in'
      })
    } else if (error.response.status === 401) {
      store.dispatch('notification/show', {
        type: 'error',
        message: 'Gebruikersnaam of wachtwoord is onjuist'
      })
    } else if (error.response.status === 412) {
      store.dispatch('notification/show', {
        type: 'error',
        message: 'De licentie is verlopen, contacteer een server admin'
      })
    } else {
      store.dispatch('notification/show', {
        type: 'error',
        message: 'Er is iets fout gegaan, probeer het later opnieuw'
      })
    }
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (localStorage.getItem('fusionToken')) {
    router.replace({ name: 'dashboard' })
  }
  const response = await api.get('/Changelogs')
  changelogs.value = response.data
})

watch(() => amountsTried.value, (newValue) => {
  if (newValue >= 3) {
    setTimeout(() => {
      amountsTried.value = 2
    }, 5000);
  }
})
</script>
<template>
  <div class="flex min-h-screen flex-col justify-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
    <!-- Changelog Button -->
    <div v-if="changelogs.length > 0" class="absolute left-4 top-4">
      <div class="relative">
        <button @click="showLatestChangelog = !showLatestChangelog" class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors backdrop-blur-sm shadow-subtle">
          <i class="fas fa-history text-primary"></i>
          <span>v{{ changelogs[0].version }}</span>
          <i class="fas fa-chevron-down text-xs ml-1 transition-transform" :class="{'rotate-180': showLatestChangelog}"></i>
        </button>

        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1">
          <div v-if="showLatestChangelog" class="absolute left-0 top-full mt-2 w-72 rounded-xl bg-white dark:bg-gray-800 shadow-card border border-gray-200 dark:border-gray-700 p-4 text-sm dark:text-gray-300 text-gray-600">
            <h4 class="font-semibold text-gray-900 dark:text-white">{{ changelogs[0].title }}</h4>
            <ul class="mt-3 space-y-2.5">
              <li v-for="(point, pointIndex) in changelogs[0].points.slice(0, 3)" :key="pointIndex" class="flex items-start gap-3">
                <span :class="{
                  'text-success': point.type === 'added',
                  'text-primary': point.type === 'changed',
                  'text-danger': point.type === 'removed',
                  'text-warning': point.type === 'fixed'
                }" class="flex-shrink-0 mt-0.5">
                  <i :class="{
                    'fa-plus-circle': point.type === 'added',
                    'fa-arrows-rotate': point.type === 'changed',
                    'fa-minus-circle': point.type === 'removed',
                    'fa-wrench': point.type === 'fixed'
                  }" class="fas"></i>
                </span>
                <span class="flex-1 text-gray-600 dark:text-gray-400">{{ point.text }}</span>
              </li>
            </ul>
            <button @click="showChangelogModal = true; showLatestChangelog = false" class="mt-3 text-primary hover:text-primary-dark text-xs font-medium inline-flex items-center">
              {{ t('View all changes') }}
              <i class="fas fa-arrow-right ml-1 text-[10px]"></i>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-out duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" v-if="loading">
        <div class="flex flex-col items-center space-y-3 p-8 rounded-xl bg-white/90 dark:bg-gray-800/90 shadow-lg">
          <div class="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p class="font-medium text-gray-600 dark:text-gray-300">Bezig met inloggen...</p>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      enter-to-class="opacity-100 translate-y-0 sm:scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0 sm:scale-100"
      leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
      <div v-if="showChangelogModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="showChangelogModal = false"></div>

          <div class="relative rounded-xl bg-white dark:bg-gray-800 p-6 overflow-hidden shadow-xl transition-all sm:max-w-lg sm:w-full">
            <div class="absolute right-4 top-4">
              <button type="button" class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors" @click="showChangelogModal = false">
                <span class="sr-only">Sluiten</span>
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="sm:flex sm:items-start">
              <div class="mt-3 w-full text-center sm:mt-0 sm:text-left">
                <h3 class="text-xl font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">Changelogs</h3>
                <div class="mt-6 space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div v-for="(changelog, index) in changelogs" :key="index" class="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div class="flex items-center justify-between">
                      <h4 class="font-semibold text-gray-900 dark:text-white">{{ changelog.title }}</h4>
                      <span class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">v{{ changelog.version }}</span>
                    </div>
                    <ul class="space-y-3">
                      <li v-for="(point, pointIndex) in changelog.points" :key="pointIndex" class="flex items-start gap-3">
                        <span :class="{
                          'text-success': point.type === 'added',
                          'text-primary': point.type === 'changed',
                          'text-danger': point.type === 'removed',
                          'text-warning': point.type === 'fixed'
                        }" class="flex-shrink-0 mt-0.5">
                          <i :class="{
                            'fa-plus-circle': point.type === 'added',
                            'fa-arrows-rotate': point.type === 'changed',
                            'fa-minus-circle': point.type === 'removed',
                            'fa-wrench': point.type === 'fixed'
                          }" class="fas"></i>
                        </span>
                        <span class="flex-1 text-gray-600 dark:text-gray-400">{{ point.text }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <div class="mx-auto w-full max-w-md p-6 sm:p-10">
      <div class="overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 shadow-card backdrop-blur-md border border-gray-200 dark:border-gray-700">
        <div class="px-8 py-8">
          <div class="flex flex-col items-center space-y-1">
            <img class="h-20 w-auto mb-2" :src="`${publicPath}/logowit.png`" alt="Fusion Logo" />
            <h2 class="text-center tracking-[0.3em] text-xs font-semibold text-gray-900 dark:text-white">{{ t('FUSION') }}</h2>
            <p class="text-center text-sm text-gray-500 dark:text-gray-400">{{ t('Login to your account') }}</p>
          </div>

          <div class="mt-8 space-y-6">
            <div class="relative">
              <label for="username" class="input-label-default">{{ t('Username') }} <span class="text-danger">*</span></label>
              <div class="mt-2">
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <i class="fas fa-user text-gray-400"></i>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    v-model="credentials.username"
                    class="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 pl-10 pr-3 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm/6"
                    :placeholder="t('Enter your username')"
                  />
                </div>
              </div>
            </div>

            <div class="relative">
              <label for="password" class="input-label-default">{{ t('Password') }} <span class="text-danger">*</span></label>
              <div class="mt-2">
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <i class="fas fa-lock text-gray-400"></i>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    v-model="credentials.password"
                    class="block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 pl-10 pr-3 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm/6"
                    :placeholder="t('Enter your password')"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                :disabled="loading"
                @click="login"
                class="flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="!loading">{{ t('Login') }}</span>
                <i v-else class="fas fa-spinner animate-spin"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-900/30 px-8 py-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            {{ t('Need help?') }}
            <a href="https://discord.gg/4cSD2QvwY2" class="font-medium text-primary hover:text-primary-dark transition-colors">{{ t('Contact us here') }}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 9999px;
}
</style>
