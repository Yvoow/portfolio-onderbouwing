<template>
  <UApp>
    <UContainer>
      <CNavbar />
      <NuxtPage />
    </UContainer>
    <CFooter />
    <div id="tebex-checkout-modal"></div>
  </UApp>
</template>
<script setup lang="ts">
const route = useRoute()

onMounted(async() => {
  if (route.query.success === 'true') {
    await getBasket()
    // Reset the route query after handling the success parameter
    navigateTo({
      path: route.path,
      query: {}
    }, { replace: true })
  }
})
  
useSeoMeta({
  title: 'Fusion Scripts | ESX & QB Scripts - Fivem Scripts',
  description: 'Affordable and high-quality FiveM scripts for ESX and QBcore servers. Instant download and easy to install.',
  keywords: 'fivem, fivem scripts, esx scripts, qbcore scripts, fusion scripts, cheap fivem scripts',
  author: 'Fusion Scripts',


  ogTitle: 'Fusion Scripts | ESX & QB Scripts - Fivem Scripts',
  ogDescription: 'Discover premium FiveM ESX and QBcore scripts ready for your server.',
  ogImage: 'https://fusionscripts.xyz/img/logo.png',
  ogUrl: 'https://fusionscripts.xyz',
  ogType: 'website',

  twitterCard: 'summary_large_image',
  twitterTitle: 'Fusion Scripts | ESX & QB Scripts - Fivem Scripts',
  twitterDescription: 'Discover premium FiveM ESX and QBcore scripts ready for your server.',
  twitterImage: 'https://fusionscripts.xyz/img/logo.png',
})


</script>