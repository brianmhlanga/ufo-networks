<template>
  <NuxtLayout name="home">
    <div id="agents-page" class="min-h-screen bg-white">
      <!-- Hero Section -->
      <section class="relative overflow-hidden py-20 bg-gradient-to-br from-[#eff4ff] to-white">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Badge -->
            <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 mb-6">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span class="text-sm font-medium text-secondary">{{ totalAgents }} Active Agents</span>
            </div>

            <!-- Main heading -->
            <h1 class="text-4xl md:text-6xl font-bold text-secondary leading-tight mb-6">
              <span class="block">Find a</span>
              <span class="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Trusted Agent</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-lg md:text-xl text-secondary/80 font-medium max-w-3xl mx-auto leading-relaxed mb-8">
              Connect with our verified agents across Zimbabwe. Buy vouchers in person with cash or get instant digital vouchers.
            </p>

            <!-- Search Bar -->
            <div class="max-w-2xl mx-auto mb-8">
              <div class="relative">
                <input 
                  v-model="searchQuery" 
                  type="text"
                  placeholder="Search agents by name, location, or phone..." 
                  class="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-primary transition-colors outline-none"
                />
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              </div>
            </div>

            <!-- Filter Buttons -->
            <div class="mb-4">
              <p class="text-sm text-secondary/70 mb-3">Select Province:</p>
              <div class="flex flex-wrap items-center justify-center gap-3">
                <Button 
                  v-for="province in provinces" 
                  :key="province"
                  :label="province" 
                  :class="getProvinceButtonClass(province)"
                  @click="toggleProvince(province)"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Agents Grid -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-6">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-16">
            <div class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p class="text-secondary/70">Loading agents...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="filteredAgents.length === 0" class="text-center py-16">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl text-gray-400">👥</span>
            </div>
            <h3 class="text-2xl font-bold text-secondary mb-2">No agents found</h3>
            <p class="text-secondary/70 mb-6">Try adjusting your search or filter criteria</p>
            <Button label="Clear Filters" @click="clearFilters" class="bg-primary text-white rounded-xl" />
          </div>

          <!-- Agents Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            <Card 
              v-for="agent in filteredAgents" 
              :key="`${agent.id}-${agent.agentProfile?.location?.id || 'no-location'}`"
              class="group border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] flex flex-col h-full min-h-[320px] bg-gradient-to-br from-white to-gray-50/30"
            >
              <template #content>
                <div class="p-6 flex flex-col h-full">
                  <!-- Agent Header -->
                  <div class="text-center mb-6">
                    <h3 class="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                      {{ agent.agentProfile.displayName }}
                    </h3>
                    <div class="flex items-center justify-center text-sm text-secondary/70 mb-3">
                      <span class="mr-1">📍</span>
                      <span v-if="agent.agentProfile?.location">
                        {{ agent.agentProfile.location.town }}, {{ agent.agentProfile.location.province }}
                      </span>
                      <span v-else>Location not set</span>
                    </div>
                  </div>

                  <!-- Contact Info -->
                  <div class="mb-6 flex-1">
                    <div class="space-y-3">
                      <div class="flex items-center text-sm text-secondary/80">
                        <span class="mr-2">📧</span>
                        <span class="truncate">{{ agent.email }}</span>
                      </div>
                      <div class="flex items-center text-sm text-secondary/80">
                        <span class="mr-2">📱</span>
                        <span>{{ agent.phone }}</span>
                      </div>
                      <div v-if="agent.agentProfile?.location" class="flex items-center text-sm text-secondary/80">
                        <span class="mr-2">📍</span>
                        <span>{{ agent.agentProfile.location.name }}, {{ agent.agentProfile.location.town }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Buttons -->
                  <div class="mt-auto">
                    <div class="grid grid-cols-3 gap-2">
                      <!-- WhatsApp Button -->
                      <Button 
                        class="bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold py-3 transition-all flex items-center justify-center"
                        @click="openWhatsApp(agent)"
                        v-tooltip.top="'WhatsApp'"
                      >
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </Button>
                      
                      <!-- Email Button -->
                      <Button 
                        class="bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold py-3 transition-all flex items-center justify-center"
                        @click="sendEmail(agent)"
                        v-tooltip.top="'Email'"
                      >
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </Button>
                      
                      <!-- Call Button -->
                      <Button 
                        class="bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold py-3 transition-all flex items-center justify-center"
                        @click="makeCall(agent)"
                        v-tooltip.top="'Call'"
                      >
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- Results Summary -->
          <div v-if="!loading && filteredAgents.length > 0" class="text-center mt-12">
            <p class="text-secondary/70">
              Showing {{ filteredAgents.length }} of {{ totalAgents }} agents
            </p>
          </div>
        </div>
      </section>

      <!-- Become an Agent CTA -->
      <section class="py-16 bg-gradient-to-br from-primary to-secondary">
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Want to Become an Agent?
          </h2>
          <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join our network of trusted agents and start earning by selling WiFi vouchers in your area.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button label="Apply Now" class="px-8 py-3 bg-white text-primary rounded-xl hover:bg-gray-50 font-semibold" />
            <Button label="Learn More" class="px-8 py-3 bg-white/20 text-white border border-white/30 rounded-xl hover:bg-white/30 font-semibold" text />
          </div>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { primaryColor, secondaryColor } from '~/configs/colors'

// Reactive data
const agents = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedProvince = ref(null)

// Computed properties
const totalAgents = computed(() => agents.value?.length || 0)

const provinces = computed(() => {
  if (!agents.value || agents.value.length === 0) return []
  const uniqueProvinces = [...new Set(agents.value.map(agent => agent.agentProfile?.location?.province).filter(Boolean))]
  return uniqueProvinces.sort()
})

const filteredAgents = computed(() => {
  if (!agents.value || agents.value.length === 0) return []
  
  let filtered = agents.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(agent => 
      agent.name.toLowerCase().includes(query) ||
      agent.agentProfile.displayName.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      agent.phone.includes(query) ||
      (agent.agentProfile?.location?.province?.toLowerCase().includes(query) || false) ||
      agent.locations.some(loc => 
        loc.name.toLowerCase().includes(query) ||
        loc.town.toLowerCase().includes(query)
      )
    )
  }

  // Filter by province
  if (selectedProvince.value) {
    filtered = filtered.filter(agent => 
      agent.agentProfile?.location?.province === selectedProvince.value ||
      agent.locations.some(loc => loc.province === selectedProvince.value)
    )
  }

  return filtered
})

// Methods
const fetchAgents = async () => {
  try {
    loading.value = true
    const response = await $fetch('/api/agents')
    
    if (response && response.success) {
      agents.value = response.data || []
      console.log('Fetched agents:', agents.value)
    }
  } catch (error) {
    console.error('Error fetching agents:', error)
    agents.value = []
  } finally {
    loading.value = false
  }
}

const openWhatsApp = (agent) => {
  const firstName = agent.name.split(' ')[0]
  const message = `Hi ${firstName}, I want to buy a UFO Networks Voucher.`
  const phoneNumber = agent.phone.replace(/[^0-9]/g, '') // Remove non-numeric characters
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

const sendEmail = (agent) => {
  const firstName = agent.name.split(' ')[0]
  const subject = 'UFO Networks Voucher Purchase Inquiry'
  const body = `Hi ${firstName},\n\nI would like to purchase a UFO Networks voucher. Please let me know what options are available and how to proceed.\n\nThank you!`
  const emailUrl = `mailto:${agent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(emailUrl, '_blank')
}

const makeCall = (agent) => {
  const phoneUrl = `tel:${agent.phone}`
  window.open(phoneUrl, '_self')
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedProvince.value = null
}

const getProvinceButtonClass = (province) => {
  const baseClasses = 'px-4 py-2 rounded-xl font-medium transition-all'
  const isSelected = selectedProvince.value === province
  
  if (isSelected) {
    return `${baseClasses} bg-primary text-white shadow-lg`
  } else {
    return `${baseClasses} bg-white/80 text-secondary hover:bg-gray-50 border border-gray-200`
  }
}

const toggleProvince = (province) => {
  selectedProvince.value = selectedProvince.value === province ? null : province
}

const getAgentLocation = (agent) => {
  if (agent.agentProfile?.location) {
    const town = agent.agentProfile.location.town || 'Unknown Town'
    const province = agent.agentProfile.location.province || 'Unknown Province'
    return `${town}, ${province}`
  }
  
  return 'Location not set'
}

// Meta tags
useHead({
  title: 'UFO Networks Agents – Find Trusted WiFi Agents',
  meta: [
    { name: 'description', content: 'Find verified UFO Networks agents across Zimbabwe. Buy WiFi vouchers in person with cash or get instant digital vouchers.' }
  ]
})

// Lifecycle
onMounted(() => {
  fetchAgents()
})
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

#agents-page {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Apply Poppins to all elements */
#agents-page * {
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
.text-yellow-400 { color: #fbbf24; }

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
