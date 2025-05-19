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
const markerData = ref({});
const mouseCoords = ref({ x: 0, y: 0 });

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

onBeforeMount(() => {
  if (!store.getters['user/meosAdmin'] && !store.getters['user/serverAdmin']) {
    router.push({ name: 'not-found' });
  }
  if (!route.params.id) {
    router.push({ name: 'settings.meosmanage' });
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Marker not found')
    });
  }
  const marker = store.getters['servervars/markers'].find((marker: any) => marker.id === route.params.id);
  if (marker) {
    markerData.value = marker;
  } else {
    router.push({ name: 'settings.meosmanage' });
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Marker not found')
    });
  }
});

const handleSave = async () => {
  if (markerData.value.title === '' || markerData.value.desc === '') {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Fill in all fields')
    })
    return;
  }
  if (markerData.value.type === 'circle' && markerData.value.circleRadius === 0) {
    store.dispatch('notification/show', {
      type: 'error',
      message: t('Fill in a radius')
    })
    return;
  }

  try {
    loading.value = true;
    const response = await api.post('patchMarker/' + route.params.id, markerData.value);
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
      message: t('Something went wrong')
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
    markerData.value.x = e.latlng.lng;
    markerData.value.y = e.latlng.lat;
    setmarkerData();
  })

  map.value.on('mousemove', (e) => {
    mouseCoords.value = { x: e.latlng.lng, y: e.latlng.lat }
  })

  loading.value = false
}

const setmarkerData = () => {
  if (map.value) {
    map.value.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.value.removeLayer(layer);
      }
      if (layer instanceof L.Circle) {
        map.value.removeLayer(layer);
      }
    });
    if (markerData.value.type === 'circle') {
      L.circle([markerData.value.y, markerData.value.x], {
        color: markerData.value.color,
        fillColor: markerData.value.color,
        fillOpacity: 0.5,
        radius: markerData.value.circleRadius ?? 25,
      }).addTo(map.value);
    } else {
      L.marker([markerData.value.y, markerData.value.x]).addTo(map.value);
    }
  }
}

watch(() => markerData.value.type, () => {
  setmarkerData();
});

watch(() => markerData.value.circleRadius, () => {
  setmarkerData();
});

watch(() => markerData.value.color, () => {
  setmarkerData();
});

onMounted(() => {
  initMap();
  setmarkerData();
});

const handleDelete = async () => {
  try {
    loading.value = true;
    const response = await api.post('DeleteMarker/' + route.params.id);
    if (response.status === 200) {
      store.dispatch('notification/show', {
        type: 'success',
        message: t('Marker deleted')
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
  <Header />
  <div class="dark:bg-tertiary-dark bg-tertiary-light flex inset-0">
    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-out duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div class="absolute inset-0 z-50 flex items-center justify-center dark:bg-main-dark/70 bg-main-light/70" v-if="loading">
        <div class="flex flex-col items-center space-y-2">
          <i class="fa-solid fa-spinner animate-spin text-5xl dark:text-text-dark text-text-light"/>
        </div>
      </div>
    </Transition>

    <div class="absolute py-16 w-full">
      <div class="md:mx-40 mx-10 ml-20 justify-center">
        <h1 class="font-medium dark:text-text-dark text-text-light">{{ t('Edit marker') }}</h1>
        <div class="w-full dark:bg-secondary-dark bg-secondary-light rounded-lg">
          <div class="flex flex-col md:flex-row p-4">
            <div class="grid md:grid-cols-2  w-full gap-4">
              <div class="relative">
                <label class="input-label-default">{{ t('Title') }}<span class="text-red-500 ml-0.5">*</span></label>
                <input v-model="markerData.title" type="text" maxlength="12" class="input-default" />
              </div>
              <div class="relative">
                <label class="input-label-default">{{ t('Description') }}<span class="text-red-500 ml-0.5">*</span></label>
                <input v-model="markerData.desc" type="text" class="input-default" />
              </div>
              <div class="relative">
                <label class="input-label-default">{{ t('Type') }}<span class="text-red-500 ml-0.5">*</span></label>
                <select v-model="markerData.type" class="input-default">
                  <option v-for="type in allTypes" :key="type.value" :value="type.value">{{ type.name }}</option>
                </select>
              </div>
              <div v-if="markerData.type === 'circle'" class="relative">
                <label class="input-label-default">{{ t('Radius') }}</label>
                <input v-model="markerData.circleRadius" type="number" max="400" class="input-default" />
              </div>
              <div v-if="markerData.type === 'circle'" class="relative">
                <label class="input-label-default">{{ t('Color') }}</label>
                <select v-model="markerData.color" class="input-default">
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

        <div class="mt-4 pb-4 w-full dark:bg-secondary-dark bg-secondary-light rounded-lg">
            <div class="flex w-full">
              <div class="relative w-1/2 m-4">
              <label class="input-label-default">{{ t('X') }}</label>
              <input disabled readonly v-model="markerData.x" type="number" class="input-default" />
            </div>
            <div class="relative w-1/2 m-4">
              <label class="input-label-default">{{ t('Y') }}</label>
              <input disabled readonly v-model="markerData.y" type="number" class="input-default" />
            </div>
          </div>
          <div class="px-4">
            <label class="dark:text-text-dark-secondary text-text-light-secondary">{{ t('Map') }}</label>
            <div id="map" class="rounded w-full min-h-52 md:min-h-96 dark:bg-tertiary-dark bg-tertiary-light"></div>
          </div>
        </div>

        <div class="mt-4 w-full dark:bg-secondary-dark bg-secondary-light rounded-lg">
          <div class="flex justify-between p-4">
            <div class="flex space-x-4">
              <button @click="handleDelete()" class="btn-danger-inverted">{{ t('Delete') }}</button>
            </div>
            <div class="flex space-x-4">
              <button @click="router.push({ name: 'settings.meosmanage'})" class="btn-cancel">{{ t('Cancel') }}</button>
              <button @click="handleSave()" class="btn-primary">{{ t('Save') }}</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
