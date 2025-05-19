<script setup lang="ts">
import { ref, Ref, onBeforeMount, inject } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import axios, { AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
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


onBeforeMount(async() => {
  if (!store.getters['user/meosAdmin'] && !store.getters['user/serverAdmin']) {
    router.push({ name: 'not-found' });
  }
  if (!route.params.id) {
    router.push({ name: 'settings.meosmanage' });
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Marker not found')
    });
  }
  try {
    const response = await api.get(`GetUser/${route.params.id}`);
    if (response.status === 200) {
      userData.value = response.data;
    }
  } catch (error) {
    router.push({ name: 'settings.users' });
    store.dispatch('notification/show', {
      type: 'error',
      message: t('User not found')
    });
  }

});

const handleSave = async () => {
  loading.value = true;
  try {
    const response = await api.post(`PatchUser/${route.params.id}`, userData.value);
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: t('User updated successfully')
      });
    }
    router.push({ name: 'settings.users.list' })
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
};

const handleSpecialization = (id) => {
  if (userData.value.specializations.includes(id)) {
    userData.value.specializations = userData.value.specializations.filter(specialization => specialization !== id);
  } else {
    userData.value.specializations.push(id);
  }
};

const handleDelete = async () => {
  const response = await api.delete(`DeleteUser/${route.params.id}`);
  if (response.status === 200) {
    store.dispatch('notification/show', {
      type: 'success',
      message: t('User deleted successfully')
    });
    router.push({ name: 'settings.users.list' });
  } else {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while deleting the user')
    });
  }
};
</script>
<template>
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

    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-6">
        <button
          @click="router.push({ name: 'settings.users.list' })"
          class="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Edit User') }}</h1>
      </div>

      <!-- User Information -->
      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('User Information') }}</h2>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('Name') }}
            </label>
            <input
              v-model="userData.name"
              type="text"
              maxlength="24"
              class="input-default w-full"
              :placeholder="t('Enter name')"
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
              :placeholder="t('Enter callsign')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('Function') }}
            </label>
            <select v-model="userData.role" class="input-default w-full">
              <option v-for="role in store.getters['servervars/roles']" :key="role.id" :value="role.id">
                {{ role.label }}
              </option>
              <option v-if="store.getters['servervars/roles'].length === 0" selected value="0">
                {{ t('No roles found') }}
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
              :placeholder="t('Enter username')"
            />
          </div>

          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="adminCheckbox"
              class="w-4 h-4 text-primary focus:ring-primary rounded"
              v-model="userData.meosAdmin"
            />
            <label for="adminCheckbox" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('Administrator') }}
            </label>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Specializations') }}</h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <button
              v-for="specialization in store.getters['servervars/specializations']"
              :key="specialization.id"
              @click="handleSpecialization(specialization.id)"
              :class="[
                'py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border',
                userData.specializations && userData.specializations.includes(specialization.id)
                  ? 'bg-primary/10 text-primary border-primary'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
            >
              {{ specialization.label }}
            </button>
          </div>

          <div
            v-if="store.getters['servervars/specializations'].length === 0"
            class="flex justify-center items-center h-24 text-gray-500 dark:text-gray-400"
          >
            {{ t('No specializations found') }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="card mb-6">
        <div class="p-6 flex justify-between">
          <button
            @click="handleDelete()"
            class="btn-danger"
          >
            <i class="fas fa-trash-alt mr-2"></i>
            {{ t('Delete') }}
          </button>

          <div class="flex space-x-4">
            <button
              @click="router.push({ name: 'settings.users.list' })"
              class="btn-danger-inverted"
            >
              {{ t('Cancel') }}
            </button>

            <button
              @click="handleSave()"
              class="btn-primary"
            >
              {{ t('Save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
