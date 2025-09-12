<template>
  <div id="home-layout" class="min-h-screen bg-white">
    <!-- Header Navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-3 group">
              <img src="/logo.png" alt="UFO Networks" class="w-10 h-10 group-hover:scale-105 transition-transform" />
             
            </NuxtLink>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-1">
            <NuxtLink to="/" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Home</NuxtLink>
            <NuxtLink to="/vouchers" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Vouchers</NuxtLink>
            <NuxtLink to="/locations" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Locations</NuxtLink>
            <NuxtLink to="/profiles" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Agents</NuxtLink>
            <NuxtLink to="/contact" class="px-4 py-2 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium">Contact</NuxtLink>
          </nav>

          <!-- CTA Buttons -->
          <div class="hidden lg:flex items-center space-x-3">
            <NuxtLink to="/login">
              <Button label="Sign In" class="px-6 py-2.5 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl font-medium transition-all" text />
            </NuxtLink>
            <NuxtLink to="/signup">
              <Button label="Get Started" class="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-900 font-medium shadow-lg hover:shadow-xl transition-all" />
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <div class="lg:hidden">
            <Button @click="toggleMobileMenu" class="p-3 text-secondary hover:bg-gray-50 rounded-xl transition-all" text>
              <i :class="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="text-xl"></i>
            </Button>
          </div>
        </div>

        <!-- Mobile Navigation Overlay -->
        <div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-xl z-40">
          <nav class="container mx-auto px-6 py-8 space-y-1">
            <NuxtLink to="/" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Home</NuxtLink>
            <NuxtLink to="/vouchers" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Vouchers</NuxtLink>
            <NuxtLink to="/locations" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Locations</NuxtLink>
            <NuxtLink to="/profiles" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Agents</NuxtLink>
            <NuxtLink to="/contact" class="block px-6 py-4 text-secondary hover:text-primary hover:bg-gray-50 rounded-xl transition-all font-medium text-lg" @click="mobileMenuOpen = false">Contact</NuxtLink>
            
            <div class="pt-6 space-y-3">
              <NuxtLink to="/login" class="w-full block" @click="mobileMenuOpen = false">
                <Button label="Sign In" class="w-full px-6 py-3 text-secondary border border-gray-200 rounded-xl hover:bg-gray-50 font-medium text-lg transition-all" text />
              </NuxtLink>
              <NuxtLink to="/signup" class="w-full block" @click="mobileMenuOpen = false">
                <Button label="Get Started" class="w-full px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-900 font-medium text-lg shadow-lg transition-all" />
              </NuxtLink>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-20">
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
              Connecting Zimbabwe with reliable, high-speed WiFi. 
              Stay connected wherever you are with our nationwide network.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="w-8 h-8 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="w-8 h-8 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="w-8 h-8 bg-gray-700 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white">Quick Links</h4>
            <ul class="space-y-3">
              <li><a href="/" class="text-gray-300 hover:text-primary transition-colors text-sm">Home</a></li>
              <li><a href="/vouchers" class="text-gray-300 hover:text-primary transition-colors text-sm">Buy Vouchers</a></li>
              <li><a href="/locations" class="text-gray-300 hover:text-primary transition-colors text-sm">Locations</a></li>
              <li><a href="/profiles" class="text-gray-300 hover:text-primary transition-colors text-sm">Find Agents</a></li>
              <li><a href="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="space-y-4">
            <h4 class="text-lg font-semibold text-white">Support</h4>
            <ul class="space-y-3">
              <li><a href="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm">Help Center</a></li>
              <li><a href="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm">Technical Support</a></li>
              <li><a href="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm">Agent Support</a></li>
              <li><a href="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm">Report Issue</a></li>
              <li><a href="/contact" class="text-gray-300 hover:text-primary transition-colors text-sm">Status Page</a></li>
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
                <span class="text-gray-300 text-sm">support@ufonetworks.com</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span class="text-gray-300 text-sm">+263 77 345 6789</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="text-gray-300 text-sm">Zimbabwe</span>
              </div>
              <div class="flex items-center space-x-3">
                <svg class="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
                </svg>
                <span class="text-gray-300 text-sm">Mon-Fri: 8AM-6PM</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Newsletter Signup -->
        <div class="border-t border-gray-700 pt-8 mb-8">
          <div class="max-w-md mx-auto text-center">
            <h4 class="text-lg font-semibold text-white mb-3">Stay Connected</h4>
            <p class="text-gray-300 text-sm mb-4">Get updates on new locations and special offers</p>
            <div class="flex space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button class="px-6 py-2 bg-primary hover:bg-primary-900 text-white rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-700 pt-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="text-gray-300 text-sm">
              © 2024 UFO Networks. All rights reserved.
            </div>
            <div class="flex items-center gap-6 text-gray-300 text-sm">
              <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { primaryColor, secondaryColor } from '~/configs/colors'

// Mobile menu state
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
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
img.w-10.h-10.group-hover\:scale-105.transition-transform {
    height: auto;
    width: 120px;
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
