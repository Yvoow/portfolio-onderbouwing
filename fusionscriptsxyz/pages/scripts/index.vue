<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { gsap } from 'gsap';

const getScriptSlug = (name: string) => {
  return name.toLowerCase().replace(/ /g, '-')
}

const scripts = ref<any[]>([])
const loading = ref(true)
const categories = ref<any[]>([])
const search = ref('')
const pageHeader = ref(null)
const activeFilters = ref<string[]>([])

// Toggle filter function
const toggleFilter = (filter: string) => {
  if (activeFilters.value.includes(filter)) {
    activeFilters.value = activeFilters.value.filter(f => f !== filter)
  } else {
    activeFilters.value.push(filter)
  }
}

// Filter scripts based on active filters
const filteredCategories = computed(() => {
  if (activeFilters.value.length === 0) return categories.value
  
  return categories.value.map(category => {
    const filteredPackages = category.packages.filter((script: any) => {
      // Price filters
      if (activeFilters.value.includes('Free') && script.base_price > 0) return false
      if (activeFilters.value.includes('Paid') && script.base_price <= 0) return false
      
      // Tag filters
      if (activeFilters.value.includes('Escrow') && 
          (!script.meta?.tags || !script.meta.tags.includes('Escrow'))) return false
      if (activeFilters.value.includes('Open source') && 
          (!script.meta?.tags || !script.meta.tags.includes('Open source'))) return false
      
      return true
    })
    
    return {
      ...category,
      packages: filteredPackages
    }
  }).filter(category => category.packages.length > 0)
})

const getScriptData = (name: string) => {  
  const data = scripts.value.find((script) => script.meta.name === name)
  return data?.meta?.body || {}
}

onBeforeMount(async () => {
  try {
    let token = useRuntimeConfig().public.tebexApiKey

    const response = await fetch(`https://headless.tebex.io/api/accounts/${token}/categories?includePackages=1`)
    const data = await response.json()
    categories.value = data.data

    const { data: scriptDatas } = await useAsyncData('scripts', () => {
      return queryCollection('scripts').all()
    })
    scripts.value = scriptDatas.value || []
    
    categories.value.forEach(async (category) => {
      category.packages.forEach(async (pack: any) => {
        const scriptData = getScriptData(pack.name)
        pack.meta = scriptData
      })
    })

    loading.value = false
  } catch (error) {
    console.error(error)
    loading.value = false
  }
})

onMounted(() => {
  // Create GSAP animation only for the header content
  gsap.from(pageHeader.value, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.2
  });
})
</script>

<template>
  <div class="min-h-screen mt-20 py-8">
    <UContainer>
      <div ref="pageHeader" class="mb-6">
        <h1 class="text-5xl font-bold mb-4">
          Our <span class="animate-bg-gradient text-transparent bg-clip-text">Scripts</span>
        </h1>
        <p class="text-gray-300 mb-8 max-w-xl">
          Explore our premium FiveM scripts to enhance your server experience
        </p>
        
        <!-- Filter buttons -->
        <div class="flex flex-wrap gap-2 mb-8">
          <UButton 
            v-for="filter in ['Paid', 'Free', 'Escrow', 'Open source']" 
            :key="filter"
            :aria-label="filter"
            :color="activeFilters.includes(filter) ? 'primary' : 'neutral'"
            :variant="activeFilters.includes(filter) ? 'solid' : 'soft'"
            size="sm"
            @click="toggleFilter(filter)"
            class="transition-all hover:bg-fsorange-500 hover:cursor-pointer"
          >
            {{ filter }}
          </UButton>
        </div>
      </div>
      
      <div v-if="loading" class="flex justify-center my-12">
        <ULoading color="primary" size="lg" />
      </div>
      
      <div v-else-if="filteredCategories.length === 0" class="text-center py-12 bg-blue/40 backdrop-blur-sm rounded-xl border border-white/10 p-8">
        <UIcon name="i-heroicons-document-text" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-2xl font-medium mb-2">No scripts match your filters</h3>
        <p class="text-gray-500">Try adjusting your filter selection.</p>
      </div>
      
      <div v-else>
        <div v-for="category in filteredCategories" :key="category.id" class="mb-12">
          <h2 class="text-4xl font-semibold mb-4">{{ category.name }}</h2>
          <p v-if="category.description" class="text-gray-300 mb-6" v-html="category.description"></p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <UCard 
              v-for="script in category.packages" 
              :key="script.id" 
              class="transition-all hover:shadow-xl duration-300 border border-white/10 bg-blue/40 backdrop-blur-sm group"
            >
              <template #header>
                <div class="relative w-full h-48 rounded-t-lg flex items-center justify-center overflow-hidden group-hover:brightness-110 transition-all">
                  <NuxtImg 
                    @click="navigateTo(`/scripts/${getScriptSlug(script.name)}`)"
                    v-if="script.image" 
                    :src="script.image" 
                    :alt="script.name"
                    class="w-full h-full object-cover hover:cursor-pointer"
                    format="webp"
                  />
                  <div v-else class="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-900/60 to-cyan-900/60">
                    <UIcon name="i-heroicons-code-bracket" class="w-12 h-12 text-gray-400" />
                  </div>
                </div>
              </template>
              
              <div>
                <h3 class="text-xl font-semibold mb-3">{{ script.name }}</h3>
                <div class="flex flex-wrap gap-2 mb-4">
                  <UBadge v-for="tag in script.meta.tags" :key="tag" variant="soft" class="px-2.5 py-1">
                    {{ tag }}
                    <UIcon v-if="tag === 'ESX'" name="i-material-symbols-settings-outline" class="w-4 h-4 ml-1" />
                    <UIcon v-if="tag === 'QBCore'" name="i-icon-park-outline-cube-four" class="w-4 h-4 ml-1" />
                    <UIcon v-if="tag === 'Escrow'" name="i-icon-park-solid-file-protection-one" class="w-4 h-4 ml-1" />
                  </UBadge>
                </div>
                
                <div class="flex justify-between items-center pt-2 border-t border-white/10">
                  <div class="text-lg font-bold">
                    €{{ script.base_price }}
                    <span v-if="script.discount > 0" class="text-sm line-through text-gray-500 ml-2">
                      €{{ script.base_price * (1 - script.discount / 100) }}
                    </span>
                  </div>
                  
                  <div class="flex gap-3">
                    <UButton
                      aria-label="View Details"
                      color="fsblue"
                      variant="ghost"
                      icon="i-heroicons-eye" 
                      size="sm"
                      :to="`/scripts/${getScriptSlug(script.name)}`"
                      class="hover:text-fscyan-500 transition-colors"
                    >
                      Details
                    </UButton>
                    
                    <UButton
                      aria-label="Add to Cart"
                      @click="addToCart(script.id)"
                      color="primary"
                      variant="solid"
                      icon="i-heroicons-shopping-cart" 
                      size="sm"
                      class="hover:bg-fscyan-500 hover:cursor-pointer transition-colors"
                    >
                      Add to Cart
                    </UButton>
                  </div>
                </div>
              </div>
            </UCard>
          </div>
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

/* Button hover animation enhancement */
button:hover svg {
  transform: translateX(5px);
  transition: transform 0.3s ease;
}

button svg {
  transition: transform 0.3s ease;
}

/* Add cleaner hover effects */
.group:hover {
  transform: translateY(-4px);
}
</style> 