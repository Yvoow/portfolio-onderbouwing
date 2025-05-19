<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { watchEffect } from 'vue'
import { useStore } from 'vuex'
import Header from '@/components/headers/header.vue'

const { t, locale } = useI18n()
const store = useStore()

watchEffect(() => {
  const lang = store.getters['user/language']
  const serverlang = store.getters['servervars/language'] || 'en'
  if (!lang) {
    locale.value = serverlang
  } else {
    locale.value = lang
  }
  if (!['en', 'nl'].includes(locale.value)) {
    locale.value = 'en'
  }

})
</script>
<template>
  <Header />
  <RouterView />
</template>
