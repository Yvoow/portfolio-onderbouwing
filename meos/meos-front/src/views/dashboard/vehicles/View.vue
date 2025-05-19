<script setup lang="ts">
import { onBeforeMount, ref, Ref, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios, { AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';

const store = useStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const api: AxiosStatic = inject('axios', axios);

const vehicle: Ref<any> = ref(null);
const loading: Ref<boolean> = ref(false);

const fetchVehicle = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/GetVehicle/${route.params.plate}`);
    if (response.status === 200) {
      vehicle.value = response.data;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('An error occurred while fetching the vehicle')
    });
    router.push({ name: 'vehicles.list' });
  }
  loading.value = false;
};

onBeforeMount(() => {
  fetchVehicle();
});
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

    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div class="flex items-center space-x-3">
          <button
            @click="router.push({ name: 'vehicles.list' })"
            class="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            <span>{{ t('Back to list') }}</span>
          </button>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Vehicle Details') }}</h1>
        </div>
      </div>

      <div v-if="vehicle" class="space-y-6">
        <div class="card overflow-hidden">
          <div class="px-6 py-4 border-b dark:border-gray-700 border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Vehicle Information') }}</h3>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('License Plate') }}</h4>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ vehicle.plate }}</p>
              </div>

              <div class="space-y-2">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Owner') }}</h4>
                <RouterLink
                  :to="{ name: 'players.view', params: { id: vehicle.ownerid }}"
                  class="text-lg font-semibold text-primary hover:text-primary-dark inline-flex items-center"
                >
                  {{ vehicle.playername }}
                  <i class="fas fa-external-link-alt ml-2 text-sm"></i>
                </RouterLink>
              </div>

              <div class="space-y-2">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Search status') }}</h4>
                <div>
                  <span v-if="vehicle.warrant" class="badge-danger">
                    <i class="fas fa-exclamation-triangle mr-1"></i>
                    {{ t('Active') }}
                  </span>
                  <span v-else class="badge-success">
                    <i class="fas fa-check-circle mr-1"></i>
                    {{ t('Inactive') }}
                  </span>
                </div>
              </div>

              <div class="space-y-2">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Owner warrant') }}</h4>
                <div>
                  <span v-if="vehicle.ownerwarrant" class="badge-danger">
                    <i class="fas fa-exclamation-triangle mr-1"></i>
                    {{ t('Active Warrant') }}
                  </span>
                  <span v-else class="badge-success">
                    <i class="fas fa-check-circle mr-1"></i>
                    {{ t('No Warrant') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="px-6 py-4 border-b dark:border-gray-700 border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Actions') }}</h3>
          </div>

          <div class="p-6">
            <div class="flex flex-wrap gap-4">
              <RouterLink
                :to="{ name: 'players.view', params: { id: vehicle.ownerid }}"
                class="btn-primary inline-flex items-center"
              >
                <i class="fas fa-user mr-2"></i>
                {{ t('View Owner Information') }}
              </RouterLink>

              <button class="btn-danger inline-flex items-center">
                <i class="fas fa-search mr-2"></i>
                {{ t('Issue Search') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="card p-12 flex flex-col items-center justify-center">
        <i class="fas fa-car text-gray-400 text-4xl mb-4"></i>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">{{ t('Vehicle not found') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ t('The requested vehicle information could not be found.') }}</p>
        <button @click="router.push({ name: 'vehicles.list' })" class="btn-primary">
          {{ t('Return to vehicle list') }}
        </button>
      </div>
    </div>
  </div>
</template>
