export default defineNuxtRouteMiddleware((to) => {
  try {
    const session = useUserSession()
    
    // Handle case where session is completely undefined
    if (!session) {
      console.warn('Session is undefined, allowing request to proceed')
      return
    }
    
    const { loggedIn, user }: any = session

    // If user has a session and hits /login, force redirect to their dashboard
    if (to.path === '/login') {
      const isLoggedIn = loggedIn && loggedIn.value === true
      const currentUser = user && user.value ? user.value : null
      if (isLoggedIn && currentUser?.role) {
        const dashboard =
          currentUser.role === 'AGENT' ? '/agent'
          : ['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role) ? '/admin'
          : '/user'
        if (import.meta.server) {
          console.log('[auth/middleware] Logged-in user on /login, redirecting to', dashboard, 'role:', currentUser.role)
        }
        return navigateTo(dashboard, { replace: true })
      }
      return
    }

    
    // Define protected routes for different user types
    const userRoutes = ['/user']
    const adminRoutes = ['/admin']
    const agentRoutes = ['/agent']
    const companyDashboardRoutes = ['/company/dashboard', '/company/analytics', '/company/reports', '/company/responses', '/company/edit', '/company/subscription', '/company/abuse-reports']
    const authRoutes = ['/login', '/signup']
    
    // Check if current route is protected
    const isUserRoute = userRoutes.some(route => to.path.startsWith(route))
    const isAdminRoute = adminRoutes.some(route => to.path.startsWith(route))
    const isAgentRoute = agentRoutes.some(route => to.path.startsWith(route))
    const isCompanyDashboardRoute = companyDashboardRoutes.some(route => to.path.startsWith(route))
    const isAuthRoute = authRoutes.some(route => to.path === route)
    
    // Any route not in admin, agent, or user folders is public
    const isPublicRoute = !isUserRoute && !isAdminRoute && !isAgentRoute && !isCompanyDashboardRoute
    
    // Add comprehensive null checks for SSR safety
    const isLoggedIn = loggedIn && loggedIn.value === true
    const currentUser = user && user.value ? user.value : null
    
    // Skip authentication for public routes
    if (isPublicRoute) {
      return
    }
    
    // If user is not logged in and trying to access protected routes
    if (!isLoggedIn && (isUserRoute  || isAdminRoute || isAgentRoute || isCompanyDashboardRoute)) {
      return navigateTo(`/login`)
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
