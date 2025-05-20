<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const route = useRoute();
const scriptName = route.params.name;
const script = ref<any>(null);
const loading = ref(true);
const packageData = ref<any>(null);

onMounted(async () => {
await nextTick();
  try {
    // 1. Get script data from content
    const { data } = await useAsyncData(`scripts`, () => {
      return queryCollection('scripts').where('slug', '=', route.params.name).first()
    });
    
    script.value = data.value;
    
    // 2. Get tebex package data
    let token = useRuntimeConfig().public.tebexApiKey;
    const response = await fetch(`https://headless.tebex.io/api/accounts/${token}/categories?includePackages=1`);
    const categoriesData = await response.json();
    
    // Find the package with a matching name
    for (const category of categoriesData.data) {
      for (const pack of category.packages) {
        if (getScriptSlug(pack.name) === scriptName) {
          packageData.value = pack;
          break;
        }
      }
      if (packageData.value) break;
    }
    
    loading.value = false;
    
    // Animate content after loading
    nextTick(() => {
      gsap.from('.script-details', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
    
    // Set SEO meta tags after script data is loaded
    if (script.value) {
      useSeoMeta({
        title: 'Fusion Scripts | ' + script.value.name,
        description: script.value.desc,
        
        ogTitle: 'Fusion Scripts | ' + script.value.name,
        ogDescription: script.value.desc,
        
        twitterTitle: 'Fusion Scripts | ' + script.value.name,
        twitterDescription: script.value.desc,
      });
    }
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
});

const getScriptSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, '-');
};
</script>

<template>
  <div class="min-h-screen mt-20 py-12">
    <UContainer>
      <div v-if="loading" class="flex justify-center my-32">
        <ULoading color="primary" size="lg" />
      </div>
      
      <div v-else-if="!script || !packageData" class="text-center py-16 bg-blue/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg shadow-blue/10 p-8">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-20 h-20 mx-auto text-fsorange mb-6" />
        <h3 class="text-3xl font-medium mb-4">Script not found</h3>
        <p class="text-gray-400 mb-8 text-lg">The script you're looking for doesn't exist or has been removed.</p>
        <UButton aria-label="Back to Scripts" to="/scripts" color="primary" variant="solid" class="px-8 py-3">
          Back to Scripts
        </UButton>
      </div>
      
      <div v-else>
        <!-- Back Button -->
        <UButton
          aria-label="Back to Scripts"
          to="/scripts"
          icon="i-heroicons-arrow-left"
          color="neutral"
          variant="ghost"
          class="mb-8 -ml-2 hover:translate-x-[-4px] transition-transform"
        >
          Back to Scripts
        </UButton>
        
        <!-- Script Header -->
        <div class="script-details grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <!-- Image/Showcase -->
          <div class="lg:col-span-2">
            <div class="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-xl shadow-blue/10 group">
              <iframe 
                v-if="script.showcase" 
                :src="script.showcase" 
                :alt="packageData.name"
                class="w-full h-full object-cover"
                title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-fsblue/60 to-fscyan/40 flex items-center justify-center">
                <UIcon name="i-heroicons-code-bracket" class="w-28 h-28 text-white/50" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          <!-- Script Info -->
          <div class="p-8 bg-blue/30 backdrop-blur-md rounded-2xl border border-white/15 shadow-lg shadow-blue/10 flex flex-col hover:border-fscyan/30 transition-all duration-300">
            <h1 class="text-3xl font-bold mb-4 text-white">{{ packageData.name }}</h1>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <UBadge v-for="tag in script.tags" :key="tag" variant="soft" class="px-3 py-1.5 text-sm">
                {{ tag }}
                <UIcon v-if="tag === 'ESX'" name="i-material-symbols-settings-outline" class="w-4 h-4 ml-1.5" />
                <UIcon v-if="tag === 'QBCore'" name="i-icon-park-outline-cube-four" class="w-4 h-4 ml-1.5" />
                <UIcon v-if="tag === 'Escrow'" name="i-icon-park-solid-file-protection-one" class="w-4 h-4 ml-1.5" />
              </UBadge>
            </div>
            
            <div class="text-gray-300 mb-6 max-h-32 overflow-auto custom-scrollbar bg-blue/20 rounded-xl p-4 border border-white/10">
                <h2 class="text-lg font-bold mb-2 text-white/90">Dependencies</h2>
                <ul class="list-disc list-inside space-y-1">
                    <li v-for="dependency in script.dependencies" :key="dependency.name" class="transition-colors">
                        <a v-if="dependency.link" :href="dependency.link" class="text-fscyan hover:text-white transition-colors duration-200">{{ dependency.name }}</a>
                        <span v-else>{{ dependency.name }}</span>
                    </li>
                </ul>
            </div>
            
            <div class="mt-auto pt-5 border-t border-white/15">
              <div class="flex justify-between items-center mb-5">
                <div>
                  <div v-if="packageData.discount > 0" class="text-sm text-gray-400 line-through mb-1">
                    €{{ packageData.base_price }}
                  </div>
                  <div class="text-3xl font-bold text-white flex items-center">
                    €{{ packageData.base_price * (1 - packageData.discount / 100) }}
                  </div>
                </div>
                
                <UBadge v-if="packageData.discount > 0" color="fsorange" variant="solid" class="text-sm px-3 py-1.5">
                  {{ Math.round(packageData.discount) }}% OFF
                </UBadge>
              </div>
              
              <UButton
                aria-label="Add to Cart"
                color="primary"
                variant="solid"
                icon="i-heroicons-shopping-cart" 
                class="w-full py-4 text-base font-medium hover:bg-fscyan hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
              >
                Add to Cart
              </UButton>
            </div>
          </div>
        </div>
        
        <div v-if="script.features && script.features.length > 0" class="script-details mb-16">
          <h2 class="text-2xl font-bold mb-8 pl-2 border-l-4 border-fscyan">Features</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="feature in script.features" 
              :key="feature.name"
              class="p-5 bg-blue/20 backdrop-blur-sm rounded-xl border border-white/10 flex items-start hover:border-fscyan/30 hover:bg-blue/30 transition-all duration-200 group"
            >
              <UIcon :name="feature.icon" class="w-7 h-7 text-fscyan mr-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <h3 class="font-semibold text-lg mb-1 text-white">{{ feature.name }}</h3>
                <p class="text-gray-400">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Description -->
        <div v-if="script.desc" class="script-details">
          <h2 class="text-2xl font-bold mb-8 pl-2 border-l-4 border-fscyan">Description</h2>
          
          <div class="bg-blue/20 backdrop-blur-sm rounded-xl border border-white/10 p-8 shadow-lg shadow-blue/5 hover:border-white/15 transition-all duration-300">
            <div class="prose prose-invert prose-lg max-w-none min-h-32">{{ script.desc }}</div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Responsive adjustments */
@media (max-width: 768px) {
  .script-details {
    grid-template-columns: 1fr;
  }
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(79, 209, 197, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 209, 197, 0.5);
}

/* Global scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(79, 209, 197, 0.2);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 209, 197, 0.3);
}
</style> 