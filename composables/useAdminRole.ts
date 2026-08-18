/**
 * Admin role helpers for the UI. `canWrite` is true only for SUPER_ADMIN — the ADMIN role is
 * read-only, so write actions (create/edit/delete/status) are hidden from it. This mirrors the
 * server-side `requireSuperAdmin` guard; the server remains the source of truth.
 */
export function useAdminRole() {
  const { user } = useUserSession()

  const role = computed(() => (user.value as any)?.role || '')
  const isSuperAdmin = computed(() => role.value === 'SUPER_ADMIN')
  const isAdmin = computed(() => role.value === 'ADMIN')
  const canWrite = isSuperAdmin

  return { role, isSuperAdmin, isAdmin, canWrite }
}
