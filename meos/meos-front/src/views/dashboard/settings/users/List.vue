<script setup lang="ts">
import { onBeforeMount, ref, Ref, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios, { AxiosStatic } from 'axios';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useI18n } from 'vue-i18n';

const store = useStore();
const router = useRouter();
const api: AxiosStatic = inject('axios', axios);
const users: Ref<any[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const orderBy: Ref<string> = ref('');
const order: Ref<string> = ref('');
const page: Ref<number> = ref(1);
const perPage: Ref<number> = ref(20);
const total: Ref<number> = ref(0);
const { t } = useI18n();

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/GetUsersList', {
      params: {
        orderBy: orderBy.value,
        order: order.value,
        page: page.value,
        perPage: perPage.value
      }
    });
    if (response.status === 200) {
      users.value = response.data.data;
      total.value = response.data.total;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching the users')
    });
  }
  loading.value = false;
};

onBeforeMount(() => {
  if (!store.getters['user/meosAdmin']) {
    router.push({ name: 'not-found' });
  }
  fetchUsers();
});

watch([orderBy, order, page, perPage], () => {
  fetchUsers();
});

const nextPage = () => {
  if (page.value < total.value / perPage.value) {
    page.value++;
  }
};

const previousPage = () => {
  if (page.value > 1) {
    page.value--;
  }
};

const getRoleBadge = (user: any) => {
  if (user.serverAdmin) {
    return 'badge-danger';
  } else if (user.meosAdmin) {
    return 'badge-warning';
  } else {
    return 'badge-primary';
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

    <div class="max-w-7xl mx-auto">
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Users') }}</h1>

        <div class="mt-4 sm:mt-0">
          <RouterLink :to="{ name: 'settings.users.create' }" class="btn-primary inline-flex items-center">
            <i class="fas fa-user-plus mr-2"></i>
            {{ t('Create User') }}
          </RouterLink>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('Name') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('Callsign') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('Username') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('Role') }}
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('Function') }}
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">{{ t('Edit') }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400" :title="user.callsign">
                    {{ user.callsign.substring(0, 8) }}<span v-if="user.callsign.length > 8">...</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ user.username }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getRoleBadge(user)">
                    {{ user.serverAdmin ? t('System admin') : (user.meosAdmin ? t('Teamleader') : t('User')) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ user.role }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <RouterLink
                    :to="{ name: 'settings.users.edit', params: { id: user.id }}"
                    class="text-primary hover:text-primary-dark"
                  >
                    <i class="fas fa-edit"></i>
                    <span class="sr-only">{{ t('Edit') }}</span>
                  </RouterLink>
                </td>
              </tr>

              <tr v-if="users.length === 0 && !loading">
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center">
                    <i class="fas fa-users text-gray-400 text-4xl mb-4"></i>
                    <p class="text-gray-500 dark:text-gray-400 mb-4">{{ t('No users found') }}</p>
                    <RouterLink :to="{ name: 'settings.users.create' }" class="btn-primary">
                      {{ t('Create New User') }}
                    </RouterLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
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
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="previousPage"
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
                  @click="nextPage"
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
</template>
