import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import router from './router'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import axios, { AxiosInstance } from 'axios'
import './index.css'


const app = createApp(App)

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'en',
  fallbackLocale: 'en',
  availableLocales: ['nl', 'en'],
  messages: messages,
})


let missingMessages: string[] = []
i18n.global.setMissingHandler((locale, key, vm) => {
  if (!missingMessages.includes(key)) {
    missingMessages.push(key)
  }
  console.warn('Missing translation keys ', missingMessages)
})

app.provide('axios', apiClient)

app.use(i18n)
app.use(store)
app.use(router)

app.mount('#app')
