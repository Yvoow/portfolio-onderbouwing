<script setup lang="ts">
import { RouterView } from 'vue-router'
import notifications from './components/windows/notifications.vue';
import { onBeforeMount } from 'vue';
import { SpeedInsights } from "@vercel/speed-insights/vue"

onBeforeMount(() => {
  const mode = localStorage.getItem('fusionMode');
  if (mode === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
})

</script>

<template>
  <SpeedInsights />
  <div class="dark:text-text-dark text-text-light">
    <notifications />
    <RouterView />
  </div>
</template>
