<script setup lang="ts">
import { ref, Ref, onBeforeMount, inject } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import axios, { AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useStore();
const route = useRoute();
const router = useRouter();
const userData = ref({
  name: '',
  callsign: '',
  role: '',
  username: '',
  meosAdmin: false,
  specializations: []
});
const loading = ref(false);
const api: AxiosStatic = inject('axios', axios);
const newPassword = ref('');
const passwordPopup = ref(false);


onBeforeMount(() => {
  if (!store.getters['user/meosAdmin'] && !store.getters['user/serverAdmin']) {
    router.push({ name: 'not-found' });
  }
});

const handleSave = async () => {
  loading.value = true;
  try {
    const response = await api.post(`CreateUser`, userData.value);
    if (response.status === 200) {
      newPassword.value = response.data.password;
      passwordPopup.value = true;
      store.dispatch('notification/show', {
        type: 'success',
        message: t('User created successfully')
      });
    }
  } catch (error) {
    if (error.response.status === 400) {
      store.dispatch('notification/show', {
        type: 'error',
        message: t('All fields must be filled in')
      })
    } else if (error.response.status === 409) {
      store.dispatch('notification/show', {
        type: 'error',
        message: t('Username is already taken')
      });
    }
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while updating the user')
    });
  }
  loading.value = false;
};

const handleSpecialization = (id) => {
  if (userData.value.specializations.includes(id)) {
    userData.value.specializations = userData.value.specializations.filter(specialization => specialization !== id);
  } else {
    userData.value.specializations.push(id);
  }
};

</script>
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 pt-6 px-4 sm:px-6 lg:px-8">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div v-if="passwordPopup" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 sm:mx-0 sm:h-10 sm:w-10">
                  <i class="fas fa-check text-green-600 dark:text-green-400"></i>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    {{ t('User created') }}
                  </h3>
                  <div class="mt-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ t('Please save the generated password. It will not be shown again.') }}
                    </p>
                    <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center">
                      <span class="font-mono text-lg text-gray-800 dark:text-gray-200">{{ newPassword }}</span>
                      <button
                        @click="navigator.clipboard.writeText(newPassword)"
                        class="text-primary hover:text-primary-dark"
                        title="Copy to clipboard"
                      >
                        <i class="fas fa-clipboard"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="passwordPopup = false; router.push({ name: 'settings.users' });"
                class="btn-primary w-full sm:w-auto"
              >
                {{ t('Close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

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
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div class="flex items-center space-x-3">
          <button
            @click="router.push({ name: 'settings.users' })"
            class="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            <span>{{ t('Back to users') }}</span>
          </button>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Create User') }}</h1>
        </div>
      </div>

      <!-- User Information -->
      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('User Information') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Name') }}
              </label>
              <input
                v-model="userData.name"
                type="text"
                maxlength="24"
                class="input-default w-full"
                placeholder="Full name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Callsign') }}
              </label>
              <input
                v-model="userData.callsign"
                type="text"
                maxlength="8"
                class="input-default w-full"
                placeholder="e.g. MD-1"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Function') }}
              </label>
              <select v-model="userData.role" class="input-default w-full">
                <option value="" disabled selected>{{ t('Select a function') }}</option>
                <option v-for="role in store.getters['servervars/roles']" :key="role.id" :value="role.id">
                  {{ role.label }}
                </option>
                <option v-if="store.getters['servervars/roles'].length === 0" disabled value="0">
                  {{ t('No functions found') }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Username') }}
              </label>
              <input
                v-model="userData.username"
                type="text"
                maxlength="16"
                class="input-default w-full"
                placeholder="Login username"
              />
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="meosAdmin"
                v-model="userData.meosAdmin"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
              />
              <label for="meosAdmin" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('Administrator') }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Specializations -->
      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Specializations') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <div
              v-for="specialization in store.getters['servervars/specializations']"
              :key="specialization.id"
              @click="handleSpecialization(specialization.id)"
              class="px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer text-center"
              :class="[
                userData.specializations && userData.specializations.includes(specialization.id)
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light border-primary/40'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              <span class="text-sm font-medium">{{ specialization.label }}</span>
            </div>

            <div v-if="store.getters['servervars/specializations'].length === 0" class="col-span-full flex justify-center items-center p-4 text-gray-500 dark:text-gray-400">
              {{ t('No specializations found') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card mb-6">
        <div class="p-6 flex justify-end space-x-4">
          <button
            @click="router.push({ name: 'settings.users' })"
            class="btn-danger-inverted"
          >
            {{ t('Cancel') }}
          </button>
          <button
            @click="handleSave()"
            class="btn-primary"
          >
            {{ t('Create User') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
