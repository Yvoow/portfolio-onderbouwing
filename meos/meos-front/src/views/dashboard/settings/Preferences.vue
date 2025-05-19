<script setup lang="ts">
import { onBeforeMount, ref, Ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios, { AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';

const store = useStore();
const router = useRouter();
const api: AxiosStatic = inject('axios', axios);
const users: Ref<any[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const rawUserData: Ref<string> = ref('');
const { t } = useI18n();

const fetchData = async() => {
  loading.value = true;
  try {
    const response = await api.get('/GetUserData');
    if (response.status === 200) {
      rawUserData.value = JSON.stringify(response.data);
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching the data')
    });
  }
  loading.value = false;
}

const handleExport = () => {
  fetchData();
  const data = new Blob([rawUserData.value], { type: 'application/json' });
  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'meos-data.json';
  a.click();
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
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Data preferences') }}</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ t('Manage your personal data settings') }}</p>
      </div>

      <div class="card space-y-6">
        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
            {{ t('Your data') }}
          </h2>

          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {{ t('We value transparency regarding your data and give you the opportunity to request it.') }} <br>
            {{ t('Click the button below to export your data.') }}
          </p>

          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {{ t('If you have questions about your data, you can contact the system administrator or directly with the developers.') }}
          </p>

          <div class="flex flex-wrap gap-4">
            <button
              @click="handleExport()"
              class="btn-primary inline-flex items-center"
            >
              <i class="fas fa-download mr-2"></i>
              {{ t('Export my data') }}
            </button>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white pb-3 mb-4">
            {{ t('Privacy information') }}
          </h2>

          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  {{ t('Your data is securely stored and only accessible to authorized staff. We never share your personal information with third parties without your explicit consent.') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
