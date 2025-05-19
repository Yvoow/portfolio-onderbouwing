<script setup lang="ts">
import { ref, Ref, onMounted, inject } from 'vue'
import { useStore } from 'vuex';
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Map, TileLayer } from 'leaflet'
import axios, { AxiosStatic } from 'axios'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const publicPath = window.location.origin
const store = useStore();
const loading = ref(true);
const api: AxiosStatic = inject('axios', axios)
const reqamount = ref(0)
const showPopup = ref(false)
const playerMarkers = ref([])
const mouseCoords = ref({ x: 0, y: 0 })

const availableStyles = [
  {
    name: 'Satelite',
    placeholder: 'https://storage.googleapis.com/meos/mapStyles/styleSatelite/0/0/0.jpg',
    image: 'https://storage.googleapis.com/meos/mapStyles/styleSatelite/{z}/{x}/{y}.jpg',
    options: {
      minZoom: 3,
      maxZoom: 5,
      noWrap: true,
      continuousWorld: false,
      attribution: '',
      id: 'SateliteStyle map',
    }
  },
  {
    name: 'Atlas',
    placeholder: 'https://storage.googleapis.com/meos/mapStyles/styleAtlas/0/0/0.jpg',
    image: 'https://storage.googleapis.com/meos/mapStyles/styleAtlas/{z}/{x}/{y}.jpg',
    options: {
      minZoom: 3,
      maxZoom: 5,
      noWrap: true,
      continuousWorld: false,
      attribution: '',
      id: 'styleAtlas map',
    }
  },
  {
    name: 'Grid',
    placeholder: 'https://storage.googleapis.com/meos/mapStyles/styleGrid/0/0/0.png',
    image: 'https://storage.googleapis.com/meos/mapStyles/styleGrid/{z}/{x}/{y}.png',
    options: {
      minZoom: 3,
      maxZoom: 5,
      noWrap: true,
      continuousWorld: false,
      attribution: '',
      id: 'styleGrid map',
    }
  }
]

const activeLayer = ref('Atlas')
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
    minZoom: 3,
    maxZoom: 5,
    noWrap: true,
  }).addTo(map.value)

  map.value.on('mousemove', (e) => {
    mouseCoords.value = { x: e.latlng.lng, y: e.latlng.lat }
  })

  const servermarkers = store.getters['servervars/markers']
  servermarkers.forEach((marker) => {
    createMarker(marker.x, marker.y, marker.type, marker.title, marker.desc, marker.color, marker.circleRadius)
  })
  if (store.getters['servervars/livemap']) {
    placeLiveMarkers()
  }
  loading.value = false
}

const createMarker = (y, x, type, title, desc?, color?, radius?, filopacity?, group?) => {
  if (type === 'marker') {
    const marker = L.marker([x, y]).addTo(map.value)
    marker.bindPopup(desc ? `<b>${title}</b><br>${desc}` : `<b>${title}</b>`)
  } else if (type === 'circle') {
    const circle = L.circle([x, y], {
      color: color,
      fillColor: color,
      fillOpacity: 0.5,
      radius: radius ?? 25,
      group: group ? group : 'default'
    }).addTo(map.value)
    circle.bindPopup(desc ? `<b>${title}</b><br>${desc}` : `<b>${title}</b>`)
  } else if (type === 'polygon') {
    const polygon = L.polygon([
      [x, y],
      [x + 0.1, y],
      [x + 0.1, y + 0.1],
      [x, y + 0.1]
    ]).addTo(map.value)
    polygon.bindPopup(desc ? `<b>${title}</b><br>${desc}` : `<b>${title}</b>`)
  }
}

const changeMapLayer = (layer) => {
  const selectedLayer = availableStyles.find((style) => style.name === layer)
  if (selectedLayer) {
    mapLayer.value?.remove()
    mapLayer.value = new TileLayer(selectedLayer.image, selectedLayer.options).addTo(map.value)
    activeLayer.value = selectedLayer.name
  }
}

const placeLiveMarkers = async() => {
  if (!store.getters['servervars/livemap']) return
  reqamount.value++
  if (reqamount.value >= 10) {
    showPopup.value = true
  }
  const response = await api.get('/GetLiveMarkers')
  if (response.status === 200) {
    map.value?.eachLayer((layer) => {
      if (layer.options.group === 'playermarker') {
        map.value?.removeLayer(layer)
      }
    })
    const markers = response.data
    playerMarkers.value = markers
    markers.forEach((marker) => {
      createMarker(marker.x, marker.y, 'circle', marker.displayname, undefined, 'blue', 20, 1, 'playermarker')
    })
  }

  setTimeout(() => {
    placeLiveMarkers()
  }, 30000);
}

onMounted(() => {
  initMap()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 relative">
    <Teleport to="#app">
      <div class="fixed inset-0 z-[99] bg-black/70 backdrop-blur-sm" v-if="showPopup">
        <div class="flex items-center justify-center h-full">
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('Are you still there?') }}</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ t('You have been away for a while, are you still there?') }}</p>
            <div class="flex justify-center">
              <button class="btn-primary" @click="showPopup = false; reqamount = 0">
                {{ t('Yes, I\'m still here!') }}
              </button>
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
      <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" v-if="loading">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
          <div class="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <p class="text-gray-600 dark:text-gray-300 font-medium">{{ t('Loading...') }}</p>
        </div>
      </div>
    </Transition>

    <div class="absolute flex z-10 rounded-lg right-0">
      <div class="shadow-lg w-16 rounded-lg grid m-5 gap-2">
        <img v-for="style in availableStyles" :key="style.name"
             :src="style.placeholder"
             :alt="style.name"
             @click="changeMapLayer(style.name)"
             class="rounded-lg cursor-pointer hover:opacity-100 transition-all duration-200 shadow-md"
             :class="style.name === activeLayer ? 'opacity-100 ring-2 ring-primary' : 'opacity-70'" />
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg p-2 rounded-lg overflow-hidden">
          <p class="text-xs font-medium text-center text-gray-800 dark:text-gray-200">X: {{ mouseCoords.x.toFixed() }}</p>
          <p class="text-xs font-medium text-center text-gray-800 dark:text-gray-200">Y: {{ mouseCoords.y.toFixed() }}</p>
        </div>
      </div>
    </div>

    <div id="map" class="w-full flex grow z-0 h-screen cursor-crosshair"></div>
  </div>
</template>
