<script setup lang="ts">
import { onBeforeMount, ref, Ref, inject, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios, { AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useStore();
const router = useRouter();
const api: AxiosStatic = inject('axios', axios);
const loading = ref(false);
const publicPath = window.location.origin
const systemData: Ref<any> = ref(null);

const fetchSystemData = async () => {
  loading.value = true;
  try {
    const response = await api.get('/GetMeosData');
    if (response.status === 200) {
      systemData.value = response.data;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching the system data')
    });
  }
  loading.value = false;
};

onBeforeMount(() => {
  if (!store.getters['user/meosAdmin'] && !store.getters['user/serverAdmin']) {
    router.push({ name: 'not-found' });
  }
  fetchSystemData();
});

const isLargeScreen: Ref<boolean> = ref(window.innerWidth > 1024);
window.addEventListener('resize', () => {
  isLargeScreen.value = window.innerWidth > 1024;
});

const currentPageMarkers = ref(1);
const currentPageSpecializations = ref(1);
const currentPageRoles = ref(1);
const itemsPerPage = 5;

const paginatedMarkers = computed(() => {
  const start = (currentPageMarkers.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return store.getters['servervars/markers'].slice(start, end);
});

const paginatedSpecializations = computed(() => {
  const start = (currentPageSpecializations.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return store.getters['servervars/specializations'].slice(start, end);
});

const paginatedRoles = computed(() => {
  const start = (currentPageRoles.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return store.getters['servervars/roles'].slice(start, end);
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
      <div class="flex items-center mb-6">
        <button
          @click="router.go(-1)"
          class="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('MEOS Management') }}</h1>
      </div>

      <!-- Map Locations -->
      <div class="card mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Map Locations') }}</h2>
          <RouterLink :to="{ name: 'meosmanage.marker.create'}" class="btn-primary text-sm">
            <i class="fas fa-plus mr-1"></i>
            {{ t('New Location') }}
          </RouterLink>
        </div>

        <div class="overflow-hidden">
          <div v-if="store.getters['servervars/markers'] && store.getters['servervars/markers'].length" class="-mx-4 sm:-mx-6">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Name') }}
                  </th>
                  <th v-if="isLargeScreen" scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('X') }}
                  </th>
                  <th v-if="isLargeScreen" scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Y') }}
                  </th>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Type') }}
                  </th>
                  <th scope="col" class="relative px-4 sm:px-6 py-3">
                    <span class="sr-only">{{ t('Edit') }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="marker in paginatedMarkers" :key="marker.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ marker.title ?? t('Unknown') }}
                  </td>
                  <td v-if="isLargeScreen" class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ marker.x ? marker.x.toFixed(2) : t('Unknown')}}
                  </td>
                  <td v-if="isLargeScreen" class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ marker.y ? marker.y.toFixed(2) : t('Unknown') }}
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ marker.type ?? t('Unknown') }}
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <RouterLink
                      :to="{ name: 'meosmanage.marker.edit', params: { id: marker.id }}"
                      class="text-primary hover:text-primary-dark"
                    >
                      <i class="fas fa-pencil-alt"></i>
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="flex justify-center items-center h-32">
            <span class="text-gray-500 dark:text-gray-400">{{ t('No locations found') }}</span>
          </div>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            @click="currentPageMarkers--"
            :disabled="currentPageMarkers <= 1"
            :class="currentPageMarkers <= 1 ? 'opacity-50 cursor-not-allowed' : ''"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i class="fas fa-arrow-left mr-1"></i>
            <span v-if="isLargeScreen">{{ t('Previous') }}</span>
          </button>

          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ t('Page') }} {{ currentPageMarkers }}
            {{ t('of') }}
            {{ Math.ceil(store.getters['servervars/markers'].length / itemsPerPage) || 1 }}
          </p>

          <button
            @click="currentPageMarkers++"
            :disabled="currentPageMarkers >= Math.ceil(store.getters['servervars/markers'].length / itemsPerPage)"
            :class="currentPageMarkers >= Math.ceil(store.getters['servervars/markers'].length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <span v-if="isLargeScreen">{{ t('Next') }}</span>
            <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      <div class="card mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Specializations') }}</h2>
          <RouterLink :to="{ name: 'meosmanage.specialization.create'}" class="btn-primary text-sm">
            <i class="fas fa-plus mr-1"></i>
            {{ t('New Specialization') }}
          </RouterLink>
        </div>

        <div class="overflow-hidden">
          <div v-if="store.getters['servervars/specializations'] && store.getters['servervars/specializations'].length > 0" class="-mx-4 sm:-mx-6">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Name') }}
                  </th>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Description') }}
                  </th>
                  <th scope="col" class="relative px-4 sm:px-6 py-3">
                    <span class="sr-only">{{ t('Edit') }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="specialization in paginatedSpecializations" :key="specialization.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ specialization.label ?? t('Unknown') }}
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ specialization.desc ?? t('Unknown')}}
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <RouterLink
                      :to="{ name: 'meosmanage.specialization.edit', params: { id: specialization.id }}"
                      class="text-primary hover:text-primary-dark"
                    >
                      <i class="fas fa-pencil-alt"></i>
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="flex justify-center items-center h-32">
            <span class="text-gray-500 dark:text-gray-400">{{ t('No specializations found') }}</span>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            @click="currentPageSpecializations--"
            :disabled="currentPageSpecializations <= 1"
            :class="currentPageSpecializations <= 1 ? 'opacity-50 cursor-not-allowed' : ''"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i class="fas fa-arrow-left mr-1"></i>
            <span v-if="isLargeScreen">{{ t('Previous') }}</span>
          </button>

          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ t('Page') }} {{ currentPageSpecializations }}
            {{ t('of') }}
            {{ Math.ceil(store.getters['servervars/specializations'].length / itemsPerPage) || 1 }}
          </p>

          <button
            @click="currentPageSpecializations++"
            :disabled="currentPageSpecializations >= Math.ceil(store.getters['servervars/specializations'].length / itemsPerPage)"
            :class="currentPageSpecializations >= Math.ceil(store.getters['servervars/specializations'].length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <span v-if="isLargeScreen">{{ t('Next') }}</span>
            <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>

      <!-- Roles -->
      <div class="card mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Roles') }}</h2>
          <RouterLink :to="{ name: 'meosmanage.role.create'}" class="btn-primary text-sm">
            <i class="fas fa-plus mr-1"></i>
            {{ t('New Role') }}
          </RouterLink>
        </div>

        <div class="overflow-hidden">
          <div v-if="store.getters['servervars/roles'] && store.getters['servervars/roles'].length > 0" class="-mx-4 sm:-mx-6">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Name') }}
                  </th>
                  <th scope="col" class="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Icon') }}
                  </th>
                  <th scope="col" class="relative px-4 sm:px-6 py-3">
                    <span class="sr-only">{{ t('Edit') }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="role in paginatedRoles" :key="role.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ role.label ?? t('Unknown') }}
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center">
                      <img
                        v-if="role.icon"
                        :src="publicPath + '/badges/' + role.icon"
                        class="h-6 w-6 mr-2"
                        :alt="role.label"
                      >
                      <span v-else>{{ t('Unknown') }}</span>
                    </div>
                  </td>
                  <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <RouterLink
                      :to="{ name: 'meosmanage.role.edit', params: { id: role.id }}"
                      class="text-primary hover:text-primary-dark"
                    >
                      <i class="fas fa-pencil-alt"></i>
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="flex justify-center items-center h-32">
            <span class="text-gray-500 dark:text-gray-400">{{ t('No roles found') }}</span>
          </div>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            @click="currentPageRoles--"
            :disabled="currentPageRoles <= 1"
            :class="currentPageRoles <= 1 ? 'opacity-50 cursor-not-allowed' : ''"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i class="fas fa-arrow-left mr-1"></i>
            <span v-if="isLargeScreen">{{ t('Previous') }}</span>
          </button>

          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ t('Page') }} {{ currentPageRoles }}
            {{ t('of') }}
            {{ Math.ceil(store.getters['servervars/roles'].length / itemsPerPage) || 1 }}
          </p>

          <button
            @click="currentPageRoles++"
            :disabled="currentPageRoles >= Math.ceil(store.getters['servervars/roles'].length / itemsPerPage)"
            :class="currentPageRoles >= Math.ceil(store.getters['servervars/roles'].length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''"
            class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <span v-if="isLargeScreen">{{ t('Next') }}</span>
            <i class="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
