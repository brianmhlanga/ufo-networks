<template>
  <NuxtLayout name="home">
    <div class="min-h-screen bg-gradient-to-br from-[#eff4ff] to-white">
      <!-- Success Header -->
      <section class="relative overflow-hidden py-20">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Success Badge -->
            <div class="inline-flex items-center px-4 py-2 bg-green-100 backdrop-blur-sm rounded-full shadow-lg border border-green-200 mb-6">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span class="text-sm font-medium text-green-700">Successfully Connected</span>
            </div>

            <!-- Success Icon -->
            <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg class="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>

            <!-- Main heading -->
            <h1 class="text-4xl md:text-6xl font-bold text-secondary leading-tight mb-6">
              <span class="block">Welcome to</span>
              <span class="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {{ location?.name || 'UFO Networks' }}
              </span>
            </h1>

            <!-- Subtitle -->
            <p class="text-lg md:text-xl text-secondary/80 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
              You're now connected to our high-speed WiFi network. Enjoy your browsing experience!
            </p>

            <!-- Location Info -->
            <div v-if="location" class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 max-w-md mx-auto">
              <div class="flex items-center justify-center space-x-3 mb-3">
                <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="text-lg font-semibold text-secondary">{{ location.town }}, {{ location.province }}</span>
              </div>
              <p class="text-sm text-secondary/70">{{ location.area }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Ads Section -->
      <section v-if="ads.length > 0" class="py-16">
        <div class="container mx-auto px-6">
          <div class="max-w-6xl mx-auto">
            <!-- Section Header -->
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-secondary mb-4">Local Offers & Services</h2>
              <p class="text-secondary/80 text-lg">Discover great deals and services in your area</p>
            </div>

            <!-- Ads Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div 
                v-for="ad in ads" 
                :key="ad.id"
                class="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <!-- Ad Image -->
                <div v-if="ad.mediaUrl" class="relative h-48 overflow-hidden">
                  <img 
                    :src="ad.mediaUrl" 
                    :alt="ad.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <!-- Ad Content -->
                <div class="p-6">
                  <h3 class="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                    {{ ad.title }}
                  </h3>
                  
                  <!-- Custom HTML Content -->
                  <div v-if="ad.htmlSnippet" class="text-secondary/80 mb-4" v-html="ad.htmlSnippet"></div>
                  
                  <!-- Advertiser Info -->
                  <div v-if="ad.advertiser" class="flex items-center space-x-3 mb-4">
                    <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span class="text-primary font-semibold text-sm">
                        {{ ad.advertiser.name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-secondary">{{ ad.advertiser.name }}</p>
                      <p v-if="ad.advertiser.company" class="text-xs text-secondary/60">{{ ad.advertiser.company }}</p>
                    </div>
                  </div>

                  <!-- Action Button -->
                  <a 
                    v-if="ad.targetUrl"
                    :href="ad.targetUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center w-full bg-primary hover:bg-primary-900 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 group-hover:shadow-lg"
                    @click="trackAdClick(ad.id)"
                  >
                    <span>Learn More</span>
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- No Ads Message -->
      <section v-else class="py-16">
        <div class="container mx-auto px-6">
          <div class="max-w-2xl mx-auto text-center">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-secondary mb-2">No Local Offers Available</h3>
              <p class="text-secondary/70">Check back later for exciting local deals and services in your area.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Connection Info -->
      <section class="py-16 bg-white/50">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Connection Status -->
              <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-secondary mb-2">Connected</h3>
                <p class="text-secondary/70 text-sm">You're successfully connected to our WiFi network</p>
              </div>

              <!-- Speed Info -->
              <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-secondary mb-2">High Speed</h3>
                <p class="text-secondary/70 text-sm">Enjoy fast and reliable internet connection</p>
              </div>

              <!-- Support -->
              <div class="text-center">
                <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-secondary mb-2">Need Help?</h3>
                <p class="text-secondary/70 text-sm">Contact our support team for assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Buttons -->
      <section class="py-16">
        <div class="container mx-auto px-6">
          <div class="max-w-2xl mx-auto text-center">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink 
                to="/vouchers" 
                class="bg-primary hover:bg-primary-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Buy More Vouchers
              </NuxtLink>
              <NuxtLink 
                to="/contact" 
                class="bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300"
              >
                Contact Support
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { primaryColor, secondaryColor } from '~/configs/colors'

// Set layout
definePageMeta({
  layout: 'home'
})

// Get location code from route params
const route = useRoute()
const locationCode = route.params.locationId

// Reactive data
const location = ref(null)
const ads = ref([])
const loading = ref(true)

// Fetch location details
const fetchLocation = async () => {
  try {
    const response = await $fetch(`/api/locations/code/${locationCode}`)
    if (response.success) {
      location.value = response.data
    }
  } catch (error) {
    console.error('Error fetching location:', error)
  }
}

// Fetch location-specific ads
const fetchAds = async () => {
  try {
    const response = await $fetch(`/api/ads/location/code/${locationCode}`)
    if (response.success) {
      ads.value = response.data
    }
  } catch (error) {
    console.error('Error fetching ads:', error)
  }
}

// Track ad click
const trackAdClick = async (adId) => {
  try {
    await $fetch(`/api/ads/${adId}/click`, {
      method: 'POST'
    })
  } catch (error) {
    console.error('Error tracking ad click:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchLocation(),
    fetchAds()
  ])
  loading.value = false
})

// Meta tags
useHead({
  title: computed(() => `Connected to ${location.value?.name || 'UFO Networks'} - Success`),
  meta: [
    { 
      name: 'description', 
      content: computed(() => `Successfully connected to ${location.value?.name || 'UFO Networks'} WiFi. Enjoy high-speed internet and discover local offers.`)
    }
  ]
})
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

#success-page {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  font-family: 'Poppins', sans-serif;
}

/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}
</style>
