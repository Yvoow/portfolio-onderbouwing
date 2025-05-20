<template>
  <div class="landing-animation">
    <svg ref="svgContainer" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <!-- Gradients for lines and incentives -->
      <defs>
        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#528ad7" />
          <stop offset="100%" stop-color="#20d0d0" />
        </linearGradient>
        
        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff7f7f" />
          <stop offset="100%" stop-color="#ff8563" />
        </linearGradient>
      </defs>
      
      <!-- Lines connecting to incentives -->
      <g class="lines">
        <path ref="line1" d="M400,300 L200,150" stroke="url(#lineGradient1)" stroke-width="2" fill="none" />
        <path ref="line2" d="M400,300 L600,150" stroke="url(#lineGradient1)" stroke-width="2" fill="none" />
        <path ref="line3" d="M400,300 L200,450" stroke="url(#lineGradient2)" stroke-width="2" fill="none" />
        <path ref="line4" d="M400,300 L600,450" stroke="url(#lineGradient2)" stroke-width="2" fill="none" />
      </g>
      
      <!-- Incentives -->
      <g class="incentives">
        <g ref="incentive1" class="incentive" transform="translate(200, 150)">
          <rect x="-60" y="-30" width="120" height="60" rx="8" fill="#ffffff" fill-opacity="0.1" stroke="url(#lineGradient1)" stroke-width="1.5" />
          <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-weight="500">Performance</text>
        </g>
        <g ref="incentive2" class="incentive" transform="translate(600, 150)">
          <rect x="-60" y="-30" width="120" height="60" rx="8" fill="#ffffff" fill-opacity="0.1" stroke="url(#lineGradient1)" stroke-width="1.5" />
          <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-weight="500">Precision</text>
        </g>
        <g ref="incentive3" class="incentive" transform="translate(200, 450)">
          <rect x="-60" y="-30" width="120" height="60" rx="8" fill="#ffffff" fill-opacity="0.1" stroke="url(#lineGradient2)" stroke-width="1.5" />
          <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-weight="500">Quality</text>
        </g>
        <g ref="incentive4" class="incentive" transform="translate(600, 450)">
          <rect x="-60" y="-30" width="120" height="60" rx="8" fill="#ffffff" fill-opacity="0.1" stroke="url(#lineGradient2)" stroke-width="1.5" />
          <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-weight="500">Perfection</text>
        </g>
      </g>
      
      <!-- Logo in the center (placed after lines and incentives for higher z-index) -->
      <g ref="logo" class="logo">
        <image href="/img/icon.svg" x="320" y="220" width="160" height="160" />
      </g>
    </svg>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import { onMounted, ref } from 'vue';

export default {
  name: 'LandingAnimation',
  setup() {
    const svgContainer = ref(null);
    const logo = ref(null);
    const line1 = ref(null);
    const line2 = ref(null);
    const line3 = ref(null);
    const line4 = ref(null);
    const incentive1 = ref(null);
    const incentive2 = ref(null);
    const incentive3 = ref(null);
    const incentive4 = ref(null);
    
    onMounted(() => {
      // Create a timeline for the animation
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      // Initial state
      gsap.set([line1.value, line2.value, line3.value, line4.value], {
        strokeDasharray: function(i, target) {
          const length = target.getTotalLength();
          return `${length} ${length}`;
        },
        strokeDashoffset: function(i, target) {
          return target.getTotalLength();
        },
        opacity: 0
      });
      
      gsap.set([incentive1.value, incentive2.value, incentive3.value, incentive4.value], {
        scale: 0,
        opacity: 0
      });
      
      // Animate the logo first
      tl.from(logo.value, { 
        scale: 0, 
        opacity: 0, 
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)'
      });
      
      // Draw lines from center to incentives
      tl.to([line1.value, line2.value, line3.value, line4.value], { 
        strokeDashoffset: 0,
        opacity: 1, 
        duration: 1.5,
        stagger: 0.2
      }, "-=0.3");
      
      // Animate incentives appearance
      tl.to([incentive1.value, incentive2.value, incentive3.value, incentive4.value], { 
        scale: 1,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15
      }, "-=1");
      
      // Add a slight pulse to the logo
      tl.to(logo.value, {
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        duration: 1.5
      });
    });
    
    return {
      svgContainer,
      logo,
      line1,
      line2,
      line3,
      line4,
      incentive1,
      incentive2,
      incentive3,
      incentive4
    };
  }
};
</script>

<style scoped>
.landing-animation {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

svg {
  width: 100%;
  height: 100%;
  max-width: 1200px;
}

.incentive text {
  font-family: 'Inter', 'Avenir', sans-serif;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.incentive rect {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  backdrop-filter: blur(4px);
}
</style>
