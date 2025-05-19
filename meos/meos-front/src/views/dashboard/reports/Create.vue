<script setup lang="ts">
import { ref, Ref, onBeforeMount, inject, onMounted, computed } from 'vue';
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
const { t } = useI18n();
const loading = ref(false);
const router = useRouter();
const players = ref([]);
const officers = ref([]);
const laws = ref([]);
const api: AxiosStatic = inject('axios', axios);
const report = ref({
  suspect: '',
  type: '',
  title: '',
  text: '',
  evidence: '',
  location: {
    x: 0,
    y: 0,
  },
  datetime: new Date().toISOString().slice(0, 16),
  status: 'open',
  officer: store.getters['user/id'] ?? '',
  laws: [],
});

const lawSearch = ref('');
const filteredLaws = computed(() => {
  if (!lawSearch.value) return laws.value;
  const search = lawSearch.value.toLowerCase();
  return laws.value.filter(law =>
    law.name.toLowerCase().includes(search) ||
    law.description.toLowerCase().includes(search)
  );
});

const selectedLaws = computed(() => {
  return laws.value.filter(law => report.value.laws.includes(law.id));
});

const totals = computed(() => {
  const result = selectedLaws.value.reduce((acc, law) => {
    const prisonTime = law.prison ? (typeof law.prison === 'string' ? parseInt(law.prison, 10) : law.prison) : 0;
    const fineAmount = law.fine ? (typeof law.fine === 'string' ? parseInt(law.fine, 10) : law.fine) : 0;

    return {
      fine: acc.fine + fineAmount,
      prison: acc.prison + prisonTime
    };
  }, { fine: 0, prison: 0 });

  return {
    fine: result.fine,
    prison: result.prison
  };
});

const reportTypes = [
  'Aanhouding',
  'Arrestatiebevel',
  'Aangifte',
  'Verhoor',
  'Huiszoeking',
  'Inbeslagname',
  'Overige',
]

onBeforeMount(() => {
  if (route.params.id) {
    report.value.suspect = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  }
  fetchPlayers();
  fetchOfficers();
  fetchLaws();
});

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
      message: t('Something went wrong while fetching')
    });
  }
  loading.value = false;
};

const fetchLaws = async () => {
  loading.value = true;
  try {
    const response = await api.get('/GetLaws');
    if (response.status === 200) {
      laws.value = response.data;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while fetching')
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
      message: t('Something went wrong while fetching')
    });
  }
  loading.value = false;
};

const handleSave = async() => {
  if (!report.value.suspect || !report.value.type || !report.value.title || !report.value.datetime) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Please fill in all required fields'),
    });
    return;
  }
  try {
    loading.value = true;
    // Format the report data with selected laws and totals
    const reportData = {
      ...report.value,
      laws: selectedLaws.value,
      totals: {
        fine: totals.value.fine.toString(),
        prison: totals.value.prison
      }
    };
    const response = await api.post('/CreateReport', reportData);
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Report created successfully'),
      });
      router.push({ name: 'players.view', params: { id: route.params.id } });
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while creating the report'),
    });
  }
  loading.value = false;
}

var X  = 0;
var Y = 0;
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

const map: Ref<Map | undefined> = ref<Map>()
const mapLayer: Ref<TileLayer | undefined> = ref<TileLayer>()
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

  map.value.on('click', (e) => {
    report.value.location.x = e.latlng.lng;
    report.value.location.y = e.latlng.lat;
    setNewMarker();
  })

  loading.value = false
}

const setNewMarker = () => {
  if (map.value) {
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.value.removeLayer(layer);
      }
      if (layer instanceof L.Circle) {
        map.value.removeLayer(layer);
      }
    });
    L.marker([report.value.location.y, report.value.location.x]).addTo(map.value);
  }
}

onMounted(() => {
  initMap();
  setNewMarker();
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
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div class="flex items-center space-x-3">
          <button
            @click="router.push({ name: 'players.view', params: { id: route.params.id } })"
            class="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            <span>{{ t('Back') }}</span>
          </button>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('New Report') }}</h1>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="card">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Basic Information') }}</h2>
            </div>
            <div class="p-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Suspect') }} *</label>
                  <select v-model="report.suspect" class="input-default w-full">
                    <option value="" disabled selected>{{ t('Select a suspect') }}</option>
                    <option v-for="player in players" :key="player.identifier" :value="player.identifier">
                      {{ player.rpname }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Type') }} *</label>
                  <select v-model="report.type" class="input-default w-full">
                    <option value="" disabled selected>{{ t('Select type') }}</option>
                    <option v-for="type in reportTypes" :key="type" :value="type">{{ t(type) }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Title') }} *</label>
                  <input
                    type="text"
                    v-model="report.title"
                    class="input-default w-full"
                    :placeholder="t('Enter report title')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Date and Time') }} *</label>
                  <input
                    type="datetime-local"
                    v-model="report.datetime"
                    class="input-default w-full"
                  />
                </div>

                <div v-if="report.type === 'Arrestatiebevel'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Status') }}</label>
                  <select v-model="report.status" class="input-default w-full">
                    <option value="open">{{ t('Open') }}</option>
                    <option value="finished">{{ t('Finished') }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Officer') }}</label>
                  <select v-model="report.officer" class="input-default w-full">
                    <option v-for="officer in officers" :key="officer.id" :value="officer.id">
                      {{ officer.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Report Text') }}</h2>
            </div>
            <div class="p-6">
              <editor v-model="report.text" />
            </div>
          </div>

          <div class="card">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Location') }}</h2>
            </div>
            <div class="p-6">
              <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('X Coordinate') }}</label>
                  <input
                    type="number"
                    v-model="report.location.x"
                    class="input-default w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('Y Coordinate') }}</label>
                  <input
                    type="number"
                    v-model="report.location.y"
                    class="input-default w-full"
                  />
                </div>
              </div>

              <div id="map" class="h-80 w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"></div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="card">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Violations') }}</h2>
            </div>
            <div class="p-6">
              <div class="mb-4">
                <div class="relative">
                  <input
                    type="text"
                    v-model="lawSearch"
                    class="input-default w-full pl-10"
                    :placeholder="t('Search for laws...')"
                  />
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div class="max-h-96 overflow-auto pr-2 space-y-2">
                <div
                  v-for="law in filteredLaws"
                  :key="law.id"
                  class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  :class="report.laws.includes(law.id) ? 'bg-primary/10 border-primary/30 dark:bg-primary/20 dark:border-primary/40' : ''"
                  @click="report.laws.includes(law.id) ? report.laws = report.laws.filter(id => id !== law.id) : report.laws.push(law.id)"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ law.title }}</h3>
                      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ law.description }}</p>
                    </div>
                    <div class="ml-3 flex-shrink-0">
                      <i
                        :class="[
                          'fas',
                          report.laws.includes(law.id) ? 'fa-check-circle text-primary' : 'fa-circle text-gray-300 dark:text-gray-600'
                        ]"
                      ></i>
                    </div>
                  </div>
                  <div class="mt-2 flex justify-between text-xs">
                    <span class="font-medium text-gray-700 dark:text-gray-300">
                      <i class="fas fa-money-bill-wave mr-1"></i>
                      {{ law.fine ? '$' + law.fine : t('No fine') }}
                    </span>
                    <span class="font-medium text-gray-700 dark:text-gray-300">
                      <i class="fas fa-jail mr-1"></i>
                      {{ law.prison ? law.prison : t('No jail time') }}
                    </span>
                  </div>
                </div>

                <div v-if="filteredLaws.length === 0" class="py-6 text-center">
                  <p class="text-gray-500 dark:text-gray-400">{{ t('No laws found matching your search') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card" v-if="selectedLaws.length > 0">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Totals') }}</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('Total Fine') }}</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">${{ totals.fine }}</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div class="bg-primary h-full" :style="`width: ${Math.min(totals.fine / 5000 * 100, 100)}%`"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('Total Prison Time') }}</span>
                    <span class="text-lg font-bold text-gray-900 dark:text-white">{{ totals.prison }}</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
                    <div class="bg-primary h-full" :style="`width: ${Math.min(totals.prison / 1000 * 100, 100)}%`"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Card -->
          <div class="card">
            <div class="p-6 flex flex-col gap-3">
              <button @click="handleSave()" class="btn-primary w-full flex items-center justify-center">
                <i class="fas fa-save mr-2"></i>
                {{ t('Save Report') }}
              </button>

              <button
                @click="router.push({ name: 'players.view', params: { id: route.params.id } })"
                class="btn-danger-inverted w-full flex items-center justify-center"
              >
                <i class="fas fa-times mr-2"></i>
                {{ t('Cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
