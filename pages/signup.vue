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

    <!-- Right Side - Registration Form -->
    <div class="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <!-- Background decorative elements for mobile/right side -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
        <div class="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#185ff9]/5 to-transparent rounded-full blur-xl animate-float"></div>
        <div class="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#2d3040]/5 to-transparent rounded-full blur-xl animate-float-delayed"></div>
      </div>

      <!-- Registration Container -->
      <div class="relative z-10 w-full max-w-4xl">
        <!-- Mobile Logo (only shown on mobile) -->
        <div class="text-center mb-8 lg:hidden">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-[#185ff9] to-[#2d3040] rounded-xl flex items-center justify-center shadow-md">
              <span class="material-icons text-white text-lg">wifi</span>
            </div>
            <span class="text-2xl font-bold text-[#2d3040]">UFO Networks</span>
          </div>
        </div>

        <!-- Registration Form Card -->
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
              <h1 class="text-2xl font-bold text-[#2d3040] mb-2">Create Account</h1>
              <p class="text-[#2d3040]/60 text-sm">Join thousands of users enjoying fast WiFi</p>
            </div>

            <!-- Mobile header -->
            <div class="text-center mb-8 lg:hidden">
              <h1 class="text-2xl font-bold text-[#2d3040] mb-2">Create Account</h1>
              <p class="text-[#2d3040]/60 text-sm">Join thousands of users enjoying fast WiFi</p>
            </div>

            <form @submit.prevent="handleRegistration" class="space-y-5">
              <!-- Row 1: Full Name and Email -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Full Name Field -->
                <div class="space-y-2">
                  <label for="name" class="block text-sm font-medium text-[#2d3040]">
                    Full Name
                  </label>
                  <InputText
                    id="name"
                    v-model="form.name"
                    type="text"
                    placeholder="Enter your full name"
                    class="w-full p-3 text-base"
                    :class="{ 'p-invalid': errors.name }"
                    required
                  />
                  <small v-if="errors.name" class="p-error block mt-1">{{ errors.name }}</small>
                </div>

                <!-- Email Field -->
                <div class="space-y-2">
                  <label for="email" class="block text-sm font-medium text-[#2d3040]">
                    Email Address
                  </label>
                  <InputText
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="Enter your email address"
                    class="w-full p-3 text-base"
                    :class="{ 'p-invalid': errors.email }"
                    required
                  />
                  <small v-if="errors.email" class="p-error block mt-1">{{ errors.email }}</small>
                </div>
              </div>

              <!-- Row 2: Phone and Account Type -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Phone Field -->
                <div class="space-y-2">
                  <label for="phone" class="block text-sm font-medium text-[#2d3040]">
                    Phone Number
                  </label>
                  <InputText
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    class="w-full p-3 text-base"
                    :class="{ 'p-invalid': errors.phone }"
                    required
                  />
                  <small v-if="errors.phone" class="p-error block mt-1">{{ errors.phone }}</small>
                </div>

                <!-- Role Selection -->
                <div class="space-y-2">
                  <label for="role" class="block text-sm font-medium text-[#2d3040]">
                    Account Type
                  </label>
                  <Dropdown
                    id="role"
                    v-model="form.role"
                    :options="roleOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select account type"
                    class="w-full"
                    :class="{ 'p-invalid': errors.role }"
                    required
                  />
                  <small v-if="errors.role" class="p-error block mt-1">{{ errors.role }}</small>
                </div>
              </div>

              <!-- Row 3: Password and Confirm Password -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Password Field -->
                <div class="space-y-2">
                  <label for="password" class="block text-sm font-medium text-[#2d3040]">
                    Password
                  </label>
                  <Password
                    id="password"
                    v-model="form.password"
                    placeholder="Create a strong password"
                    :feedback="true"
                    :toggleMask="true"
                    class="w-full"
                    :class="{ 'p-invalid': errors.password }"
                    required
                  />
                  <small v-if="errors.password" class="p-error block mt-1">{{ errors.password }}</small>
                </div>

                <!-- Confirm Password Field -->
                <div class="space-y-2">
                  <label for="confirmPassword" class="block text-sm font-medium text-[#2d3040]">
                    Confirm Password
                  </label>
                  <Password
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    placeholder="Confirm your password"
                    :feedback="false"
                    :toggleMask="true"
                    class="w-full"
                    :class="{ 'p-invalid': errors.confirmPassword }"
                    required
                  />
                  <small v-if="errors.confirmPassword" class="p-error block mt-1">{{ errors.confirmPassword }}</small>
                </div>
              </div>

              <!-- Terms and Conditions -->
              <div class="flex items-start space-x-3">
                <Checkbox
                  v-model="form.acceptTerms"
                  :binary="true"
                  inputId="acceptTerms"
                  class="mt-1"
                  :class="{ 'p-invalid': errors.acceptTerms }"
                />
                <div class="flex-1">
                  <label for="acceptTerms" class="text-sm text-[#2d3040]/70 cursor-pointer leading-relaxed">
                    I agree to the 
                    <NuxtLink to="/terms" class="text-[#185ff9] hover:text-[#185ff9]/80 font-medium">Terms of Service</NuxtLink>
                    and 
                    <NuxtLink to="/privacy" class="text-[#185ff9] hover:text-[#185ff9]/80 font-medium">Privacy Policy</NuxtLink>
                  </label>
                  <small v-if="errors.acceptTerms" class="p-error block mt-1">{{ errors.acceptTerms }}</small>
                </div>
              </div>

              <!-- Register Button -->
              <Button
                type="submit"
                :loading="loading"
                :disabled="loading"
                label="Create Account"
                class="w-full p-3 text-base font-semibold mt-6 custom-primary-button"
              >
                <template #icon>
                  <span class="material-icons text-lg">person_add</span>
                </template>
              </Button>
            </form>

            <!-- Sign In Link -->
            <div class="text-center mt-6 pt-4 border-t border-gray-100">
              <p class="text-[#2d3040]/60 text-sm">
                Already have an account?
                <NuxtLink
                  to="/login"
                  class="text-[#185ff9] hover:text-[#185ff9]/80 font-medium transition-colors ml-1"
                >
                  Sign in here
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

// Form data based on Prisma User model
const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'CUSTOMER',
  acceptTerms: false
})

// Form errors
const errors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: '',
  acceptTerms: ''
})

// UI state
const loading = ref(false)

// Role options based on Prisma schema
const roleOptions = [
  { label: 'Customer', value: 'CUSTOMER' },
  { label: 'Agent', value: 'AGENT' }
]

// Form validation
const validateForm = () => {
  errors.value = { 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '', 
    role: '', 
    acceptTerms: '' 
  }
  let isValid = true

  // Name validation
  if (!form.value.name) {
    errors.value.name = 'Full name is required'
    isValid = false
  } else if (form.value.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
    isValid = false
  }

  // Email validation
  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  // Phone validation
  if (!form.value.phone) {
    errors.value.phone = 'Phone number is required'
    isValid = false
  } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(form.value.phone)) {
    errors.value.phone = 'Please enter a valid phone number'
    isValid = false
  }

  // Password validation
  if (!form.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.value.password)) {
    errors.value.password = 'Password must contain uppercase, lowercase, and number'
    isValid = false
  }

  // Confirm password validation
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  // Role validation
  if (!form.value.role) {
    errors.value.role = 'Please select an account type'
    isValid = false
  }

  // Terms validation
  if (!form.value.acceptTerms) {
    errors.value.acceptTerms = 'You must accept the terms and conditions'
    isValid = false
  }

  return isValid
}

// Handle registration
const handleRegistration = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // TODO: Implement actual registration logic here
    console.log('Registration attempt:', {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      role: form.value.role
    })
    
    // Show success message
    // You can use PrimeVue Toast here
    
  } catch (error) {
    console.error('Registration error:', error)
    // Handle error (show error message)
  } finally {
    loading.value = false
  }
}

// Meta tags for SEO
useHead({
  title: 'Sign Up - UFO Networks',
  meta: [
    { name: 'description', content: 'Create your UFO Networks account to access WiFi vouchers and manage your profile.' }
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

:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-dropdown .p-dropdown-trigger) {
  border-radius: 0 10px 10px 0;
  border: 1px solid rgba(45, 48, 64, 0.15);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

:deep(.p-dropdown .p-dropdown-label) {
  border-radius: 10px 0 0 10px;
  border: 1px solid rgba(45, 48, 64, 0.15);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

:deep(.p-dropdown:not(.p-disabled):hover .p-dropdown-trigger) {
  border-color: #185ff9;
  background: rgba(255, 255, 255, 1);
}

:deep(.p-dropdown:not(.p-disabled):hover .p-dropdown-label) {
  border-color: #185ff9;
  background: rgba(255, 255, 255, 1);
}

:deep(.p-dropdown.p-focus .p-dropdown-trigger) {
  border-color: #185ff9;
  box-shadow: 0 0 0 3px rgba(24, 95, 249, 0.1);
  background: rgba(255, 255, 255, 1);
}

:deep(.p-dropdown.p-focus .p-dropdown-label) {
  border-color: #185ff9;
  box-shadow: 0 0 0 3px rgba(24, 95, 249, 0.1);
  background: rgba(255, 255, 255, 1);
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
  .max-w-4xl {
    max-width: 100%;
  }
  
  :deep(.p-card .p-card-content) {
    padding: 1.5rem;
  }
}
</style>
