<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

const tbxid = useRoute().query.tbxid
const content = ref(null)

onMounted(() => {
  gsap.from(content.value, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.2
  });
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-20">
    <UContainer>
      <div ref="content" class="max-w-lg mx-auto bg-blue/40 backdrop-blur-sm rounded-xl border border-white/10 p-10 text-center shadow-lg">
        <h1 class="text-5xl font-bold mb-4 animate-bg-gradient text-transparent bg-clip-text">Success</h1>
        <p class="text-gray-300 mb-2 text-lg">Thank you for your purchase!</p>
        <p class="text-gray-400 mb-4">Your transaction was successful.</p>
        <div class="flex flex-col items-center justify-center mt-6">
          <span class="text-gray-500 text-sm mb-1">Transaction ID:</span>
          <span class="text-fscyan-500 bg-blue/20 backdrop-blur-sm rounded-md px-2 py-1 font-mono text-lg">{{ tbxid }}</span>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.animate-bg-gradient {
  background: linear-gradient(90deg, #FF7F7F, #FF8563, #528AD7, #20D0D0);
  background-size: 300% 100%;
  background-clip: text;
  animation: bgGradient 5s ease infinite;
}

@keyframes bgGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>