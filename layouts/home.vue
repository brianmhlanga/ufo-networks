<template>
  <div id="home-layout" class="min-h-screen bg-white">
    <!-- Header Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm h-28">
      <div class="container mx-auto px-6 h-full">
        <Menubar :model="menuItems" class="border-none bg-transparent h-full">
          <template #start>
            <NuxtLink to="/" class="flex items-center space-x-3 group">
              
              <div>
                <h1 class="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-all duration-300">UFO Networks</h1>
                <div class="inline-flex items-center px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full shadow-sm">
                  <i class="pi pi-wifi mr-1 sm:mr-1.5 text-xs"></i>
                  <span class="hidden xs:inline">UFO WIFI Hotspots</span>
                  <span class="xs:hidden">UFO WIFI Hotspots</span>
                </div>
              </div>
            </NuxtLink>
          </template>
          
          <template #item="{ item, props, hasSubmenu, root }">
            <NuxtLink v-if="item.route" :to="item.route" class="flex items-center px-4 py-2.5 text-gray-700 hover:text-blue-600 rounded-xl transition-all duration-300 font-medium" v-bind="props.action">
              <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
              <span>{{ item.label }}</span>
              <i v-if="hasSubmenu" class="pi pi-angle-down ml-auto"></i>
            </NuxtLink>
            <a v-else class="flex items-center px-4 py-2.5 text-gray-700 hover:text-blue-600 rounded-xl transition-all duration-300 font-medium" v-bind="props.action">
              <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
              <span>{{ item.label }}</span>
              <i v-if="hasSubmenu" class="pi pi-angle-down ml-auto"></i>
            </a>
          </template>
          
          <template #end>
            <div class="flex items-center gap-3">
              <NuxtLink to="/vouchers">
                <Button class="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <span class="flex items-center">
                    Vouchers
                    <i class="pi pi-ticket ml-2"></i>
                  </span>
                </Button>
              </NuxtLink>
              <NuxtLink to="/login">
                <Button class="px-8 py-2.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-200 hover:text-gray-900 font-semibold shadow-sm hover:shadow-md transition-all duration-300">
                  Sign In
                </Button>
              </NuxtLink>
            </div>
          </template>
        </Menubar>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-28">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div class="container mx-auto px-6 py-16">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <!-- Company Info -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
             
              <h3 class="text-xl font-bold text-white">UFO Networks</h3>
            </div>
            <p class="text-gray-300 text-sm leading-relaxed">
              Connecting Zimbabwe with reliable, high-speed WiFi. Stay connected with our network.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white">Quick Links</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="/" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Home</NuxtLink></li>
              <li><NuxtLink to="/vouchers" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Buy Vouchers</NuxtLink></li>
              <li><NuxtLink to="/locations" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Locations</NuxtLink></li>
              <li><NuxtLink to="/profiles" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Find Agents</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Contact Us</NuxtLink></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white">Support</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Help Center</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Technical Support</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Agent Support</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Report Issue</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm" @click="scrollToTop">Status Page</NuxtLink></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white">Contact Info</h4>
            <div class="space-y-3">
              <div class="flex items-center space-x-3">
                <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <a :href="`mailto:${contactInfo.email}`" class="text-gray-300 text-sm hover:text-primary transition-colors">{{ contactInfo.email }}</a>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <a :href="`tel:${contactInfo.phoneTel}`" class="text-gray-300 text-sm hover:text-primary transition-colors">{{ contactInfo.phone }}</a>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <a :href="contactInfo.whatsappUrl" class="text-gray-300 text-sm hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">{{ contactInfo.whatsapp }}</a>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                </svg>
                <span class="text-gray-300 text-sm">{{ contactInfo.businessHours }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-700 pt-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="text-gray-300 text-sm">
              © 2024 UFO Networks. All rights reserved.
            </div>
            <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-gray-300 text-sm">
              <div class="flex items-center gap-6">
                <NuxtLink to="/terms-of-service" class="hover:text-primary transition-colors">Terms of Service</NuxtLink>
                <NuxtLink to="/privacy-policy" class="hover:text-primary transition-colors">Privacy Policy</NuxtLink>
                <a href="#" class="hover:text-primary transition-colors">Cookie Policy</a>
              </div>
              <span class="text-gray-400">
                Designed by
                <a
                  href="https://www.webdev.co.zw"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:text-blue-300 font-medium transition-colors ml-1"
                >
                  WebDev
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { primaryColor, secondaryColor } from '~/configs/colors'
import { contactInfo } from '~/configs/contact'

// Menu items for PrimeVue Menubar
const menuItems = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/'
  },
  {
    label: 'Locations',
    icon: 'pi pi-map-marker',
    route: '/locations'
  },
  {
    label: 'Agents',
    icon: 'pi pi-users',
    route: '/profiles'
  },
  {
    label: 'Contact',
    icon: 'pi pi-envelope',
    route: '/contact'
  }
])

const scrollToTop = () => {
  if (typeof window === 'undefined') return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

#home-layout {
  --primary: v-bind(primaryColor);
  --secondary: v-bind(secondaryColor);
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Enhanced Header Styles */
header {
  transition: all 0.3s ease;
}

/* Corporate Colors */
:root {
  --corporate-blue: #1d5caa;
  --corporate-black: #000000;
}

/* Logo glow effect */
header .group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

header .group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Navigation hover effects */
header .group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Button hover effects */
header .group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Gradient text animation */
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Enhanced backdrop blur */
.backdrop-blur-2xl {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}

/* PrimeVue Menubar customizations */
.p-menubar {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.p-menubar .p-menubar-root-list {
  background: transparent !important;
}

.p-menubar .p-menuitem-link {
  border-radius: 0.75rem !important;
  transition: all 0.3s ease !important;
}

.p-menubar .p-menuitem-link:hover {
  background: rgba(29, 92, 170, 0.1) !important;
}

/* Mobile menu styling */
.p-menubar .p-menubar-button {
  background: transparent !important;
  border: none !important;
  color: rgb(31 41 55) !important;
  margin-left: auto !important;
  order: 999 !important;
}

.p-menubar .p-menubar-button:hover {
  background: rgba(156, 163, 175, 0.1) !important;
}

/* Ensure mobile menu button is on the far right */
@media (max-width: 1023px) {
  .p-menubar .p-menubar-root-list {
    margin-left: auto !important;
  }
  
  .p-menubar .p-menubar-button {
    margin-left: auto !important;
    order: 999 !important;
  }
}

/* Hide mobile-only items on desktop */
@media (min-width: 1024px) {
  .p-menubar .p-menuitem[data-pc-section="menuitem"].mobile-only {
    display: none !important;
  }
}

/* Style mobile-only buttons */
.p-menubar .p-menuitem.mobile-only .p-menuitem-link {
  background: transparent !important;
  border: none !important;
  padding: 0.75rem 1rem !important;
  margin: 0.25rem 0 !important;
  border-radius: 0.75rem !important;
}

.p-menubar .p-menuitem.mobile-only.primary .p-menuitem-link {
  background: linear-gradient(to right, #1d5caa, #1a4a8a) !important;
  color: white !important;
  font-weight: 600 !important;
}

.p-menubar .p-menuitem.mobile-only.primary .p-menuitem-link:hover {
  background: linear-gradient(to right, #1a4a8a, #164080) !important;
  transform: scale(1.02) !important;
}

.p-menubar .p-menuitem.mobile-only:not(.primary) .p-menuitem-link {
  color: #374151 !important;
  border: 1px solid #e5e7eb !important;
}

.p-menubar .p-menuitem.mobile-only:not(.primary) .p-menuitem-link:hover {
  background: #f9fafb !important;
  color: #1d5caa !important;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced shadow effects */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
/* Logo sizing fix */
header img {
  width: 3rem;
  height: 3rem;
}

/* Corporate color overrides */
.corporate-blue {
  background-color: var(--corporate-blue) !important;
}

.corporate-blue-text {
  color: var(--corporate-blue) !important;
}

.corporate-black {
  background-color: var(--corporate-black) !important;
}

.corporate-black-text {
  color: var(--corporate-black) !important;
}

/* Gradient with corporate colors */
.corporate-gradient {
  background: linear-gradient(to right, var(--corporate-blue), var(--corporate-black)) !important;
}

.corporate-gradient-text {
  background: linear-gradient(to right, var(--corporate-blue), var(--corporate-black));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Clean header background */
header {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Ensure text visibility */
header .text-gray-700 {
  color: #374151 !important;
}

header .text-gray-800 {
  color: #1f2937 !important;
}

header .text-gray-600 {
  color: #4b5563 !important;
}

/* Enhanced button visibility */
header .bg-gradient-to-r {
  background-image: linear-gradient(to right, #1d5caa, #1e40af) !important;
}

/* Tagline pill styling */
header .bg-blue-600 {
  background-color: #1d5caa !important;
  transition: all 0.3s ease;
}

header .bg-blue-600:hover {
  background-color: #1a4a8a !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(29, 92, 170, 0.3);
}

/* Apply Poppins to all elements */
/* #home-layout * {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
} */

/* Header styles */
header {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Utilities bound to palette */
.text-primary { color: var(--primary); }
.text-secondary { color: var(--secondary); }
.bg-primary { background-color: var(--primary); }
.bg-secondary { background-color: var(--secondary); }
.border-primary { border-color: var(--primary); }
.border-secondary { border-color: var(--secondary); }
.border-secondary\/10 { border-color: color-mix(in srgb, var(--secondary) 10%, transparent); }
.bg-primary-900 { background-color: color-mix(in srgb, var(--primary) 90%, black); }
.bg-white\/95 { background-color: color-mix(in srgb, white 95%, transparent); }

/* Hover effects */
.hover\:text-primary:hover { color: var(--primary); }
.hover\:bg-primary-900:hover { background-color: color-mix(in srgb, var(--primary) 90%, black); }
.hover\:bg-gray-50:hover { background-color: #f9fafb; }

/* Gradients */
.from-primary { --tw-gradient-from: var(--primary); --tw-gradient-to: rgb(255 255 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.to-secondary { --tw-gradient-to: var(--secondary); }

/* Transitions */
.transition-colors { transition: color 0.15s ease-in-out; }
.transition-all { transition: all 0.15s ease-in-out; }
.transition-transform { transition: transform 0.15s ease-in-out; }

/* Transform utilities */
.transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.hover\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }

/* Glass morphism effects */
.backdrop-blur-xl { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }

/* Additional color utilities */
.border-gray-100 { border-color: #f3f4f6; }
.border-gray-200 { border-color: #e5e7eb; }
.bg-gray-50 { background-color: #f9fafb; }

/* Shadow utilities */
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
.hover\:shadow-xl:hover { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04); }
</style>
