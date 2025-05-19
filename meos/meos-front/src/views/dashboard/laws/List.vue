<script setup lang="ts">
import { onBeforeMount, ref, Ref, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios, { AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';

const store = useStore();
const router = useRouter();
const { t } = useI18n();
const api: AxiosStatic = inject('axios', axios);
const loading: Ref<boolean> = ref(false);

const laws: Ref<any[]> = ref([]);
const lawCats: Ref<any[]> = ref([]);
const showCategoryModal = ref(false);
const showLawModal = ref(false);
const showDeleteModal = ref(false);
const isEditingCategory = ref(false);
const isEditingLaw = ref(false);
const itemToDelete = ref({ id: '', type: '' });
const newCategory = ref({
  id: null,
  name: '',
  color: '#000000',
});
const newLaw = ref({
  id: null,
  title: '',
  description: '',
  category: '',
  fine: '',
  prison: '',
  active: true,
});

onBeforeMount(async () => {
  loading.value = true;
  try {
    await fetchData();
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Failed to load data')
    });
  }
  loading.value = false;
});

const fetchData = async () => {
  const [lawsResponse, lawCatsResponse] = await Promise.all([
    api.get('/GetLaws'),
    api.get('/GetLawCats')
  ]);
  laws.value = lawsResponse.data;
  lawCats.value = lawCatsResponse.data;
};

const confirmDelete = (id: string, type: string) => {
  itemToDelete.value = { id, type };
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  itemToDelete.value = { id: '', type: '' };
};

const handleDelete = async (id: string) => {
  confirmDelete(id, 'law');
};

const handleDeleteCategory = async (id: string) => {
  confirmDelete(id, 'category');
};

const processDelete = async () => {
  try {
    loading.value = true;
    if (itemToDelete.value.type === 'law') {
      await api.delete(`/DeleteLaw/${itemToDelete.value.id}`);
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Law deleted successfully')
      });
    } else if (itemToDelete.value.type === 'category') {
      await api.delete(`/DeleteLawCat/${itemToDelete.value.id}`);
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Law category deleted successfully')
      });
    }

    // Refresh data after delete
    await fetchData();

  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t(error.response?.data?.message || `Failed to delete ${itemToDelete.value.type}`)
    });
  } finally {
    loading.value = false;
    closeDeleteModal();
  }
};

const openCategoryModal = (category?: any) => {
  if (category) {
    newCategory.value = { ...category };
    isEditingCategory.value = true;
  } else {
    newCategory.value = {
      id: null,
      name: '',
      color: '#000000',
    };
    isEditingCategory.value = false;
  }
  showCategoryModal.value = true;
};

const openLawModal = (law?: any) => {
  if (law) {
    newLaw.value = {
      ...law,
      active: Boolean(law.active)
    };
    isEditingLaw.value = true;
  } else {
    newLaw.value = {
      id: null,
      title: '',
      description: '',
      category: '',
      fine: '',
      prison: '',
      active: true,
    };
    isEditingLaw.value = false;
  }
  showLawModal.value = true;
};

const closeCategoryModal = () => {
  newCategory.value = {
    id: null,
    name: '',
    color: '#000000',
  };
  isEditingCategory.value = false;
  showCategoryModal.value = false;
};

const closeLawModal = () => {
  newLaw.value = {
    id: null,
    title: '',
    description: '',
    category: '',
    fine: '',
    prison: '',
    active: true,
  };
  isEditingLaw.value = false;
  showLawModal.value = false;
};

const handleCreateLaw = async () => {
  try {
    loading.value = true;
    if (isEditingLaw.value) {
      const response = await api.put('/UpdateLaw', newLaw.value);
      // Find and update the existing law in the list
      const lawIndex = laws.value.findIndex(law => law.id === newLaw.value.id);
      if (lawIndex !== -1) {
        // Get fresh data to ensure we have category info
        const updatedLawsResponse = await api.get('/GetLaws');
        laws.value = updatedLawsResponse.data;
      }
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Law updated successfully')
      });
    } else {
      const response = await api.post('/CreateLaw', newLaw.value);
      // Refresh the entire list to get proper category info
      const updatedLawsResponse = await api.get('/GetLaws');
      laws.value = updatedLawsResponse.data;
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Law created successfully')
      });
    }
    closeLawModal();
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t(error.response?.data?.message || 'Failed to save law')
    });
  } finally {
    loading.value = false;
  }
};

const handleCreateCategory = async () => {
  try {
    loading.value = true;
    if (isEditingCategory.value) {
      await api.put('/UpdateLawCat', newCategory.value);
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Law category updated successfully')
      });
    } else {
      await api.post('/CreateLawCat', newCategory.value);
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Law category created successfully')
      });
    }
    // Refresh categories
    const lawCatsResponse = await api.get('/GetLawCats');
    lawCats.value = lawCatsResponse.data;
    closeCategoryModal();
  } catch (error) {
    if (error.response?.status === 409) {
      store.dispatch('notification/show', {
        type: 'error',
        message: t('Law category already exists')
      });
    } else {
      store.dispatch('notification/show', {
        type: 'error',
        message: t('An error occurred while saving the category')
      });
    }
  } finally {
    loading.value = false;
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
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Code of law') }}</h1>
        <div class="flex items-center gap-3">
          <button @click="openCategoryModal()" class="btn-default">
            <i class="fas fa-folder-plus mr-2"></i>
            {{ t('New category') }}
          </button>
          <button @click="openLawModal()" class="btn-primary">
            <i class="fas fa-file-circle-plus mr-2"></i>
            {{ t('New law') }}
          </button>
        </div>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Law Categories') }}</h2>
        </div>

        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Name') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Color') }}
                  </th>
                  <th scope="col" class="relative px-6 py-3 text-right">
                    <span class="sr-only">{{ t('Actions') }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="category in lawCats" :key="category.id" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm truncate max-w-[200px] font-medium text-gray-900 dark:text-white">
                      {{ category.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="w-6 h-6 rounded-full mr-2 border border-gray-300 dark:border-gray-600"
                        :style="{ backgroundColor: category.color }"
                      ></div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">{{ category.color }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="openCategoryModal(category)"
                      class="text-primary hover:text-primary-dark mr-3"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="handleDeleteCategory(category.id)"
                      class="text-danger hover:text-danger-dark"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>

                <tr v-if="lawCats.length === 0">
                  <td colspan="3" class="px-6 py-8 text-center">
                    <div class="flex flex-col items-center">
                      <i class="fas fa-folder-open text-gray-400 text-4xl mb-4"></i>
                      <p class="text-gray-500 dark:text-gray-400 mb-4">{{ t('No categories found') }}</p>
                      <button @click="openCategoryModal()" class="btn-primary">
                        {{ t('Create New Category') }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Laws') }}</h2>
        </div>

        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Title') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Category') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Fine') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Prison') }}
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ t('Status') }}
                  </th>
                  <th scope="col" class="relative px-6 py-3 text-right">
                    <span class="sr-only">{{ t('Actions') }}</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="law in laws" :key="law.id" class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ law.title }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ law.description }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex truncate max-w-[200px] items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :style="{ backgroundColor: `${law.categoryColor}30`, color: law.categoryColor }"
                    >
                      {{ law.categoryName }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ law.fine ? `$${law.fine}` : t('None') }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ law.prison ? law.prison : t('None') }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="law.active ? 'badge-success' : 'badge-danger'">
                      {{ law.active ? t('Active') : t('Inactive') }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="openLawModal(law)"
                      class="text-primary hover:text-primary-dark mr-3"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="handleDelete(law.id)"
                      class="text-danger hover:text-danger-dark"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>

                <!-- Empty state -->
                <tr v-if="laws.length === 0">
                  <td colspan="6" class="px-6 py-8 text-center">
                    <div class="flex flex-col items-center">
                      <i class="fas fa-gavel text-gray-400 text-4xl mb-4"></i>
                      <p class="text-gray-500 dark:text-gray-400 mb-4">{{ t('No laws found') }}</p>
                      <button @click="openLawModal()" class="btn-primary">
                        {{ t('Create New Law') }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="#app">
      <div v-if="showCategoryModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ isEditingCategory ? t('Edit Category') : t('New Category') }}
            </h2>
            <button @click="closeCategoryModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Name') }}
              </label>
              <input
                v-model="newCategory.name"
                type="text"
                class="input-default w-full"
                :placeholder="t('Enter category name')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Color') }}
              </label>
              <input
                v-model="newCategory.color"
                type="color"
                class="h-10 w-full rounded-lg border dark:border-gray-600 border-gray-300"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button @click="closeCategoryModal" class="btn-default">
                {{ t('Cancel') }}
              </button>
              <button @click="handleCreateCategory" class="btn-primary">
                {{ isEditingCategory ? t('Update') : t('Create') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="#app">
      <div v-if="showLawModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl w-full">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ isEditingLaw ? t('Edit Law') : t('New Law') }}
            </h2>
            <button @click="closeLawModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Title') }}
              </label>
              <input
                v-model="newLaw.title"
                type="text"
                class="input-default w-full"
                :placeholder="t('Enter law title')"
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Description') }}
              </label>
              <textarea
                v-model="newLaw.description"
                rows="3"
                class="input-default w-full"
                :placeholder="t('Enter law description')"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Category') }}
              </label>
              <select v-model="newLaw.category" class="input-default w-full">
                <option value="">{{ t('Select category') }}</option>
                <option v-for="category in lawCats" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Fine') }}
              </label>
              <input
                v-model="newLaw.fine"
                type="number"
                min="0"
                class="input-default w-full"
                :placeholder="t('Enter fine amount')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Prison Time') }}
              </label>
              <input
                v-model="newLaw.prison"
                type="number"
                min="0"
                class="input-default w-full"
                :placeholder="t('Enter prison time')"
              />
            </div>

            <div class="md:col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="activeCheckbox"
                class="w-4 h-4 text-primary focus:ring-primary rounded"
                v-model="newLaw.active"
              />
              <label for="activeCheckbox" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('Active') }}
              </label>
            </div>

            <div class="md:col-span-2 flex justify-end space-x-3 pt-4">
              <button @click="closeLawModal" class="btn-default">
                {{ t('Cancel') }}
              </button>
              <button @click="handleCreateLaw" class="btn-primary">
                {{ isEditingLaw ? t('Update') : t('Create') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="#app">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ t('Confirm Delete') }}
            </h2>
            <button @click="closeDeleteModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="space-y-4">
            <p class="text-gray-700 dark:text-gray-300">
              {{ itemToDelete.type === 'law' ? t('Are you sure you want to delete this law?') : t('Are you sure you want to delete this category? This may affect laws assigned to it.') }}
            </p>

            <div class="flex justify-end space-x-3 pt-4">
              <button @click="closeDeleteModal" class="btn-default">
                {{ t('Cancel') }}
              </button>
              <button @click="processDelete" class="btn-danger">
                {{ t('Delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
