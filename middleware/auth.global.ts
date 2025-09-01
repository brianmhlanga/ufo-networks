export default defineNuxtRouteMiddleware((to) => {
  try {
    const session = useUserSession()
    
    // Handle case where session is completely undefined
    if (!session) {
      console.warn('Session is undefined, allowing request to proceed')
      return
    }
    
    // Skip middleware for login page to avoid conflicts with login redirect
    if (to.path === '/login') {
      return
    }
    
    const { loggedIn, user }: any = session
    
    // Define protected routes for different user types
    const userRoutes = ['/user']
    const protectedRoutes = ['/write-review']
    const writeReviewRoutes = ['/write-review-']
    const adminRoutes = ['/admin']
    const agentRoutes = ['/agent']
    const companyDashboardRoutes = ['/company/dashboard', '/company/analytics', '/company/reports', '/company/responses', '/company/edit', '/company/subscription', '/company/abuse-reports']
    const authRoutes = ['/login', '/signup']
    
    // Check if current route is protected
    const isUserRoute = userRoutes.some(route => to.path.startsWith(route))
    const isProtectedRoute = protectedRoutes.some(route => to.path === route)
    const isWriteReviewRoute = writeReviewRoutes.some(route => to.path.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => to.path.startsWith(route))
    const isAgentRoute = agentRoutes.some(route => to.path.startsWith(route))
    const isCompanyDashboardRoute = companyDashboardRoutes.some(route => to.path.startsWith(route))
    const isAuthRoute = authRoutes.some(route => to.path === route)
    
    // Add comprehensive null checks for SSR safety
    const isLoggedIn = loggedIn && loggedIn.value === true
    const currentUser = user && user.value ? user.value : null
    
    // If user is not logged in and trying to access protected routes
    if (!isLoggedIn && (isUserRoute || isProtectedRoute || isWriteReviewRoute || isAdminRoute || isAgentRoute || isCompanyDashboardRoute)) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
    


    // Admin access control - only admins can access admin routes
    if (isLoggedIn && isAdminRoute && !['SUPER_ADMIN', 'ADMIN'].includes(currentUser?.role)) {
      // Non-admin trying to access admin routes, redirect to appropriate dashboard
      if (currentUser?.role === 'AGENT') {
        return navigateTo('/agent')
      } else {
        return navigateTo('/user')
      }
    }

    // Agent access control - only agents can access agent routes
    if (isLoggedIn && isAgentRoute && currentUser?.role !== 'AGENT') {
      // Non-agent trying to access agent routes, redirect to appropriate dashboard
      if (['SUPER_ADMIN', 'ADMIN'].includes(currentUser?.role)) {
        return navigateTo('/admin')
      } else {
        return navigateTo('/user')
      }
    }
  } catch (error) {
    console.warn('Error in auth middleware:', error)
    // During SSR or session initialization errors, allow the request to proceed
    // The page will handle authentication checks on the client side
  }
})
