<template>
  <NuxtLayout name="home">
    <div id="locations-page" class="min-h-screen bg-white">
      <!-- Hero Section -->
      <section class="relative overflow-hidden py-20 bg-cover bg-center bg-no-repeat" style="background-image: url('/images/happy.jpg');">
        <!-- Dark overlay for better text contrast -->
        <div class="absolute inset-0 bg-black/50"></div>
        <div class="container mx-auto px-6 relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Badge -->
            <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-6">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span class="text-sm font-medium text-gray-800">{{ totalLocations }} Active Locations</span>
            </div>

            <!-- Main heading -->
            <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              <span class="block">Find WiFi</span>
              <span class="block bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">Near You</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-lg md:text-xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
              Connect instantly at any of our UFO WIFI Hotspots. Browse available vouchers and get connected in seconds.
            </p>

            <!-- Location Features -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Growing footprint</h3>
                <p class="text-white/80 text-sm">More hotspots coming soon</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Instant Connection</h3>
                <p class="text-white/80 text-sm">Connect in seconds</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 class="text-white font-semibold mb-2">Reliable Service</h3>
                <p class="text-white/80 text-sm">High-speed internet</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Locations Grid -->
      <section class="py-8 bg-white">
        <div class="container mx-auto px-6">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-16">
            <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p class="text-secondary/70">Loading locations...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="locations.length === 0" class="text-center py-16">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="pi pi-map-marker text-3xl text-gray-400"></i>
            </div>
            <h3 class="text-2xl font-bold text-secondary mb-2">No locations found</h3>
            <p class="text-secondary/70 mb-6">Check back soon as we expand our network</p>
          </div>

          <!-- Locations Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
            <div 
              v-for="location in locations" 
              :key="location.id"
              class="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col h-full relative"
            >
              <!-- Card Header with Gradient -->
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white relative overflow-hidden flex items-center">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div class="relative z-10 w-full">
                  <h3 class="text-lg font-bold mb-1 group-hover:text-blue-100 transition-colors line-clamp-2">
                    {{ location.name }}
                  </h3>
                  <div class="flex items-center text-sm text-blue-100">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span class="truncate">{{ formatLocationArea(location) }}</span>
                  </div>
                </div>
              </div>

              <!-- Map Preview -->
              <a
                :href="getMapsLinkForLocation(location)"
                target="_blank"
                rel="noopener noreferrer"
                class="relative block h-40 bg-slate-100 overflow-hidden"
                :aria-label="`View ${location.name} on map`"
              >
                <img
                  :src="getMapImageUrl(location)"
                  :alt="`Map showing ${location.name}`"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  @error="onMapImageError($event, location.id)"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none"></div>
                <div class="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm">
                  <i class="pi pi-map text-blue-600 text-[10px]"></i>
                  View on map
                </div>
              </a>

              <!-- Card Content -->
              <div class="p-4 flex flex-col flex-1 gap-4">
                <div class="space-y-2">
                  <p v-if="location.area" class="text-sm text-gray-600 line-clamp-2">
                    {{ location.area }}
                  </p>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      {{ location.totalVouchers }} voucher{{ location.totalVouchers === 1 ? '' : 's' }} available
                    </span>
                    <span v-if="getLowestPrice(location)" class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      From ${{ getLowestPrice(location) }}
                    </span>
                  </div>
                </div>

                <button 
                  @click="goToVouchers(location.id)"
                  class="mt-auto w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Results Summary -->
          <div v-if="!loading && locations.length > 0" class="text-center mt-12">
            <p class="text-secondary/70">
              {{ totalLocations }} active location{{ totalLocations === 1 ? '' : 's' }}
            </p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 bg-gradient-to-br from-primary to-secondary">
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Can't find your location?
          </h2>
          <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            We're constantly expanding our network. Contact us to request WiFi coverage in your area.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:info@ufo-networks.org?subject=WiFi%20Coverage%20Request"
              class="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-xl hover:bg-gray-50 font-semibold transition-colors"
            >
              Request Coverage
            </a>
            <a
              href="mailto:support@ufo-networks.org"
              class="inline-flex items-center justify-center px-8 py-3 bg-white/20 text-white border border-white/30 rounded-xl hover:bg-white/30 font-semibold transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { primaryColor, secondaryColor } from '~/configs/colors'
import { getMapsLink, getStaticMapUrl, resolveLocationCoords } from '~/utils/locationCoords'

// Reactive data
const locations = ref([])
const loading = ref(true)
const mapImageFallbacks = ref({})

// Computed properties
const totalLocations = computed(() => locations.value?.length || 0)

const formatLocationArea = (location) => {
  return [location.town, location.province].filter(Boolean).join(', ')
}

const getLocationCoords = (location) => {
  if (location.coords?.lat != null && location.coords?.lng != null) {
    return location.coords
  }
  return resolveLocationCoords(location)
}

const getMapImageUrl = (location) => {
  if (mapImageFallbacks.value[location.id]) {
    return mapImageFallbacks.value[location.id]
  }
  const { lat, lng } = getLocationCoords(location)
  return getStaticMapUrl(lat, lng)
}

const getMapsLinkForLocation = (location) => {
  const { lat, lng } = getLocationCoords(location)
  return getMapsLink(lat, lng)
}

const getLowestPrice = (location) => {
  if (!location.voucherTypes?.length) return null
  const lowest = Math.min(...location.voucherTypes.map((type) => Number(type.retailPrice)))
  return lowest.toFixed(2)
}

const onMapImageError = (event, locationId) => {
  mapImageFallbacks.value[locationId] = '/images/happy.jpg'
  event.target.src = '/images/happy.jpg'
}

// Methods
const fetchLocations = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/locations/with-vouchers')
    
    if (response && response.success) {
      locations.value = response.data || []
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
    locations.value = []
  } finally {
    loading.value = false
  }
}

const goToVouchers = (locationId) => {
  navigateTo(`/vouchers?location=${locationId}`)
}

// Meta tags
useHead({
  title: 'UFO Networks Locations – Find WiFi Near You',
  meta: [
    { name: 'description', content: 'Find UFO Networks WiFi locations at our UFO WIFI Hotspots. Browse available vouchers and connect instantly.' }
  ]
})

// Lifecycle
onMounted(() => {
  fetchLocations()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

#locations-page {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Apply Poppins to all elements */
#locations-page * {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Utilities bound to palette */
.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.text-secondary\/80 { color: color-mix(in srgb, var(--secondary) 80%, white); }
.text-secondary\/70 { color: color-mix(in srgb, var(--secondary) 70%, white); }
.text-secondary\/60 { color: color-mix(in srgb, var(--secondary) 60%, white); }
.bg-primary { background-color: var(--primary); }
.bg-secondary { background-color: var(--secondary); }
.bg-primary-900 { background-color: color-mix(in srgb, var(--primary) 90%, black); }
.bg-primary\/10 { background-color: color-mix(in srgb, var(--primary) 10%, transparent); }

/* Hover effects */
.hover\:text-primary:hover { color: var(--primary); }
.hover\:bg-primary-900:hover { background-color: color-mix(in srgb, var(--primary) 90%, black); }
.hover\:bg-gray-50:hover { background-color: #f9fafb; }
.hover\:bg-gray-50:hover { background-color: #f9fafb; }
.hover\:bg-white\/30:hover { background-color: color-mix(in srgb, white 30%, transparent); }

/* Gradients */
.from-primary { --tw-gradient-from: var(--primary); --tw-gradient-to: rgb(255 255 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.to-secondary { --tw-gradient-to: var(--secondary); }

/* Transitions */
.transition-colors { transition: color 0.15s ease-in-out; }
.transition-all { transition: all 0.15s ease-in-out; }

/* Transform utilities */
.transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.hover\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }

/* Glass morphism effects */
.backdrop-blur-sm { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }

/* Additional color utilities */
.bg-gray-100 { background-color: #f3f4f6; }
.bg-gray-50 { background-color: #f9fafb; }
.border-gray-200 { border-color: #e5e7eb; }
.bg-green-500 { background-color: #10b981; }

/* Shadow utilities */
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
.hover\:shadow-2xl:hover { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }

/* Animation */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
