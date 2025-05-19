<script setup lang="ts">
import { ref, Ref, onBeforeMount, inject, onMounted, onUnmounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import axios, { AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';

const store = useStore();
const route = useRoute();
const { t } = useI18n();
const router = useRouter();
const player = ref({});
const reports = ref([]);
const loading = ref(false);
const api: AxiosStatic = inject('axios', axios);

const itemsPerPage = 3;
const currentPageReports = ref(1);
const currentPageVeh = ref(1);

const structuredReports = computed(() => {
  const start = (currentPageReports.value - 1) * itemsPerPage;
  const end = currentPageReports.value * itemsPerPage;
  return reports.value.slice(start, end);
});

const structuredVehicles = computed(() => {
  const start = (currentPageVeh.value - 1) * itemsPerPage;
  const end = currentPageVeh.value * itemsPerPage;
  return player.value.vehicles.slice(start, end);
});

const fetchPlayer = async () => {
  loading.value = true;
  try {
    const response = await api.get(`GetPlayer/${route.params.id}`,);
    if (response.status === 200) {
      player.value = response.data;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching')
    });
  }
  loading.value = false;
};

const fetchReports = async () => {
  loading.value = true;
  try {
    const response = await api.get(`GetReports`, {
      params: {
        whereUser: route.params.id
      }
    });
    if (response.status === 200) {
      reports.value = response.data.data;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching')
    });
  }
  loading.value = false;
}

onBeforeMount(() => {
  fetchPlayer();
  fetchReports();
});

const isLargeScreen = ref(window.innerWidth > 1024);

onMounted(() => {
  window.addEventListener('resize', updateScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize);
});

const updateScreenSize = () => {
  isLargeScreen.value = window.innerWidth > 1024;
};

const dateToLocale = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const shareProfile = () => {
  navigator.clipboard.writeText(window.location.href);
  store.dispatch('notification/show', {
    type: 'success',
    message: t('URL copied to clipboard'),
  });
}
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
      <div class="flex items-center mb-6">
        <button
          @click="router.go(-1)"
          class="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Player Details') }}</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Personal Information Card -->
        <div class="col-span-full md:col-span-1 card">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ t('Personal Information') }}</h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Name') }}</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ player.rpname ?? t('Unknown') }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Date of birth') }}</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ player.dateofbirth ?? t('Unknown') }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Phone number') }}</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ player.phone ?? t('Unknown') }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Length') }}</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ player.height ? player.height + 'cm' : t('Unknown') }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Gender') }}</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ player.sex === 'm' ? t('Male') : player.sex === 'f' ? t('Female') : t('Unknown') }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Job') }}</p>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ player.job ?? t('Unknown') }}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Warrant Status') }}</span>
            <span
              :class="player.vta ? 'badge-danger' : 'badge-success'"
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              {{ player.vta ? t('Active Warrant') : t('No Warrant') }}
            </span>
          </div>
        </div>

        <!-- Reports Card -->
        <div class="card col-span-full md:col-span-2 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Reports') }}</h2>
            <div class="flex space-x-2">
              <RouterLink
                :to="{ name: 'reports.create', params: { id: player.identifier }}"
                class="btn-primary text-center py-1 px-3 text-sm"
              >
                <i class="fas fa-file-circle-plus mr-1"></i>
                {{ t('New report') }}
              </RouterLink>
              <button @click="shareProfile()" class="btn-default py-1 px-3 text-sm">
                <i class="fas fa-share-alt"></i>
              </button>
            </div>
          </div>

          <div class="overflow-hidden flex-grow">
            <div v-if="reports.length" class="-mx-4 sm:-mx-6">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ t('Title') }}
                    </th>
                    <th v-if="isLargeScreen" scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ t('Date') }}
                    </th>
                    <th scope="col" class="relative px-4 sm:px-6 py-3">
                      <span class="sr-only">{{ t('View') }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="report in structuredReports" :key="report.id">
                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {{ report.title ?? t('Unknown') }}
                    </td>
                    <td v-if="isLargeScreen" class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ dateToLocale(report.created_at) ?? t('Unknown') }}
                    </td>
                    <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <RouterLink :to="{ name: 'reports.view', params: { id: report.id }}" class="text-primary hover:text-primary-dark">
                        <i class="fas fa-folder w-5 text-center"></i>
                      </RouterLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="flex justify-center items-center h-32">
              <span class="text-gray-500 dark:text-gray-400">{{ t('No reports found') }}</span>
            </div>
          </div>

          <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              @click="currentPageReports--"
              :disabled="currentPageReports <= 1"
              :class="currentPageReports <= 1 ? 'opacity-50 cursor-not-allowed' : ''"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <i class="fas fa-arrow-left mr-1"></i>
              <span v-if="isLargeScreen">{{ t('Previous') }}</span>
            </button>

            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('Page') }} {{ currentPageReports }}
              {{ t('of') }}
              {{ Math.ceil(reports.length / itemsPerPage) }}
            </p>

            <button
              @click="currentPageReports++"
              :disabled="currentPageReports >= Math.ceil(reports.length / itemsPerPage)"
              :class="currentPageReports >= Math.ceil(reports.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span v-if="isLargeScreen">{{ t('Next') }}</span>
              <i class="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>

        <!-- Vehicles Card -->
        <div class="card col-span-full md:col-span-1 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Vehicles') }}</h2>
          </div>

          <div class="overflow-hidden flex-grow">
            <div v-if="player.vehicles && player.vehicles.length" class="flow-root">
              <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                <li v-for="veh in structuredVehicles" :key="veh.plate" class="py-3 flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ veh.plate ?? t('Unknown') }}</span>
                  <RouterLink
                    :to="{ name: 'vehicles.view', params: { plate: veh.plate }}"
                    class="text-primary hover:text-primary-dark"
                  >
                    <i class="fas fa-magnifying-glass"></i>
                  </RouterLink>
                </li>
              </ul>
            </div>
            <div v-else class="flex justify-center items-center h-32">
              <span class="text-gray-500 dark:text-gray-400">{{ t('No vehicles found') }}</span>
            </div>
          </div>

          <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              @click="currentPageVeh--"
              :disabled="currentPageVeh <= 1"
              :class="currentPageVeh <= 1 ? 'opacity-50 cursor-not-allowed' : ''"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <i class="fas fa-arrow-left mr-1"></i>
              <span v-if="isLargeScreen">{{ t('Previous') }}</span>
            </button>

            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('Page') }} {{ currentPageVeh }}
              {{ t('of') }}
              {{ Math.ceil((player.vehicles ? player.vehicles.length : 0) / itemsPerPage) }}
            </p>

            <button
              @click="currentPageVeh++"
              :disabled="currentPageVeh >= Math.ceil((player.vehicles ? player.vehicles.length : 0) / itemsPerPage)"
              :class="currentPageVeh >= Math.ceil((player.vehicles ? player.vehicles.length : 0) / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''"
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span v-if="isLargeScreen">{{ t('Next') }}</span>
              <i class="fas fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
