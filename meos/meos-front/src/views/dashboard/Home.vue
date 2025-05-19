<script setup lang="ts">
import { ref, Ref, inject, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
import axios, { AxiosStatic } from 'axios';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const store = useStore();
const loading: Ref<boolean> = ref(false);
const api: AxiosStatic = inject('axios', axios);
const router = useRouter();
const { t } = useI18n();
const publicPath = window.location.origin;
const reports: Ref<any[]> = ref([]);
const vtas: Ref<any[]> = ref([]);
const totalReports: Ref<number> = ref(0);
const totalPunishments: Ref<number> = ref(0);

const fetchDashboard = async() => {
  loading.value = true;
  try {
    const response = await api.get('/GetDashboard');
    if (response.status === 200) {
      reports.value = response.data.reports;
      vtas.value = response.data.vtas;
      totalReports.value = response.data.totalReports;
      totalPunishments.value = response.data.totalPunishments;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching the dashboard')
    });
  }
  loading.value = false;
}

onBeforeMount(() => fetchDashboard());

const dateToLocale = (date: string) => {
  return new Date(date).toLocaleDateString();
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
      <div class="card mb-6 flex items-center p-6">
        <div class="flex items-center">
          <img alt="roleicon" v-if="store.getters['user/roleicon']" class="w-14 h-14 object-contain" :src="`${publicPath}/badges/${store.getters['user/roleicon']}`" />
          <img alt="roleicon" v-else class="w-14 h-14 object-contain dark:invert" :src="`${publicPath}/zwart.png`" />
          <div class="ml-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('Welcome') }} {{ store.getters['user/name'] }} - {{ store.getters['user/callsign'] }}</h2>
            <p class="text-gray-500 dark:text-gray-400">{{ t('Function') }}: {{ store.getters['user/role'] ?? t('Unknown') }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 space-y-6">
          <div class="card">
            <div class="px-6 py-4 border-b dark:border-gray-700 border-gray-200">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Recent reports') }}</h3>
            </div>
            <div class="overflow-hidden">
              <div v-if="reports.length < 1" class="flex justify-center items-center py-12">
                <p class="text-gray-500 dark:text-gray-400">{{ t('No recent reports...') }}</p>
              </div>
              <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('Date') }}</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('Subject') }}</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('Author') }}</th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">{{ t('View') }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="report in reports" :key="report.id" @click="router.push({ name: 'reports.view', params: { id: report.id }})" class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ dateToLocale(report.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                      {{ report.title }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ report.creatorName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <RouterLink :to="{ name: 'reports.view', params: { id: report.id }}" class="text-primary hover:text-primary-dark">
                        <i class="fas fa-chevron-right"></i>
                      </RouterLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card">
            <div class="px-6 py-4 border-b dark:border-gray-700 border-gray-200">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Outstanding Warrants') }}</h3>
            </div>
            <div class="overflow-hidden">
              <div v-if="vtas.length < 1" class="flex justify-center items-center py-12">
                <p class="text-gray-500 dark:text-gray-400">{{ t('No outstanding warrants') }}</p>
              </div>
              <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('Date') }}</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('Suspect') }}</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ t('Author') }}</th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">{{ t('View') }}</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="warrant in vtas" :key="warrant.id" @click="router.push({ name: 'reports.view', params: { id: warrant.id }})" class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ dateToLocale(warrant.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                      {{ warrant.playerName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ warrant.authorname }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <RouterLink :to="{ name: 'reports.view', params: { id: warrant.id }}" class="text-primary hover:text-primary-dark">
                        <i class="fas fa-chevron-right"></i>
                      </RouterLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <div class="card">
            <div class="px-6 py-4 border-b dark:border-gray-700 border-gray-200">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Quick actions') }}</h3>
            </div>
            <div class="p-4 space-y-3">
              <RouterLink :to="{ name: 'reports.create' }" class="btn-primary w-full flex items-center justify-center">
                <i class="fas fa-file-alt mr-2"></i>
                <span>{{ t('New report') }}</span>
              </RouterLink>

              <button class="btn-default w-full flex items-center justify-center">
                <i class="fas fa-graduation-cap mr-2"></i>
                <span>{{ t('Training request') }}</span>
              </button>
            </div>
          </div>

          <div class="card">
            <div class="px-6 py-4 border-b dark:border-gray-700 border-gray-200">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Statistics') }}</h3>
            </div>
            <div class="p-4">
              <div class="space-y-4">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('Total Reports') }}</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalReports }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('Total Punishments') }}</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalPunishments }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
