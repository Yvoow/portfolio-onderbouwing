<script setup lang="ts">
import { onMounted, ref, Ref, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios, { AxiosStatic } from 'axios'
import { useI18n } from 'vue-i18n'

const store = useStore()
const router = useRouter()
const { t } = useI18n()
const showForm: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)
const selectedSpecialization: Ref<string> = ref('')
const publicPath = window.location.origin
const api: AxiosStatic = inject('axios', axios)
const formDesc = ref('')
const refreshingGPS = ref(false)


const currentPersonalia = ref({
  callSign: '',
  name: '',
  role: '',
  username: '',
  password: '',
  language: '',
})

onMounted(() => {
  setPersonalia()
})

const setPersonalia = () => {
  currentPersonalia.value.callSign = store.getters['user/callsign']
  currentPersonalia.value.name = store.getters['user/name']
  currentPersonalia.value.role = store.getters['user/role']
  currentPersonalia.value.username = store.getters['user/username']
  currentPersonalia.value.language = store.getters['user/language']
}

const handleSave = async() => {
  if (!currentPersonalia.value.username || !currentPersonalia.value.name || !currentPersonalia.value.callSign) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Please fill in all required fields')
    })
    return
  }

  try {
    const response = await api.post('/PatchAccount', {
      username: currentPersonalia.value.username,
      name: currentPersonalia.value.name,
      callSign: currentPersonalia.value.callSign,
      password: currentPersonalia.value.password ? currentPersonalia.value.password : null,
      language: currentPersonalia.value.language
    })
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Account updated successfully')
      })
    }
  } catch (error) {
    if (error.response.status === 409) {
      store.dispatch('notification/show', {
        type: 'error',
        message: t('Username already exists')
      })
    } else {
      store.dispatch('notification/show', {
        type: 'error',
        message: t('Something went wrong')
      })
    }
  }
}

const changeGPSid = async() => {
  refreshingGPS.value = true
  try {
    const response = await api.post(`/ChangeGPSid/${store.getters['user/id']}`)
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: t('GPS ID updated successfully')
      })
    }
    store.commit('user/setGPS', response.data)
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong')
    })
  }
  refreshingGPS.value = false
}

const handleCancel = () => {
  store.dispatch('notification/show', {
    type: 'info',
    message: t('Changes discarded')
  })
  router.push({ name: 'dashboard.home' })
}

const handleDiscordLink = () => {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID
  const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;
  window.location.href = discordAuthUrl
}
</script>
<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="showForm" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">{{ t('Specialization') }}</h3>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Name') }}</label>
                <input
                  type="text"
                  readonly
                  disabled
                  :value="selectedSpecialization.label ?? t('Unknown')"
                  class="input-default bg-gray-50 dark:bg-gray-700"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Description') }}</label>
                <textarea
                  readonly
                  disabled
                  :value="selectedSpecialization.desc ?? t('Unknown')"
                  class="input-default bg-gray-50 dark:bg-gray-700 h-24"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Owned') }}</label>
                <div class="flex items-center space-x-2">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="store.getters['user/specializations'].includes(selectedSpecialization.id) ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'"
                  >
                    {{ store.getters['user/specializations'].includes(selectedSpecialization.id) ? t('Yes') : t('No') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="showForm = !showForm"
              class="btn-primary w-full sm:w-auto"
            >
              {{ t('Close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 pt-6 px-4 sm:px-6 lg:px-8">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" v-if="loading">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
          <div class="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p class="text-gray-600 dark:text-gray-300 font-medium">{{ t('Loading...') }}</p>
        </div>
      </div>
    </Transition>

    <div class="max-w-7xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Profile') }}</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ t('Manage your personal information and account settings') }}</p>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Personal Information') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Name') }}</label>
              <input
                v-model="currentPersonalia.name"
                type="text"
                maxlength="24"
                class="input-default w-full"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Callsign') }}</label>
              <input
                v-model="currentPersonalia.callSign"
                type="text"
                maxlength="8"
                class="input-default w-full"
                placeholder="e.g. MD-1"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Function') }}</label>
              <input
                v-model="currentPersonalia.role"
                disabled
                readonly
                type="text"
                class="input-default w-full bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Specializations') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <div
              v-for="specialization in store.getters['servervars/specializations'].filter((s) => store.getters['user/specializations'].includes(s.id))"
              :key="specialization.id"
              @click="showForm = !showForm; selectedSpecialization = specialization"
              class="px-3 py-2 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light cursor-pointer transition-transform hover:scale-105 text-center"
            >
              <span class="text-sm font-medium">{{ specialization.label }}</span>
            </div>

            <div
              v-for="specialization in store.getters['servervars/specializations'].filter((s) => !store.getters['user/specializations'].includes(s.id))"
              :key="specialization.id"
              @click="showForm = !showForm; selectedSpecialization = specialization"
              class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-center"
            >
              <span class="text-sm font-medium">{{ specialization.label }}</span>
            </div>
          </div>

          <div v-if="!store.getters['servervars/specializations'].length" class="text-gray-500 dark:text-gray-400 text-center py-4">
            {{ t('No specializations available') }}
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            <i class="fas fa-map-marker-alt mr-2"></i>
            {{ t('GPS') }}
          </h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400 mr-2">{{ t('Your GPS ID') }}:</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ store.getters['user/GPS'] ? store.getters['user/GPS'].GPSid ?? t('Unknown') : t('Unknown') }}
              </span>
              <button
                @click="changeGPSid()"
                class="ml-2 text-primary hover:text-primary-dark focus:outline-none transition-colors"
                :disabled="refreshingGPS"
              >
                <i :class="['fas fa-sync-alt', refreshingGPS ? 'animate-spin' : '']"></i>
              </button>
            </div>

            <div class="flex flex-col space-y-1">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('Last data') }}:</span>
              <span class="font-medium text-gray-900 dark:text-white">
                {{ store.getters['user/GPS'] ? store.getters['user/GPS'].datetime ? store.getters['user/GPS'].datetime.split('T')[0] + ' ' + store.getters['user/GPS'].datetime.split('T')[1].substring(0, 5) : t('Unknown') : t('Unknown') }}
              </span>
            </div>

            <div class="flex flex-col space-y-1">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('Latest known location') }}:</span>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 grid grid-cols-2 gap-3">
                <div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">X:</span>
                  <span class="block font-medium text-gray-900 dark:text-white">
                    {{ store.getters['user/GPS'] ? store.getters['user/GPS'].x ?? t('Unknown') : t('Unknown') }}
                  </span>
                </div>
                <div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Y:</span>
                  <span class="block font-medium text-gray-900 dark:text-white">
                    {{ store.getters['user/GPS'] ? store.getters['user/GPS'].y ?? t('Unknown') : t('Unknown') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Preferences') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Language') }}</label>
              <select class="input-default w-full" v-model="currentPersonalia.language">
                <option value="nl">{{ t('Dutch') }}</option>
                <option value="en">{{ t('English') }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Account') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Username') }}</label>
              <input
                type="text"
                class="input-default w-full"
                maxlength="16"
                v-model="currentPersonalia.username"
                placeholder="Your username"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Change password') }}</label>
              <input
                type="password"
                class="input-default w-full"
                v-model="currentPersonalia.password"
                :placeholder="t('new password')"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="p-6 flex justify-end space-x-4">
          <button @click="handleCancel()" class="btn-danger-inverted">
            {{ t('Cancel') }}
          </button>
          <button @click="handleSave()" class="btn-primary">
            {{ t('Save Changes') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
