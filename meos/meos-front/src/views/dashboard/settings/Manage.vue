<script setup lang="ts">
import { ref, onBeforeMount, inject } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const store = useStore();
const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
  if (!store.getters['user/serverAdmin']) {
    router.push({ name: 'not-found' });
  }
});
</script>
<template>
  <RouterView />
</template>
