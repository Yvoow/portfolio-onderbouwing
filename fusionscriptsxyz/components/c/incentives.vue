<template>
  <section aria-labelledby="features-heading" class="py-16">
    <div class="container mx-auto px-4">
      <h2 id="features-heading" class="text-4xl font-bold text-center mb-16 animate-bg-gradient text-transparent bg-clip-text">
        Why Choose Fusion Scripts?
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div ref="card1" class="incentive-card">
          <div class="flex items-center">
            <div class="icon-container gradient-blue">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-white">ESX Compatible</h3>
              <p class="text-gray-300 mt-2">Fully tested and optimized for ESX framework with seamless integration.</p>
            </div>
          </div>
        </div>
        
        <div ref="card2" class="incentive-card">
          <div class="flex items-center">
            <div class="icon-container gradient-blue">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="22" y1="12" x2="18" y2="12"></line>
                <line x1="6" y1="12" x2="2" y2="12"></line>
                <line x1="12" y1="6" x2="12" y2="2"></line>
                <line x1="12" y1="22" x2="12" y2="18"></line>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-white">QBCore Compatible</h3>
              <p class="text-gray-300 mt-2">Designed to work flawlessly with QBCore framework for maximum flexibility.</p>
            </div>
          </div>
        </div>
        
        <div ref="card5" class="incentive-card">
          <div class="flex items-center">
            <div class="icon-container gradient-purple">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M15 3h6v6"></path>
                <path d="M10 14L21 3"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-white">Fully Configurable</h3>
              <p class="text-gray-300 mt-2">Extensive configuration options allowing for complete customization to fit your server's needs.</p>
            </div>
          </div>
        </div>
        
        <div ref="card3" class="incentive-card">
          <div class="flex items-center">
            <div class="icon-container gradient-red">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-xl font-semibold text-white">Performance Optimized</h3>
              <p class="text-gray-300 mt-2">Low resource usage scripts that minimize server impact while maximizing functionality.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const card1 = ref(null);
const card2 = ref(null);
const card3 = ref(null);
const card4 = ref(null);
const card5 = ref(null);

onMounted(() => {
  // Create GSAP timeline for the entrance animations
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  // Initial states
  gsap.set([card1.value, card2.value, card3.value, card4.value, card5.value], {
    opacity: 0,
    y: 30
  });
  
  // Add animations with stagger
  tl.to([card1.value, card2.value, card3.value, card4.value, card5.value], {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.15,
    delay: 0.3
  });
});
</script>

<style scoped>
.incentive-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.incentive-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.08);
}

.icon-container {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.gradient-blue {
  background: linear-gradient(135deg, #528AD7, #20D0D0);
}

.gradient-red {
  background: linear-gradient(135deg, #FF7F7F, #FF8563);
}

.gradient-purple {
  background: linear-gradient(135deg, #9D50BB, #6E48AA);
}

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
