<script setup lang="ts">
import { onBeforeMount, ref, Ref, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios, { all, AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';
import debounce from 'lodash.debounce';

const store = useStore();
const router = useRouter();
const { t } = useI18n();
const api: AxiosStatic = inject('axios', axios);
const allVehicles: Ref<any[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const orderBy: Ref<string> = ref('');
const order: Ref<string> = ref('');
const page: Ref<number> = ref(1);
const perPage: Ref<number> = ref(10);
const total: Ref<number> = ref(0);
const wherePlate: Ref<string> = ref('');
const showsearch: Ref<boolean> = ref(false);

const fetchPlayers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/GetVehicleList', {
      params: {
        orderBy: orderBy.value,
        order: order.value,
        page: page.value,
        perPage: perPage.value,
        wherePlate: wherePlate.value ?? undefined
      }
    });
    if (response.status === 200) {
      allVehicles.value = response.data.data;
      total.value = response.data.total;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('An error occurred while fetching the vehicles')
    });
  }
  loading.value = false;
};

onBeforeMount(() => {
  allVehicles.value = [];
  fetchPlayers();
});

watch([orderBy, order, page, perPage], () => {
  allVehicles.value = [];
  fetchPlayers();
});

const nextPage = () => {
  if (page.value < total.value / perPage.value) {
    page.value++;
  }
};

const PreviousPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};

const isLargeScreen: Ref<boolean> = ref(window.innerWidth > 1024);

window.addEventListener('resize', () => {
  isLargeScreen.value = window.innerWidth > 1024;
});

const handleOrder = (type: string) => {
  if (orderBy.value === type) {
    if (order.value === 'DESC') {
      orderBy.value = '';
      order.value = '';
    } else {
      order.value = 'DESC';
    }
  } else {
    orderBy.value = type;
    order.value = 'ASC';
  }
};

watch(wherePlate, () => {
  searchPlate();
});

const searchPlate = debounce(() => {
  fetchPlayers();
}, 300);

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
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Vehicles') }}</h1>

        <div class="mt-4 sm:mt-0 relative">
          <div class="flex space-x-2">
            <div class="relative">
              <input
                type="text"
                v-model="wherePlate"
                placeholder="Search by plate"
                class="input-default pl-10 pr-4 py-2 w-full sm:w-64"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>

            <button
              @click="handleOrder('plate')"
              class="btn-default flex items-center"
            >
              <span class="mr-2">{{ t('Sort') }}</span>
              <i
                :class="[
                  'fas',
                  orderBy === 'plate' && order === 'ASC' ? 'fa-arrow-up-z-a' : 'fa-arrow-down-z-a',
                  orderBy === 'plate' ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                ]"
              ></i>
            </button>
          </div>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('Plate') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('Owner') }}
                </th>
                <th v-if="isLargeScreen" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('Warrant') }}
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">{{ t('Actions') }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="vehicle in allVehicles" :key="vehicle.ownerid" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ vehicle.plate }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <RouterLink
                    :to="{ name: 'players.view', params: { id: vehicle.ownerid }}"
                    class="text-sm text-primary hover:text-primary-dark"
                  >
                    {{ vehicle.playername }}
                  </RouterLink>
                </td>
                <td v-if="isLargeScreen" class="px-6 py-4 whitespace-nowrap">
                  <span class="badge-success">{{ t('No') }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <RouterLink
                    :to="{ name: 'vehicles.view', params: { plate: vehicle.plate }}"
                    class="text-primary hover:text-primary-dark group inline-flex items-center"
                  >
                    <span class="mr-1">{{ t('View') }}</span>
                    <i class="fas fa-folder group-hover:hidden"></i>
                    <i class="hidden fas fa-folder-open group-hover:inline"></i>
                  </RouterLink>
                </td>
              </tr>

              <tr v-if="allVehicles.length === 0 && !loading">
                <td colspan="4" class="px-6 py-12 text-center">
                  <p class="text-gray-500 dark:text-gray-400">{{ t('No vehicles found') }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="PreviousPage()"
              :disabled="page <= 1"
              :class="[
                'btn-default',
                page <= 1 ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              {{ t('Previous') }}
            </button>
            <button
              @click="nextPage()"
              :disabled="page >= Math.ceil(total / perPage)"
              :class="[
                'btn-default',
                page >= Math.ceil(total / perPage) ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              {{ t('Next') }}
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ t('Showing') }}
                <span class="font-medium">{{ (page - 1) * perPage + 1 }}</span>
                {{ t('to') }}
                <span class="font-medium">{{ Math.min(page * perPage, total) }}</span>
                {{ t('of') }}
                <span class="font-medium">{{ total }}</span>
                {{ t('results') }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <div>
                <label for="perPage" class="sr-only">{{ t('Items per page') }}</label>
                <select
                  v-model="perPage"
                  id="perPage"
                  class="select-editor w-auto text-sm"
                >
                  <option value="10">10</option>
                  <option v-if="total > 24" value="25">25</option>
                  <option v-if="total > 49" value="50">50</option>
                  <option v-if="total > 99" value="100">100</option>
                  <option v-if="total > 249" value="250">250</option>
                  <option :value="total">{{ t('All') }}</option>
                </select>
              </div>

              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="PreviousPage()"
                    :disabled="page <= 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    :class="{ 'opacity-50 cursor-not-allowed': page <= 1 }"
                  >
                    <span class="sr-only">{{ t('Previous') }}</span>
                    <i class="fas fa-chevron-left h-5 w-5"></i>
                  </button>

                  <div class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      v-model="page"
                      type="text"
                      class="w-12 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
                    />
                  </div>

                  <button
                    @click="nextPage()"
                    :disabled="page >= Math.ceil(total / perPage)"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    :class="{ 'opacity-50 cursor-not-allowed': page >= Math.ceil(total / perPage) }"
                  >
                    <span class="sr-only">{{ t('Next') }}</span>
                    <i class="fas fa-chevron-right h-5 w-5"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
