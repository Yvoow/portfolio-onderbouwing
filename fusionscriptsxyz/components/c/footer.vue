<template>
  <footer class="bg-blue/60 backdrop-blur-sm pt-10 pb-6 mt-12 border-t border-white/10">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between mb-8">
        <div class="mb-8 md:mb-0">
          <div class="flex items-center mb-4">
            <NuxtImg src="/img/logo.png" alt="Fusion Scripts Logo" class="h-10 mr-3" format="webp" />
            <!-- <span class="text-2xl font-bold animate-bg-gradient text-transparent bg-clip-text">Fusion Scripts</span> -->
          </div>
          <p class="text-gray-300 max-w-xs">
            Performance, Precision, Perfection.<br>
            Premium FiveM scripts for your server.
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-white font-bold mb-3">Navigate</h3>
            <ul class="space-y-2">
              <li><NuxtLink aria-label="Home" to="/" class="text-gray-300 hover:text-fscyan-500 transition-colors">Home</NuxtLink></li>
              <li><NuxtLink aria-label="Scripts" to="/scripts" class="text-gray-300 hover:text-fscyan-500 transition-colors">Scripts</NuxtLink></li>
            </ul>
          </div>    
          
          <div class="col-span-2 md:col-span-1">
            <h3 class="text-white font-bold mb-3">Connect</h3>
            <div class="flex space-x-4">
              <a aria-label="Discord" href="https://discord.gg/fusionscripts" target="_blank" class="text-gray-300 hover:text-fscyan-500 transition-colors">
                <UIcon name="i-ic-baseline-discord" class="w-6 h-6" />
              </a>
              <a aria-label="YouTube" href="https://www.youtube.com/@FusionScripts5m" target="_blank" class="text-gray-300 hover:text-fscyan-500 transition-colors">
                <UIcon name="i-basil-youtube-solid" class="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm mb-4 md:mb-0">
          &copy; {{ new Date().getFullYear() }} Fusion Scripts. All rights reserved.
        </p>
        <div class="flex space-x-6">
          <NuxtLink aria-label="Terms of Service" to="https://checkout.tebex.io/terms/" target="_blank" class="text-gray-400 text-sm hover:text-white transition-colors">Terms of Service</NuxtLink>
          <NuxtLink aria-label="Privacy Policy" to="https://tebex.io/terms-privacy-policy" target="_blank" class="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</NuxtLink>
          <NuxtLink aria-label="Impressum" to="https://checkout.tebex.io/impressum" target="_blank" class="text-gray-400 text-sm hover:text-white transition-colors">Impressum</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

onMounted(() => {
  // Simple entrance animation without ScrollTrigger
  gsap.from('footer > div > div', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.8,
    delay: 0.2
  });
});
</script>

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