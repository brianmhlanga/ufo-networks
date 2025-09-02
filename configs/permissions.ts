// Comprehensive permissions system for UFO Networks
// Based on the Prisma schema and business requirements

export interface Permission {
  id: string
  name: string
  description: string
  category: string
  resource: string
  action: string
}

export interface RolePermissions {
  role: string
  permissions: string[] // Array of permission IDs
}

// All available permissions in the system
export const ALL_PERMISSIONS: Permission[] = [
  // ===== USER MANAGEMENT =====
  {
    id: 'user.view',
    name: 'View Users',
    description: 'View user profiles and information',
    category: 'User Management',
    resource: 'user',
    action: 'view'
  },
  {
    id: 'user.create',
    name: 'Create Users',
    description: 'Create new user accounts',
    category: 'User Management',
    resource: 'user',
    action: 'create'
  },
  {
    id: 'user.edit',
    name: 'Edit Users',
    description: 'Modify user information and profiles',
    category: 'User Management',
    resource: 'user',
    action: 'edit'
  },
  {
    id: 'user.delete',
    name: 'Delete Users',
    description: 'Remove user accounts from the system',
    category: 'User Management',
    resource: 'user',
    action: 'delete'
  },
  {
    id: 'user.blacklist',
    name: 'Blacklist Users',
    description: 'Block users from accessing the system',
    category: 'User Management',
    resource: 'user',
    action: 'blacklist'
  },
  {
    id: 'user.unblacklist',
    name: 'Unblacklist Users',
    description: 'Remove users from blacklist',
    category: 'User Management',
    resource: 'user',
    action: 'unblacklist'
  },

  // ===== AGENT MANAGEMENT =====
  {
    id: 'agent.view',
    name: 'View Agents',
    description: 'View agent profiles and information',
    category: 'Agent Management',
    resource: 'agent',
    action: 'view'
  },
  {
    id: 'agent.create',
    name: 'Create Agents',
    description: 'Create new agent accounts',
    category: 'Agent Management',
    resource: 'agent',
    action: 'create'
  },
  {
    id: 'agent.edit',
    name: 'Edit Agents',
    description: 'Modify agent information and profiles',
    category: 'Agent Management',
    resource: 'agent',
    action: 'edit'
  },
  {
    id: 'agent.delete',
    name: 'Delete Agents',
    description: 'Remove agent accounts',
    category: 'Agent Management',
    resource: 'agent',
    action: 'delete'
  },
  {
    id: 'agent.blacklist',
    name: 'Blacklist Agents',
    description: 'Block agents from accessing the system',
    category: 'Agent Management',
    resource: 'agent',
    action: 'blacklist'
  },
  {
    id: 'agent.unblacklist',
    name: 'Unblacklist Agents',
    description: 'Remove agents from blacklist',
    category: 'Agent Management',
    resource: 'agent',
    action: 'unblacklist'
  },
  {
    id: 'agent.discount',
    name: 'Manage Agent Discounts',
    description: 'Set and modify agent discount percentages',
    category: 'Agent Management',
    resource: 'agent',
    action: 'discount'
  },

  // ===== LOCATION MANAGEMENT =====
  {
    id: 'location.view',
    name: 'View Locations',
    description: 'View WiFi hotspot locations',
    category: 'Location Management',
    resource: 'location',
    action: 'view'
  },
  {
    id: 'location.create',
    name: 'Create Locations',
    description: 'Add new WiFi hotspot locations',
    category: 'Location Management',
    resource: 'location',
    action: 'create'
  },
  {
    id: 'location.edit',
    name: 'Edit Locations',
    description: 'Modify location information',
    category: 'Location Management',
    resource: 'location',
    action: 'edit'
  },
  {
    id: 'location.delete',
    name: 'Delete Locations',
    description: 'Remove WiFi hotspot locations',
    category: 'Location Management',
    resource: 'location',
    action: 'delete'
  },

  // ===== VOUCHER MANAGEMENT =====
  {
    id: 'voucher.view',
    name: 'View Vouchers',
    description: 'View voucher information and status',
    category: 'Voucher Management',
    resource: 'voucher',
    action: 'view'
  },
  {
    id: 'voucher.create',
    name: 'Create Vouchers',
    description: 'Generate new vouchers and batches',
    category: 'Voucher Management',
    resource: 'voucher',
    action: 'create'
  },
  {
    id: 'voucher.edit',
    name: 'Edit Vouchers',
    description: 'Modify voucher properties',
    category: 'Voucher Management',
    resource: 'voucher',
    action: 'edit'
  },
  {
    id: 'voucher.delete',
    name: 'Delete Vouchers',
    description: 'Remove vouchers from the system',
    category: 'Voucher Management',
    resource: 'voucher',
    action: 'delete'
  },
  {
    id: 'voucher.batch',
    name: 'Manage Voucher Batches',
    description: 'Create and manage voucher batches',
    category: 'Voucher Management',
    resource: 'voucher',
    action: 'batch'
  },

  // ===== ORDER MANAGEMENT =====
  {
    id: 'order.view',
    name: 'View Orders',
    description: 'View customer orders and transactions',
    category: 'Order Management',
    resource: 'order',
    action: 'view'
  },
  {
    id: 'order.edit',
    name: 'Edit Orders',
    description: 'Modify order information and status',
    category: 'Order Management',
    resource: 'order',
    action: 'edit'
  },
  {
    id: 'order.refund',
    name: 'Process Refunds',
    description: 'Handle order refunds and cancellations',
    category: 'Order Management',
    resource: 'order',
    action: 'refund'
  },

  // ===== PAYMENT MANAGEMENT =====
  {
    id: 'payment.view',
    name: 'View Payments',
    description: 'View payment information and status',
    category: 'Payment Management',
    resource: 'payment',
    action: 'view'
  },
  {
    id: 'payment.process',
    name: 'Process Payments',
    description: 'Handle payment processing and reconciliation',
    category: 'Payment Management',
    resource: 'payment',
    action: 'process'
  },

  // ===== ADVERTISING MANAGEMENT =====
  {
    id: 'ad.view',
    name: 'View Advertisements',
    description: 'View advertising campaigns and content',
    category: 'Advertising Management',
    resource: 'ad',
    action: 'view'
  },
  {
    id: 'ad.create',
    name: 'Create Advertisements',
    description: 'Create new advertising campaigns',
    category: 'Advertising Management',
    resource: 'ad',
    action: 'create'
  },
  {
    id: 'ad.edit',
    name: 'Edit Advertisements',
    description: 'Modify advertising content and settings',
    category: 'Advertising Management',
    resource: 'ad',
    action: 'edit'
  },
  {
    id: 'ad.delete',
    name: 'Delete Advertisements',
    description: 'Remove advertising campaigns',
    category: 'Advertising Management',
    resource: 'ad',
    action: 'delete'
  },
  {
    id: 'ad.approve',
    name: 'Approve Advertisements',
    description: 'Review and approve ad content',
    category: 'Advertising Management',
    resource: 'ad',
    action: 'approve'
  },

  // ===== SYSTEM ADMINISTRATION =====
  {
    id: 'system.settings',
    name: 'System Settings',
    description: 'Modify system-wide configuration',
    category: 'System Administration',
    resource: 'system',
    action: 'settings'
  },
  {
    id: 'system.audit',
    name: 'View Audit Logs',
    description: 'Access system audit and activity logs',
    category: 'System Administration',
    resource: 'system',
    action: 'audit'
  },
  {
    id: 'system.backup',
    name: 'System Backup',
    description: 'Perform system backups and maintenance',
    category: 'System Administration',
    resource: 'system',
    action: 'backup'
  },
  {
    id: 'system.users',
    name: 'Manage System Users',
    description: 'Create and manage admin users',
    category: 'System Administration',
    resource: 'system',
    action: 'users'
  },

  // ===== REPORTS & ANALYTICS =====
  {
    id: 'reports.view',
    name: 'View Reports',
    description: 'Access system reports and analytics',
    category: 'Reports & Analytics',
    resource: 'reports',
    action: 'view'
  },
  {
    id: 'reports.export',
    name: 'Export Reports',
    description: 'Export data and reports',
    category: 'Reports & Analytics',
    resource: 'reports',
    action: 'export'
  },
  {
    id: 'reports.financial',
    name: 'Financial Reports',
    description: 'Access financial and revenue reports',
    category: 'Reports & Analytics',
    resource: 'reports',
    action: 'financial'
  },

  // ===== CUSTOMER SUPPORT =====
  {
    id: 'support.view',
    name: 'View Support Tickets',
    description: 'Access customer support requests',
    category: 'Customer Support',
    resource: 'support',
    action: 'view'
  },
  {
    id: 'support.resolve',
    name: 'Resolve Support Tickets',
    description: 'Handle and resolve customer issues',
    category: 'Customer Support',
    resource: 'support',
    action: 'resolve'
  }
]

// Default role permissions
export const DEFAULT_ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'SUPER_ADMIN',
    permissions: ALL_PERMISSIONS.map(p => p.id) // All permissions
  },
  {
    role: 'ADMIN',
    permissions: [
      // User Management
      'user.view', 'user.create', 'user.edit', 'user.delete', 'user.blacklist', 'user.unblacklist',
      // Agent Management
      'agent.view', 'agent.create', 'agent.edit', 'agent.delete', 'agent.blacklist', 'agent.unblacklist', 'agent.discount',
      // Location Management
      'location.view', 'location.create', 'location.edit', 'location.delete',
      // Voucher Management
      'voucher.view', 'voucher.create', 'voucher.edit', 'voucher.delete', 'voucher.batch',
      // Order Management
      'order.view', 'order.edit', 'order.refund',
      // Payment Management
      'payment.view', 'payment.process',
      // Advertising Management
      'ad.view', 'ad.create', 'ad.edit', 'ad.delete', 'ad.approve',
      // System Administration
      'system.settings', 'system.audit',
      // Reports & Analytics
      'reports.view', 'reports.export', 'reports.financial',
      // Customer Support
      'support.view', 'support.resolve'
    ]
  },
  {
    role: 'AGENT',
    permissions: [
      // Limited user management (own profile)
      'user.view', 'user.edit',
      // Limited agent management (own profile)
      'agent.view', 'agent.edit',
      // Location viewing
      'location.view',
      // Voucher viewing and limited management
      'voucher.view',
      // Order viewing (own sales)
      'order.view',
      // Limited reports
      'reports.view'
    ]
  },
  {
    role: 'CUSTOMER',
    permissions: [
      // Own profile management
      'user.view', 'user.edit',
      // Location viewing
      'location.view',
      // Own voucher viewing
      'voucher.view',
      // Own order viewing
      'order.view'
    ]
  }
]

// Helper function to get permissions by category
export const getPermissionsByCategory = () => {
  const categories: { [key: string]: Permission[] } = {}
  
  ALL_PERMISSIONS.forEach(permission => {
    if (!categories[permission.category]) {
      categories[permission.category] = []
    }
    categories[permission.category].push(permission)
  })
  
  return categories
}

// Helper function to get permissions for a specific role
export const getPermissionsForRole = (role: string): Permission[] => {
  const rolePermissions = DEFAULT_ROLE_PERMISSIONS.find(rp => rp.role === role)
  if (!rolePermissions) return []
  
  return ALL_PERMISSIONS.filter(permission => 
    rolePermissions.permissions.includes(permission.id)
  )
}

// Helper function to check if a role has a specific permission
export const hasPermission = (role: string, permissionId: string): boolean => {
  const rolePermissions = DEFAULT_ROLE_PERMISSIONS.find(rp => rp.role === role)
  if (!rolePermissions) return false
  
  return rolePermissions.permissions.includes(permissionId)
}
