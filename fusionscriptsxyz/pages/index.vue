<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const heading = ref(null);
const paragraph = ref(null);
const button = ref(null);

onMounted(() => {
  // Create GSAP timeline for the entrance animations
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  // Initial states
  gsap.set([heading.value, paragraph.value, button.value], {
    opacity: 0,
    y: 20
  });
  
  // Add animations with slight delay to sync with the SVG animation
  tl.to(heading.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.5
  })
  .to(paragraph.value, {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, "-=0.5")
  .to(button.value, {
    opacity: 1,
    y: 0,
    duration: 0.8
  }, "-=0.5");
});
</script>

<template>
  <div class="min-h-screen flex items-center">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="md:w-1/2 mb-8 md:mb-0">
          <h1 ref="heading" class="text-5xl md:text-6xl font-bold mb-4">
            Next-level <span class="animate-bg-gradient text-transparent bg-clip-text">Performance</span> for your FiveM server
          </h1>
          <p ref="paragraph" class="text-gray-300 mb-8 max-w-xl">
            Performance, Precision, Perfection - The Fusion Way.
          </p>
          <button aria-label="Shop now" @click="navigateTo('/scripts')" ref="button" class="bg-fsblue-500 hover:bg-fscyan-500 hover:cursor-pointer text-white py-3 px-6 rounded-full inline-flex items-center transition-all duration-300">
            Shop now
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="md:w-1/2 hidden md:flex justify-center">
          <CLanding />
        </div>
      </div>
    </div>
  </div>
  <div class="md:-mt-44">
    <CIncentives />
  </div>
  <CFaq />
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

/* Button hover animation enhancement */
button:hover svg {
  transform: translateX(5px);
  transition: transform 0.3s ease;
}

button svg {
  transition: transform 0.3s ease;
}
</style>
