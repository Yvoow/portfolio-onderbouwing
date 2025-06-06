<script setup lang="ts">
import { ref, onBeforeMount, inject, Ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import axios, { AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const api: AxiosStatic = inject('axios', axios);
const specializationData = ref({});

const handleSave = async() => {
  if (specializationData.value.label === '' || specializationData.value.desc === '') {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Fill in all fields')
    });
    return;
  }

  try {
    loading.value = true;
    const response = await api.post('PatchSpecialization/' + route.params.id, specializationData.value);
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Specialization updated')
      });
      router.push({ name: 'settings.meosmanage' });
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while updating the specialization')
    });
  }
  loading.value = false;
}

onBeforeMount(() => {
  if (!store.getters['user/meosAdmin'] && !store.getters['user/serverAdmin']) {
    router.push({ name: 'not-found' });
  }
  const spec = store.getters['servervars/specializations'].find((spec) => spec.id === route.params.id);
  if (spec) {
    specializationData.value = spec;
  } else {
    router.push({ name: 'not-found' });
  }
});

const handleDelete = async () => {
  try {
    loading.value = true;
    const response = await api.post('DeleteSpecialization/' + route.params.id);
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Specialization deleted')
      });
      router.push({ name: 'settings.meosmanage' });
      loading.value = false;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong')
    });
    loading.value = false;
  }
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

    <div class="max-w-3xl mx-auto">
      <div class="flex items-center mb-6">
        <button
          @click="router.push({ name: 'settings.meosmanage' })"
          class="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Edit Specialization') }}</h1>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Specialization Information') }}</h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Name') }}</label>
              <input
                v-model="specializationData.label"
                type="text"
                maxlength="20"
                class="input-default w-full"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Description') }}</label>
              <textarea
                v-model="specializationData.desc"
                rows="3"
                class="input-default w-full"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="p-6 flex justify-between">
          <button
            @click="handleDelete()"
            class="btn-danger"
          >
            {{ t('Delete') }}
          </button>

          <div class="flex space-x-4">
            <button
              @click="router.push({ name: 'settings.meosmanage' })"
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
