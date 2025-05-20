<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useBasketStore } from '~/stores/basket'
import Tebex from "@tebexio/tebex.js";

const router = useRouter()

const toast = useToast()
const basketOpen = ref(false)
const items: NavigationMenuItem[] = [
  {
    label: 'Home',
    to: '/',
    icon: 'i-heroicons-home',
  },
  {
    label: 'Scripts',
    to: '/scripts',
    icon: 'i-heroicons-document-text',
  },
  {
    label: 'Socials',
    icon: 'i-heroicons-globe-alt',
    children: [
      {
        label: 'Discord',
        to: 'https://discord.gg/fusionscripts',
        icon: 'i-ic-baseline-discord',
        description: 'Contact us through our Discord server for support and updates.',
        target: '_blank',
      },
      {
        label: 'Youtube',
        to: 'https://www.youtube.com/@FusionScripts5m',
        icon: 'i-basil-youtube-solid',
        description: 'Watch our YouTube channel for releases and updates.',
        target: '_blank',
      },
    ],
  },
  {
    label: 'Docs',
    to: 'https://fusion-scripts.gitbook.io/fusion-scripts/',
    icon: 'i-heroicons-book-open',
    description: 'Read our documentation for help and guides.',
    target: '_blank',
  }
]

const isMobileMenuOpen = ref(false)

onBeforeMount(async() => {
    const basket = localStorage.getItem('fs-basket')
    if (basket) {
        await getBasket()
    }

    Tebex.checkout.on('payment:complete', handlePaymentComplete)
    Tebex.checkout.on('payment:error', handlePaymentError)
})

function logout() {
    localStorage.removeItem('fs-basket')
    localStorage.removeItem
    useBasketStore().setBasket(null)
}

async function handleBasket() {
    const basket = await getBasket()
    if (basket) {
        basketOpen.value = true
    } else {
        handleBasket()
    }
}

// Compute total price of all items in the basket
const totalBasketPrice = computed(() => {
  const basket = useBasketStore().getBasket
  if (!basket?.data?.packages?.length) return '€0.00'
  
  const total = basket.data.packages.reduce((sum: number, item: any) => {
    return sum + parseFloat(item.in_basket.price)
  }, 0)
  
  return '€' + total.toFixed(2)
})

const basketIdent = computed(() => {
  return useBasketStore().getBasket?.data?.ident
})

const handlePaymentComplete = (event: any) => {
  logout()
  useBasketStore().setBasket(null)
  localStorage.removeItem('fs-basket')

  if (event.basket.isComplete) {
    router.push('/success?tbxid=' + event.payment.txnId)
  }
}

const handlePaymentError = (event: any) => {
  toast.add({ title: 'Payment error', description: 'We were unable to process your payment, please try again. \n\n If this issue persists, please try to login again.', color: 'red' })
}

const checkout = () => {
  if (!basketIdent.value) {
    toast.add({ title: 'Basket error', description: 'We were unable to process your payment, please try again', color: 'red' })
    return
  }

  Tebex.checkout.init({
    ident: basketIdent.value,
    theme: 'dark',
    colors: [
      {
        name: 'primary',
        color: '#FF8563'
      },
      {
        name: 'secondary',
        color: '#20D0D0'
      }
    ]
  })

  Tebex.checkout.launch();
}
</script>

<template>
    <UDrawer title="Shopping Cart" direction="right" :handle="false" v-model:open="basketOpen"
    class="bg-[#2F313D]"
    >
        <template #header>
          <div class="flex items-center px-4 py-3 border-b border-white/10">
            <UIcon name="i-lucide-shopping-cart" class="w-6 h-6 text-fscyan-500 mr-3" />
            <h2 class="text-white text-xl font-bold">Basket</h2>
            <UButton aria-label="Close" @click="basketOpen = false" color="neutral" variant="ghost" icon="i-heroicons-x-mark" class="ml-auto" />
          </div>
        </template>
        
        <template #content>
            <div class="p-5 w-96 size-full flex flex-col h-full"> 
                <div class="flex items-center px-4 py-3 border-b border-white/10">
                    <UIcon name="i-lucide-shopping-cart" class="w-6 h-6 text-fsorange-500 mr-3" />
                    <h2 class="text-white text-xl font-bold">Basket</h2>
                    <UButton aria-label="Close" @click="basketOpen = false" color="neutral" variant="ghost" icon="i-heroicons-x-mark" class="ml-auto hover:cursor-pointer" />
                </div>
                <!-- Empty state -->
                <div v-if="!useBasketStore().getBasket?.data.packages?.length" class="flex flex-col items-center justify-center h-full text-center py-12">
                    <UIcon name="i-lucide-shopping-cart" class="w-16 h-16 text-gray-400 mb-4" />
                    <h3 class="text-xl font-medium mb-2">Your cart is empty</h3>
                    <p class="text-gray-400 mb-6 max-w-xs">Add some scripts to your cart to see them here</p>
                    <UButton aria-label="Browse Scripts" @click="basketOpen = false" to="/scripts" color="primary" variant="solid" class="hover:bg-fscyan-500 transition-colors">
                        Browse Scripts
                    </UButton>
                </div>
                
                <!-- Cart items -->
                <div v-else class="flex flex-col overflow-y-auto flex-1">
                    <div v-for="item in useBasketStore().getBasket?.data.packages" :key="item.id" 
                         class="mb-4 p-4 bg-blue/20 backdrop-blur-sm rounded-lg border border-white/10 group hover:border-fscyan-500/50 transition-all">
                        <div class="flex items-start justify-between gap-4">
                            <!-- Item image -->
                            <div class="w-16 h-16 flex-shrink-0 bg-blue-900/60 rounded-md overflow-hidden">
                                <NuxtImg 
                                    v-if="item.image" 
                                    :src="item.image" 
                                    :alt="item.name"
                                    class="w-full h-full object-cover"
                                    format="webp"
                                />
                                <div v-else class="flex items-center justify-center h-full w-full">
                                    <UIcon name="i-heroicons-code-bracket" class="w-6 h-6 text-gray-400" />
                                </div>
                            </div>
                            
                            <!-- Item details -->
                            <div class="flex-1">
                                <h2 class="text-white text-lg font-bold mb-1">{{ item.name }}</h2>
                                <div class="flex gap-2 mb-2">
                                  <UBadge v-if="item.discount > 0" color="primary" variant="solid" size="sm">
                                    {{ Math.round(item.discount) }}% OFF
                                  </UBadge>
                                </div>
                                <div class="flex justify-between items-center">
                                  <p class="text-fscyan-500 font-bold">{{ item.in_basket.price }}</p>
                                  <UButton aria-label="Remove from cart" @click="removeFromCart(item.id)" color="neutral" variant="ghost" icon="i-heroicons-trash" size="xs"
                                    class="opacity-50 group-hover:opacity-100 transition-opacity hover:text-red hover:cursor-pointer"
                                  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Cart footer -->
                <div v-if="useBasketStore().getBasket?.data.packages?.length > 0" class="mt-auto pt-4 border-t border-white/10">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-gray-300">Total:</span>
                        <span class="text-2xl font-bold">{{ totalBasketPrice }}</span>
                    </div>
                    <!-- <tebex-checkout 
                      :ident="basketIdent"
                      theme="dark"
                      color-primary="#FF8563"
                      color-secondary="#20D0D0"
                      popup-on-mobile
                      @payment:complete="handlePaymentComplete"
                      @payment:error="handlePaymentError"
                    > -->
                      <UButton aria-label="Checkout" color="primary" variant="solid" icon="i-lucide-credit-card"
                        class="w-full py-3 hover:bg-fscyan-500 hover:cursor-pointer transition-colors"
                        :disabled="!basketIdent"
                        @click="checkout"
                    >
                        Checkout
                    </UButton>
                    <!-- </tebex-checkout> -->
                </div>
            </div>
        </template>
    </UDrawer>

  <header class="w-full bg-blue/60 fixed top-0 left-0 z-50 backdrop-blur-sm py-2 px-4 shadow-md">
    <UContainer>
      <nav class="flex items-center justify-between relative">
        <div class="flex items-center">
          <NuxtLink aria-label="Home" to="/" class="mr-4">
            <NuxtImg src="/img/icon.png" alt="Fusion Scripts Logo" class="w-10 h-10 md:hidden" format="webp" />
            <NuxtImg src="/img/logo.png" alt="Fusion Scripts Logo" class="hidden md:block h-10" format="webp" />
          </NuxtLink>
        </div>
        
        <!-- Desktop Navigation Menu -->
        <div class="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
          <UNavigationMenu 
            variant="link" 
            :highlight="false" 
            content-orientation="vertical" 
            :items="items" 
            class="hidden md:flex"
          />
        </div>
        
        <div class="flex items-center gap-3">
          <UChip :text="useBasketStore().getBasket?.data.packages?.length" size="3xl">
            <UButton aria-label="Basket" @click="handleBasket" class="hover:cursor-pointer" variant="outline" color="primary" icon="i-lucide-shopping-cart" />
          </UChip>
          
          <UButton 
            v-if="!useBasketStore().getBasket"
            aria-label="Login"
            @click="getBasket()"
            trailing-icon="i-lucide-arrow-right"
            variant="link"
            class="hover:cursor-pointer text-white hover:text-fscyan-500 transition-colors"
          >
            Login
            <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg> -->
          </UButton>

          <UDropdownMenu
            v-if="useBasketStore().getBasket"
                :items="[
                    {
                        label: useBasketStore().getBasket.data.username,
                        avatar: {
                            src: 'https://forum.cfx.re' + useBasketStore().getImage
                        },
                        type: 'label'
                    },
                    {
                        label: 'Logout',
                        icon: 'i-lucide-log-out',
                        onSelect: () => {
                            logout()
                        }
                    }
                ]"
                :ui="{
                content: 'w-48'
                }"
            >
                <UAvatar class="bg-transparent" :src="'https://forum.cfx.re' + useBasketStore().getImage" />
            </UDropdownMenu>
          
          <!-- Mobile Menu Button -->
          <UButton
            aria-label="Menu"
            variant="ghost"
            icon="i-heroicons-bars-3"
            color="neutral" 
            class="md:hidden text-white"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          />
        </div>
      </nav>
      
      <!-- Mobile Navigation Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden mt-4 pb-2">
        <UNavigationMenu
          orientation="vertical"
          variant="pill"
          :items="items"
          class="w-full"
        />
      </div>
    </UContainer>
  </header>
</template>

<style scoped>
button:hover svg {
  transform: translateX(5px);
  transition: transform 0.3s ease;
}

button svg {
  transition: transform 0.3s ease;
}

/* Scrollbar styling for the basket */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>