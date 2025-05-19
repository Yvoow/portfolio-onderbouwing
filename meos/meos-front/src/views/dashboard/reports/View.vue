<script setup lang="ts">
import { ref, Ref, onBeforeMount, inject, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios, { AxiosStatic } from 'axios';
import editor from '@/components/editor/editor.vue';
import { useI18n } from 'vue-i18n';
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Map, TileLayer } from 'leaflet'

const store = useStore();
const route = useRoute();
const loading = ref(false);
const router = useRouter();
const players = ref([]);
const officers = ref([]);
const api: AxiosStatic = inject('axios', axios);

const report = ref<{
  suspect?: string;
  suspectName?: string;
  type?: string;
  title?: string;
  text?: string;
  datetime?: string;
  status?: string;
  authorName?: string;
  location: {x: number, y: number};
  laws?: Array<{
    id: string;
    title: string;
    categoryName: string;
    categoryColor: string;
    fine?: number;
    prison?: number;
  }>;
  totals?: {
    fine: string;
    prison: number;
  };
}>({
  location: {
    x: 0,
    y: 0
  }
})
const { t } = useI18n();

const map: Ref<Map | undefined> = ref<Map>()
const mapLayer: Ref<TileLayer | undefined> = ref<TileLayer>()

onBeforeMount(() => {
  if (route.params.id) {
    fetchReport();
  }
  fetchPlayers();
  fetchOfficers();
});

const fetchReport = async () => {
  loading.value = true;
  try {
    const response = await api.get('/GetReport', {
      params: {
        id: route.params.id,
      }
    });
    if (response.status === 200) {
      report.value = response.data;
      // Ensure location property exists
      if (!report.value.location) {
        report.value.location = { x: 0, y: 0 };
      }
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching the report'),
    });
  } finally {
    loading.value = false;
  }
}

const fetchOfficers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/GetUsersList');
    if (response.status === 200) {
      officers.value = response.data.data;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching the officers'),
    });
  }
  loading.value = false;
};

const fetchPlayers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/GetPlayersList');
    if (response.status === 200) {
      players.value = response.data.data;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching the persons'),
    });
  }
  loading.value = false;
};

// Map configuration
const center_x = 117.3;
const center_y = 172.8;
const scale_x = 0.02072;
const scale_y = 0.0205;

const CUSTOM_CRS = L.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    scale: function(zoom) {
        return Math.pow(2, zoom);
    },
    zoom: function(sc) {
        return Math.log(sc) / 0.6931471805599453;
    },
    distance: function(pos1, pos2) {
        var x_difference = pos2.lng - pos1.lng;
        var y_difference = pos2.lat - pos1.lat;
        return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
    },
    transformation: new L.Transformation(scale_x, center_x, -scale_y, center_y),
    infinite: true
});

const initMap = () => {
  loading.value = true
  map.value = L.map('map', {
    attributionControl: false,
    zoomControl: false,
    crs: CUSTOM_CRS,
    preferCanvas: true,
    center: [0, 0],
  }).setView([51.505, -0.09], 23)
  mapLayer.value = new TileLayer('https://storage.googleapis.com/meos/mapStyles/styleAtlas/{z}/{x}/{y}.jpg', {
    minZoom: 0,
    maxZoom: 5,
    noWrap: true,
  }).addTo(map.value)

  setMarker();
  loading.value = false
}

const setMarker = () => {
  if (map.value && report.value.location) {
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.value?.removeLayer(layer);
      }
      if (layer instanceof L.Circle) {
        map.value?.removeLayer(layer);
      }
    });
    L.marker([report.value.location.y, report.value.location.x]).addTo(map.value);
  }
}

onMounted(() => {
  if (route.params.id) {
    // Wait for fetch to complete
    const checkReportLoaded = setInterval(() => {
      if (!loading.value && report.value.location) {
        clearInterval(checkReportLoaded);
        initMap();
      }
    }, 100);

    // Safety timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkReportLoaded);
      if (!map.value) {
        initMap();
      }
    }, 5000);
  } else {
    initMap();
  }
});

const shareReport = () => {
  navigator.clipboard.writeText(window.location.href);
  store.dispatch('notification/show', {
    type: 'success',
    message: t('URL copied to clipboard'),
  });
}

const resolveWarrant = async () => {
  loading.value = true;
  try {
    const response = await api.post('/UpdateReportStatus', {
      id: route.params.id,
      status: 'finished'
    });

    if (response.status === 200) {
      report.value.status = 'finished';
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Warrant has been resolved'),
      });
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Failed to resolve warrant'),
    });
  } finally {
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

    <div class="max-w-7xl mx-auto">
      <div class="flex items-center mb-6">
        <button
          @click="router.go(-1)"
          class="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Report Details') }}</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card mb-6">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Report Information') }}</h2>
            </div>

            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ report.title }}</h3>
                <span v-if="report.type === 'Arrestatiebevel'" :class="{
                  'badge-danger': report.status === 'open',
                  'badge-success': report.status === 'finished'
                }">
                  {{ report.status ? report.status.toUpperCase() : t('UNKNOWN') }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Suspect') }}</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ report.suspectName }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Author') }}</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ report.authorName }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Report Type') }}</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ report.type }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('Date/Time') }}</p>
                  <p class="text-base font-medium text-gray-900 dark:text-white">{{ new Date(report.datetime).toLocaleString() }}</p>
                </div>
              </div>

              <div class="mt-4">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{{ t('Report Content') }}</p>
                <div class="prose dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div v-html="report.text"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-6" v-if="report.laws && report.laws.length > 0">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Charges & Penalties') }}</h2>
            </div>

            <div class="p-6">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {{ t('Charge') }}
                      </th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {{ t('Category') }}
                      </th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {{ t('Fine') }}
                      </th>
                      <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {{ t('Jail Time') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="law in report.laws" :key="law.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ law.title }}</div>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <span
                          class="inline-flex truncate max-w-[200px] items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :style="{ backgroundColor: `${law.categoryColor}30`, color: law.categoryColor }"
                        >
                          {{ law.categoryName }}
                        </span>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">${{ law.fine ?? '0' }}</div>
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap">
                        <div class="text-sm text-gray-900 dark:text-white">
                          {{ law.prison ? law.prison : t('None') }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td colspan="2" class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        {{ t('Total') }}
                      </td>
                      <td class="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        ${{ report.totals ? report.totals.fine : '0' }}
                      </td>
                      <td class="px-4 py-3 truncate max-w-[100px] whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        <span v-if="report.totals && report.totals.prison">
                          {{ report.totals.prison }}
                        </span>
                        <span v-else>{{ t('None') }}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Map & Location -->
        <div class="lg:col-span-1">
          <div class="card mb-6">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Location') }}</h2>
            </div>

            <div class="p-6">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {{ t('Coordinates') }}: X: {{ report.location?.x.toFixed(2) }}, Y: {{ report.location?.y.toFixed(2) }}
              </div>
              <div id="map" class="h-60 w-full rounded-lg shadow-inner bg-gray-100 dark:bg-gray-700"></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card">
            <div class="p-6">
              <div class="flex flex-col space-y-3">
                <button @click="shareReport()" class="btn-default w-full">
                  <i class="fas fa-share-alt mr-2"></i>
                  {{ t('Share Report') }}
                </button>
                <RouterLink
                  :to="{ name: 'players.view', params: { id: report.suspect } }"
                  class="btn-default w-full text-center"
                >
                  <i class="fas fa-user mr-2"></i>
                  {{ t('View Suspect') }}
                </RouterLink>

                <button v-if="report.type === 'Arrestatiebevel' && report.status === 'open'"
                  @click="resolveWarrant()"
                  class="btn-primary w-full text-center">
                  <i class="fas fa-check-circle mr-2"></i>
                  {{ t('Resolve Warrant') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
