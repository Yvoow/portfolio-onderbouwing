<script setup lang="ts">
import { ref, onBeforeMount, inject, Ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import axios, { AxiosStatic } from 'axios';
import { Listbox, ListboxButton, ListboxLabel, ListboxOption } from '@headlessui/vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const api: AxiosStatic = inject('axios', axios);
const publicPath = window.location.origin
const showIconModal = ref(false);

const newRole = ref({
  label: '',
  icon: 'Aspirant.png',
});

const icons = [
  { name: 'Pol 00', img: 'InOpleiding.png'},
  { name: 'Pol 01', img: 'Aspirant.png'},
  { name: 'Pol 02', img: 'Surveillant.png'},
  { name: 'Pol 03', img: 'Agent.png'},
  { name: 'Pol 04', img: 'Hoofdagent.png'},
  { name: 'Pol 05', img: 'Brigadier.png'},
  { name: 'Pol 06', img: 'Inspecteur.png'},
  { name: 'Pol 07', img: 'Hoofdinspecteur.png'},
  { name: 'Pol 08', img: 'Commissaris.png'},
  { name: 'Pol 09', img: 'Hoofdcommisaris.png'},
  { name: 'Pol 10', img: 'EersteHoofdcommissaris.png'},
  // mar
  { name: 'Mar 00', img: 'mar00.png'},
  { name: 'Mar 01', img: 'mar01.png'},
  { name: 'Mar 02', img: 'mar02.png'},
  { name: 'Mar 03', img: 'mar03.png'},
  { name: 'Mar 04', img: 'mar04.png'},
  { name: 'Mar 05', img: 'mar05.png'},
  { name: 'Mar 06', img: 'mar06.png'},
  { name: 'Mar 07', img: 'mar07.png'},
  { name: 'Mar 08', img: 'mar08.png'},
  { name: 'Mar 09', img: 'mar09.png'},
  { name: 'Mar 10', img: 'mar10.png'},
  { name: 'Mar 11', img: 'mar11.png'},
  { name: 'Mar 12', img: 'mar12.png'},
  { name: 'Mar 13', img: 'mar13.png'},
  { name: 'Mar 14', img: 'mar14.png'},
  { name: 'Mar 15', img: 'mar15.png'},
  { name: 'Mar 16', img: 'mar16.png'},
]

const handleSave = async() => {
  if (newRole.value.label === '') {
    store.dispatch('notification/show', {
      type: 'error',
      message: 'Vul alle velden in'
    })
    return;
  }

  try {
    loading.value = true;
    const response = await api.post('CreateRole', newRole.value);
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: 'Rol is aangemaakt'
      });
      router.push({ name: 'settings.meosmanage' });
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: 'Er is iets misgegaan bij het aanmaken van de rol'
    });
  }
  loading.value = false;
}
</script>
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 pt-6 px-4 sm:px-6 lg:px-8">
    <Teleport to="#app">
      <div v-if="showIconModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl w-full">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Choose an icon') }}</h2>
            <button @click="showIconModal = false" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            <div
              v-for="icon in icons"
              :key="icon.img"
              @click="newRole.icon = icon.img; showIconModal = false"
              class="flex flex-col items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img :src="`${publicPath}/badges/${icon.img}`" class="w-10 h-10 mb-1" />
              <p class="text-xs text-gray-500 dark:text-gray-400 text-center">{{ icon.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Create role') }}</h1>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Role Information') }}</h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Name') }}
              </label>
              <input
                v-model="newRole.label"
                type="text"
                maxlength="20"
                class="input-default w-full"
                :placeholder="t('Enter role name')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Badge Icon') }}
              </label>
              <div class="flex items-center space-x-4">
                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                  <img :src="`${publicPath}/badges/${newRole.icon}`" class="w-10 h-10" />
                </div>
                <button @click="showIconModal = true" class="btn-default">
                  {{ t('Change') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="p-6 flex justify-end space-x-4">
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
</template>
