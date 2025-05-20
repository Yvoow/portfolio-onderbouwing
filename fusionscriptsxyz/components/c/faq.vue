<template>
  <div class="py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-16 animate-bg-gradient text-transparent bg-clip-text">
        Frequently Asked Questions
      </h2>
      
      <div ref="faqContainer" class="max-w-3xl mx-auto bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/5">
        <UAccordion 
          :items="faqItems" 
          color="primary"
          ui-class="custom-accordion"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const faqContainer = ref(null);

const faqItems = [
  {
    label: 'What makes Fusion scripts different?',
    content: 'Our scripts are built with a focus on performance, precision, and perfection. We optimize every line of code to ensure minimal resource usage while delivering maximum functionality for your FiveM server.',
    defaultOpen: true
  },
  {
    label: 'Do your scripts work with ESX/QBCore?',
    content: 'Yes! Our scripts are designed to be compatible with popular frameworks like ESX and QBCore. Each product page specifies which frameworks are supported.'
  },
  {
    label: 'How do I receive support after purchase?',
    content: 'We provide dedicated support through our Discord server. After purchasing, you\'ll receive an invitation to our customer support channels where our team is ready to assist you with installation, configuration, and troubleshooting.'
  },
  {
    label: 'Can I request custom features?',
    content: 'Absolutely! We offer custom development services for specific features or modifications to our existing scripts. Contact us through our Discord server to discuss your requirements and get a quote.'
  },
  {
    label: 'Do you offer refunds?',
    content: 'Due to the digital nature of our products, we generally don\'t offer refunds. However, we stand behind our code quality and provide extensive support to ensure our scripts work as advertised. Please review all product details before purchasing.'
  },
  {
    label: 'How often do you release updates?',
    content: 'We regularly update our scripts to ensure compatibility with the latest FiveM versions and to add new features. All updates to purchased scripts are free and can be downloaded from your account dashboard.'
  }
];

onMounted(() => {
  // Create GSAP timeline for the entrance animations
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  
  // Initial states
  gsap.set(faqContainer.value, {
    opacity: 0,
    y: 30
  });
  
  // Add animations
  tl.to(faqContainer.value, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 0.3
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