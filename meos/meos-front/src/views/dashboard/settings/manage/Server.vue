<script setup lang="ts">
import { onBeforeMount, ref, Ref, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios, { AxiosStatic } from 'axios';
import { Disclosure, DisclosureButton, DisclosurePanel, Switch } from '@headlessui/vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useStore();
const router = useRouter();
const api: AxiosStatic = inject('axios', axios);
const users: Ref<any[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const licensecolumntype = ref('standard');
const redeemingcode = ref(false);
const systemData = ref({
  name: '',
  language: 'en',
  database: {
    host: '127.0.0.1',
    user: 'root',
    database: 'fivemserver',
    password: '',
    userstable: {
      name: 'users',
      identifiercolumn: 'identifier',
      firstnamecolumn: 'firstname',
      lastnamecolumn: 'lastname',
      phonecolumn: 'phone_number',
      dateofbirthcolumn: 'dateofbirth',
      sexcolumn: 'sex',
      lengthcolumn: 'height',
      jobcolumn: 'job',
    },
    ownedvehiclestable: {
      name: 'owned_vehicles',
      ownercolumn: 'owner',
      platecolumn: 'plate',
    },
    jobstable: {
      name: 'jobs',
      namecolumn: 'name',
      labelcolumn: 'label',
    },
    licensestable: {
      name: 'user_licenses',
      licensecolumntype: 'standard',
      useridcolumn: 'owner',
      licensecolumn: 'type',
      carLicense: 'car',
      bikeLicense: 'bike',
      truckLicense: 'truck',
    },
  },
})

const fetchData = async() => {
  loading.value = true;
  try {
    const response = await api.get('/GetSystemData');
    if (response.status === 200) {
      systemData.value = {
        ...systemData.value,
        ...response.data,
        database: {
          ...systemData.value.database,
          ...response.data.database,
          userstable: {
            ...systemData.value.database.userstable,
            ...response.data.database.userstable,
          },
          ownedvehiclestable: {
            ...systemData.value.database.ownedvehiclestable,
            ...response.data.database.ownedvehiclestable,
          },
          jobstable: {
            ...systemData.value.database.jobstable,
            ...response.data.database.jobstable,
          },
          licensestable: {
            ...systemData.value.database.licensestable,
            ...response.data.database.licensestable,
          },
        },
      }
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: 'Er is iets misgegaan bij het ophalen van de data'
    });
  }
  loading.value = false;
}

onBeforeMount(() => {
  if (!store.getters['user/serverAdmin']) {
    router.push({ name: 'not-found' });
  }
  fetchData();
});

const handleSave = async() => {
  loading.value = true;
  try {
    const response = await api.post('/PatchServer', {
      name: systemData.value.name,
      language: systemData.value.language,
      database: systemData.value.database
    });
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: 'Database gegevens bijgewerkt'
      });
      fetchData();
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: 'Er is iets misgegaan bij het aanpassen van de database gegevens'
    });
  }
  loading.value = false;
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
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Server Management') }}</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ t('Configure your server settings and database connections') }}</p>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            <i class="fas fa-cog mr-2"></i>
            {{ t('MEOS Settings') }}
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Name') }}</label>
              <input
                v-model="systemData.name"
                type="text"
                maxlength="24"
                class="input-default w-full"
                placeholder="Name of your MEOS"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Language') }}</label>
              <select v-model="systemData.language" class="input-default w-full">
                <option value="en">{{ t('English') }}</option>
                <option value="nl">{{ t('Dutch') }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            <i class="fas fa-database mr-2"></i>
            {{ t('Database Connection') }}
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Host') }}</label>
              <input
                v-model="systemData.database.host"
                type="text"
                class="input-default w-full"
                placeholder="127.0.0.1"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Database') }}</label>
              <input
                v-model="systemData.database.database"
                type="text"
                class="input-default w-full"
                placeholder="Your database name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('User') }}</label>
              <input
                v-model="systemData.database.user"
                type="text"
                class="input-default w-full"
                placeholder="Database username"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Password') }}</label>
              <input
                v-model="systemData.database.password"
                type="password"
                class="input-default w-full"
                placeholder="Enter new password to change"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ t('Leave empty to keep current password') }}</p>
            </div>
          </div>
        </div>

        <Disclosure as="div" v-slot="{ open }" class="border-t border-gray-200 dark:border-gray-700">
          <DisclosureButton class="px-6 py-4 w-full flex items-center justify-between text-left focus:outline-none">
            <span class="text-base font-medium text-gray-900 dark:text-white">{{ t('Advanced Settings') }}</span>
            <span class="ml-6 flex-shrink-0">
              <i :class="[open ? 'fa-chevron-down' : 'fa-chevron-right', 'fas transition-transform text-gray-500']"></i>
            </span>
          </DisclosureButton>
          <DisclosurePanel class="px-6 pt-2 pb-6">
            <div class="mb-8">
              <h3 class="text-base font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {{ t('Users Table') }}
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Table Name') }}</label>
                  <input
                    v-model="systemData.database.userstable.name"
                    type="text"
                    class="input-default w-full"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Identifier Column') }}</label>
                  <input
                    v-model="systemData.database.userstable.identifiercolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('First Name Column') }}</label>
                  <input
                    v-model="systemData.database.userstable.firstnamecolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Last Name Column') }}</label>
                  <input
                    v-model="systemData.database.userstable.lastnamecolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Phone Column') }}</label>
                  <input
                    v-model="systemData.database.userstable.phonecolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Date of Birth Column') }}</label>
                  <input
                    v-model="systemData.database.userstable.dateofbirthcolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Gender Column') }}</label>
                  <input
                    v-model="systemData.database.userstable.sexcolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Height Column') }}</label>
                  <input
                    v-model="systemData.database.userstable.lengthcolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Job Column') }}</label>
                  <input
                    v-model="systemData.database.userstable.jobcolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>
              </div>
            </div>

            <div class="mb-8">
              <h3 class="text-base font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {{ t('Owned Vehicles Table') }}
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Table Name') }}</label>
                  <input
                    v-model="systemData.database.ownedvehiclestable.name"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Owner Column') }}</label>
                  <input
                    v-model="systemData.database.ownedvehiclestable.ownercolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Plate Column') }}</label>
                  <input
                    v-model="systemData.database.ownedvehiclestable.platecolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>
              </div>
            </div>

            <div class="mb-8">
              <h3 class="text-base font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {{ t('Jobs Table') }}
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Table Name') }}</label>
                  <input
                    v-model="systemData.database.jobstable.name"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Name Column') }}</label>
                  <input
                    v-model="systemData.database.jobstable.namecolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Label Column') }}</label>
                  <input
                    v-model="systemData.database.jobstable.labelcolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-base font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {{ t('Licenses Table') }}
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Table Name') }}</label>
                  <input
                    v-model="systemData.database.licensestable.name"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('User ID Column') }}</label>
                  <input
                    v-model="systemData.database.licensestable.useridcolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('License Column') }}</label>
                  <input
                    v-model="systemData.database.licensestable.licensecolumn"
                    type="text"
                    class="input-default w-full"
                  />
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('License Column Type') }}</label>
                <div class="flex items-center space-x-4">
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      v-model="systemData.database.licensestable.licensecolumntype"
                      value="standard"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('Standard') }}</span>
                  </label>

                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      v-model="systemData.database.licensestable.licensecolumntype"
                      value="json"
                      class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ t('JSON') }}</span>
                  </label>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Car License') }}</label>
                  <input
                    v-model="systemData.database.licensestable.carLicense"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Bike License') }}</label>
                  <input
                    v-model="systemData.database.licensestable.bikeLicense"
                    type="text"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Truck License') }}</label>
                  <input
                    v-model="systemData.database.licensestable.truckLicense"
                    type="text"
                    class="input-default w-full"
                  />
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>

      <!-- Connection Testing (Future feature) -->
      <div class="card mb-6">
        <div class="p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700 dark:text-blue-300">
                {{ t('Make sure your database settings are correct. Incorrect settings may cause connection issues.') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="p-6 flex justify-end space-x-4">
          <button
            @click="router.push({ name: 'dashboard.home' })"
            class="btn-danger-inverted"
          >
            {{ t('Cancel') }}
          </button>
          <button
            @click="handleSave()"
            class="btn-primary"
          >
            {{ t('Save Changes') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
