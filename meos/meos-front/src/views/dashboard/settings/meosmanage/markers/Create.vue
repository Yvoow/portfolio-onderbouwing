<script setup lang="ts">
import { ref, onBeforeMount, inject, Ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Map, TileLayer } from 'leaflet'
import { useRoute, useRouter } from 'vue-router';
import axios, { AxiosStatic } from 'axios';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const store = useStore();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const api: AxiosStatic = inject('axios', axios);
const mouseCoords = ref({ x: 0, y: 0 });

const newMarker = ref({
  title: '',
  desc: '',
  type: 'marker',
  x: 0,
  y: 0,
  circleRadius: 25,
  color: '',
});

const allTypes = [
  {
    name: t('Marker'),
    value: 'marker',
  },
  {
    name: t('Circle'),
    value: 'circle',
  },
]

const handleSave = async () => {
  if (newMarker.value.title === '' || newMarker.value.desc === '') {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Fill in all fields')
    })
    return;
  }
  if (newMarker.value.type === 'circle' && newMarker.value.circleRadius === 0) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Fill in a radius')
    })
    return;
  }

  try {
    loading.value = true;
    const response = await api.post('createMarker', newMarker.value);
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Marker created')
      });
      router.push({ name: 'settings.meosmanage' });
      loading.value = false;
    }
  } catch (error) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Something went wrong while creating the marker')
    });
    loading.value = false;
  }
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
    newMarker.value.x = e.latlng.lng;
    newMarker.value.y = e.latlng.lat;
    setNewMarker();
  })

  map.value.on('mousemove', (e) => {
    mouseCoords.value = { x: e.latlng.lng, y: e.latlng.lat }
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
    if (newMarker.value.type === 'circle') {
      L.circle([newMarker.value.y, newMarker.value.x], {
        color: newMarker.value.color,
        fillColor: newMarker.value.color,
        fillOpacity: 0.5,
        radius: newMarker.value.circleRadius ?? 25,
      }).addTo(map.value);
    } else {
      L.marker([newMarker.value.y, newMarker.value.x]).addTo(map.value);
    }
  }
}

watch(() => newMarker.value.type, () => {
  setNewMarker();
});

watch(() => newMarker.value.circleRadius, () => {
  setNewMarker();
});

watch(() => newMarker.value.color, () => {
  setNewMarker();
});

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

    <div class="max-w-6xl mx-auto">
      <div class="flex items-center mb-6">
        <button
          @click="router.push({ name: 'settings.meosmanage' })"
          class="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('Create Map Marker') }}</h1>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Marker Information') }}</h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Title') }}<span class="text-red-500 ml-0.5">*</span>
              </label>
              <input
                v-model="newMarker.title"
                type="text"
                maxlength="12"
                class="input-default w-full"
                :placeholder="t('Enter marker title')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Description') }}<span class="text-red-500 ml-0.5">*</span>
              </label>
              <input
                v-model="newMarker.desc"
                type="text"
                class="input-default w-full"
                :placeholder="t('Enter marker description')"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Type') }}<span class="text-red-500 ml-0.5">*</span>
              </label>
              <select v-model="newMarker.type" class="input-default w-full">
                <option v-for="type in allTypes" :key="type.value" :value="type.value">
                  {{ type.name }}
                </option>
              </select>
            </div>

            <div v-if="newMarker.type === 'circle'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Radius') }}
              </label>
              <input
                v-model="newMarker.circleRadius"
                type="number"
                max="400"
                class="input-default w-full"
                :placeholder="t('Enter radius')"
              />
            </div>

            <div v-if="newMarker.type === 'circle'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Color') }}
              </label>
              <select v-model="newMarker.color" class="input-default w-full">
                <option value="red">{{ t('Red') }}</option>
                <option value="blue">{{ t('Blue') }}</option>
                <option value="green">{{ t('Green') }}</option>
                <option value="yellow">{{ t('Yellow') }}</option>
                <option value="purple">{{ t('Purple') }}</option>
                <option value="black">{{ t('Black') }}</option>
                <option value="white">{{ t('White') }}</option>
                <option value="orange">{{ t('Orange') }}</option>
                <option value="pink">{{ t('Pink') }}</option>
                <option value="brown">{{ t('Brown') }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Map Location') }}</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ t('Click on the map to set marker position') }}</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('X Coordinate') }}
              </label>
              <input
                readonly
                disabled
                v-model="newMarker.x"
                type="number"
                class="input-default w-full bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ t('Y Coordinate') }}
              </label>
              <input
                readonly
                disabled
                v-model="newMarker.y"
                type="number"
                class="input-default w-full bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>

          <div id="map" class="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"></div>
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
