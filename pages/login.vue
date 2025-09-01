<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Image -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/images/auth.jpg');">
        <!-- Subtle overlay for visual enhancement -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#185ff9]/10 via-[#2d3040]/15 to-[#185ff9]/20"></div>
      </div>
      
      <!-- Feature Pills at Bottom of Image Side -->
      <div class="absolute bottom-8 left-8 right-8 z-10">
        <div class="flex flex-wrap justify-center gap-3">
          <!-- Cheap Vouchers Pill -->
          <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <span class="material-icons text-[#185ff9] text-sm mr-2 group-hover:scale-110 transition-transform">local_offer</span>
            <span class="text-sm font-medium text-[#2d3040]">Cheap Vouchers</span>
          </div>
          
          <!-- 24/7 Availability Pill -->
          <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <span class="material-icons text-[#185ff9] text-sm mr-2 group-hover:scale-110 transition-transform">schedule</span>
            <span class="text-sm font-medium text-[#2d3040]">24/7 Availability</span>
          </div>
          
          <!-- Fast WiFi Pill -->
          <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <span class="material-icons text-[#185ff9] text-sm mr-2 group-hover:scale-110 transition-transform">wifi</span>
            <span class="text-sm font-medium text-[#2d3040]">Fast WiFi</span>
          </div>
          
          <!-- Secure Connection Pill -->
          <div class="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <span class="material-icons text-[#185ff9] text-sm mr-2 group-hover:scale-110 transition-transform">security</span>
            <span class="text-sm font-medium text-[#2d3040]">Secure Connection</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <!-- Background decorative elements for mobile/right side -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
        <div class="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#185ff9]/5 to-transparent rounded-full blur-xl animate-float"></div>
        <div class="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#2d3040]/5 to-transparent rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <!-- Login Container -->
      <div class="relative z-10 w-full max-w-md">
        <!-- Mobile Logo (only shown on mobile) -->
        <div class="text-center mb-8 lg:hidden">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-[#185ff9] to-[#2d3040] rounded-xl flex items-center justify-center shadow-md">
              <span class="material-icons text-white text-lg">wifi</span>
            </div>
            <span class="text-2xl font-bold text-[#2d3040]">UFO Networks</span>
          </div>
        </div>

        <!-- Login Form Card -->
        <Card class="shadow-2xl border-0 overflow-hidden">
          <template #content>
            <!-- Logo and Header inside card (desktop) -->
            <div class="text-center mb-8 hidden lg:block">
              <div class="flex items-center justify-center space-x-2 mb-4">
                <div class="w-10 h-10 bg-gradient-to-br from-[#185ff9] to-[#2d3040] rounded-xl flex items-center justify-center shadow-md">
                  <span class="material-icons text-white text-lg">wifi</span>
                </div>
                <span class="text-2xl font-bold text-[#2d3040]">UFO Networks</span>
              </div>
              <h1 class="text-2xl font-bold text-[#2d3040] mb-2">Welcome Back</h1>
              <p class="text-[#2d3040]/60 text-sm">Sign in to your account to continue</p>
            </div>

            <!-- Mobile header -->
            <div class="text-center mb-8 lg:hidden">
              <h1 class="text-2xl font-bold text-[#2d3040] mb-2">Welcome Back</h1>
              <p class="text-[#2d3040]/60 text-sm">Sign in to your account to continue</p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-5">
              <!-- Email Field -->
              <div class="space-y-2">
                <label for="email" class="block text-sm font-medium text-[#2d3040]">
                  Email Address
                </label>
                <div class="relative">
                  <InputText
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="Enter your email address"
                    class="w-full p-3 pl-10 text-base"
                    required
                  />
                </div>
              </div>

              <!-- Password Field -->
              <div class="space-y-2">
                <label for="password" class="block text-sm font-medium text-[#2d3040]">
                  Password
                </label>
                <div class="relative">
                  <Password
                    id="password"
                    v-model="form.password"
                    placeholder="Enter your password"
                    :feedback="false"
                    :toggleMask="true"
                    class="w-full"
                    required
                  />
                </div>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Checkbox
                    v-model="form.rememberMe"
                    :binary="true"
                    inputId="rememberMe"
                    class="mr-2"
                  />
                  <label for="rememberMe" class="text-sm text-[#2d3040]/70 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <NuxtLink
                  to="/forgot-password"
                  class="text-sm text-[#185ff9] hover:text-[#185ff9]/80 transition-colors font-medium"
                >
                  Forgot password?
                </NuxtLink>
              </div>

              <!-- Login Button -->
              <Button
                type="submit"
                :loading="loading"
                :disabled="loading"
                label="Sign In"
                class="w-full p-3 text-base font-semibold mt-6 custom-primary-button"
              >
                <template #icon>
                  <span class="material-icons text-lg">login</span>
                </template>
              </Button>
            </form>

            <!-- Sign Up Link -->
            <div class="text-center mt-6 pt-4 border-t border-gray-100">
              <p class="text-[#2d3040]/60 text-sm">
                Don't have an account?
                <NuxtLink
                  to="/signup"
                  class="text-[#185ff9] hover:text-[#185ff9]/80 font-medium transition-colors ml-1"
                >
                  Sign up here
                </NuxtLink>
              </p>
            </div>
          </template>
        </Card>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <NuxtLink
            to="/"
            class="inline-flex items-center text-[#2d3040]/50 hover:text-[#2d3040] transition-colors text-sm font-medium"
          >
            <span class="material-icons mr-1 text-base">arrow_back</span>
            Back to home
          </NuxtLink>
        </div>

                 <!-- Features Preview (mobile only) -->
         <div class="mt-6 grid grid-cols-3 gap-3 lg:hidden">
           <div class="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 shadow-sm">
             <span class="material-icons text-[#185ff9] text-lg mb-1">security</span>
             <p class="text-xs text-[#2d3040]/70 font-medium">Secure</p>
           </div>
           <div class="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 shadow-sm">
             <span class="material-icons text-[#185ff9] text-lg mb-1">wifi</span>
             <p class="text-xs text-[#2d3040]/70 font-medium">Fast WiFi</p>
           </div>
           <div class="text-center p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 shadow-sm">
             <span class="material-icons text-[#185ff9] text-lg mb-1">schedule</span>
             <p class="text-xs text-[#2d3040]/70 font-medium">24/7 Support</p>
           </div>
         </div>


      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { primaryColor, secondaryColor } from '~/configs/colors'
import { useToast } from 'primevue/usetoast'

// Toast instance
const toast = useToast()

// Form data
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})



// UI state
const loading = ref(false)
const iconsLoaded = ref(false)

// Check if Material Icons are loaded
onMounted(() => {
  // Test if Material Icons font is loaded
  const testIcon = document.createElement('span')
  testIcon.className = 'material-icons'
  testIcon.textContent = 'wifi'
  testIcon.style.position = 'absolute'
  testIcon.style.left = '-9999px'
  document.body.appendChild(testIcon)
  
  // Check if the font is loaded by comparing computed styles
  const computedStyle = window.getComputedStyle(testIcon)
  iconsLoaded.value = computedStyle.fontFamily.includes('Material Icons')
  
  document.body.removeChild(testIcon)
})

// Form validation
const validateForm = () => {
  let isValid = true

  if (!form.value.email) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Email is required',
      life: 3000
    })
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please enter a valid email address',
      life: 3000
    })
    isValid = false
  }

  if (!form.value.password) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Password is required',
      life: 3000
    })
    isValid = false
  } else if (form.value.password.length < 6) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Password must be at least 6 characters',
      life: 3000
    })
    isValid = false
  }

  return isValid
}

// Handle login
const handleLogin = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      }
    })

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successful!',
        life: 3000
      })

      // Get redirect URL from query params or use default based on role
      const route = useRoute()
      const redirectUrl = route.query.redirect as string
      
      // Redirect immediately after successful login
      console.log('Redirecting user:', response.user.role, 'to:', redirectUrl || '/admin')
      
      if (redirectUrl) {
        await navigateTo(redirectUrl, { replace: true })
      } else {
        // Redirect based on user role
        if (response.user.role === 'SUPER_ADMIN' || response.user.role === 'ADMIN') {
          await navigateTo('/admin', { replace: true })
        } else if (response.user.role === 'AGENT') {
          await navigateTo('/agent', { replace: true })
        } else {
          await navigateTo('/user', { replace: true })
        }
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    let errorMessage = 'Login failed. Please try again.'
    if (error.data?.statusMessage) {
      errorMessage = error.data.statusMessage
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Meta tags for SEO
useHead({
  title: 'Sign In - UFO Networks',
  meta: [
    { name: 'description', content: 'Sign in to your UFO Networks account to access WiFi vouchers and manage your profile.' }
  ]
})
</script>

<style scoped>
/* Import Poppins font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Apply Poppins to all elements */
* {
  font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(180deg); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 4s ease-in-out infinite;
  animation-delay: 1s;
}

/* PrimeVue Component Customization with actual color codes */
:deep(.p-card) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
}

:deep(.p-card .p-card-content) {
  padding: 2rem;
}

:deep(.p-inputtext) {
  border-radius: 10px;
  border: 1px solid rgba(45, 48, 64, 0.15);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

:deep(.p-inputtext:focus) {
  border-color: #185ff9;
  box-shadow: 0 0 0 3px rgba(24, 95, 249, 0.1);
  background: rgba(255, 255, 255, 1);
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  border-radius: 10px;
  border: 1px solid rgba(45, 48, 64, 0.15);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

:deep(.p-password input:focus) {
  border-color: #185ff9;
  box-shadow: 0 0 0 3px rgba(24, 95, 249, 0.1);
  background: rgba(255, 255, 255, 1);
}

:deep(.p-password .p-password-toggle) {
  color: rgba(45, 48, 64, 0.4);
  transition: color 0.2s ease;
}

:deep(.p-password .p-password-toggle:hover) {
  color: #2d3040;
}

:deep(.p-checkbox .p-checkbox-box) {
  border-radius: 4px;
  border: 2px solid rgba(45, 48, 64, 0.2);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #185ff9;
  border-color: #185ff9;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight .p-checkbox-icon) {
  color: white;
}

:deep(.p-button) {
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.875rem;
}

/* Custom primary button with actual color codes */
:deep(.custom-primary-button) {
  background: linear-gradient(135deg, #185ff9 0%, #2d3040 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(24, 95, 249, 0.25);
  border: none !important;
}

:deep(.custom-primary-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(24, 95, 249, 0.35);
  background: linear-gradient(135deg, #185ff9 0%, #2d3040 100%) !important;
  color: white !important;
}

:deep(.custom-primary-button:active) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(24, 95, 249, 0.2);
}

:deep(.custom-primary-button:disabled) {
  background: rgba(45, 48, 64, 0.3) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  transform: none;
  box-shadow: none;
}

/* Override PrimeVue default button styles */
:deep(.p-button.p-button-primary) {
  background: linear-gradient(135deg, #185ff9 0%, #2d3040 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(24, 95, 249, 0.25);
  border: none !important;
}

:deep(.p-button.p-button-primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(24, 95, 249, 0.35);
  background: linear-gradient(135deg, #185ff9 0%, #2d3040 100%) !important;
  color: white !important;
}

:deep(.p-button.p-button-primary:active) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(24, 95, 249, 0.2);
}

:deep(.p-button.p-button-primary:disabled) {
  background: rgba(45, 48, 64, 0.3) !important;
  color: rgba(255, 255, 255, 0.7) !important;
  transform: none;
  box-shadow: none;
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
}

:deep(.p-error) {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Glass morphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Material Icons sizing */
.material-icons {
  font-size: 20px;
}

.material-icons.text-lg {
  font-size: 1.125rem;
}

.material-icons.text-base {
  font-size: 1rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .max-w-md {
    max-width: 100%;
  }
  
  :deep(.p-card .p-card-content) {
    padding: 1.5rem;
  }
}
</style>
