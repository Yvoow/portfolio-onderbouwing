<script setup lang="ts">
import { ref, Ref, onBeforeMount, inject } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
onBeforeMount(() => {
  if (!store.getters['user/meosAdmin'] && !store.getters['user/serverAdmin']) {
    router.push({ name: 'not-found' });
  }
});
</script>
<template>
  <RouterView />
</template>
