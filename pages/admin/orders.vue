<template>
  <NuxtLayout name="admin">
    <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p class="text-gray-600">Manage customer orders and track sales</p>
      </div>
      <Button 
        @click="openCreateDialog" 
        icon="add" 
        label="Create Order" 
        class="bg-[#185ff9] hover:bg-[#185ff9]/90"
      />
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Total Orders</p>
              <p class="text-2xl font-bold">{{ stats.totalOrders || 0 }}</p>
            </div>
            <span class="material-icons text-3xl text-blue-200">shopping_cart</span>
          </div>
        </template>
      </Card>

      <Card class="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Total Revenue</p>
              <p class="text-2xl font-bold">${{ (stats.totalRevenue || 0).toFixed(2) }}</p>
            </div>
            <span class="material-icons text-3xl text-green-200">attach_money</span>
          </div>
        </template>
      </Card>

      <Card class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Avg Order Value</p>
              <p class="text-2xl font-bold">${{ (stats.averageOrderValue || 0).toFixed(2) }}</p>
            </div>
            <span class="material-icons text-3xl text-purple-200">trending_up</span>
          </div>
        </template>
      </Card>

      <Card class="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm font-medium">Pending Orders</p>
              <p class="text-2xl font-bold">{{ getStatusCount('PENDING') }}</p>
            </div>
            <span class="material-icons text-3xl text-orange-200">pending</span>
          </div>
        </template>
      </Card>
    </div>

    <!-- Filters -->
    <Card>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <InputText 
              v-model="filters.search" 
              placeholder="Search orders..." 
              class="w-full"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <Select 
              v-model="filters.status" 
              :options="statusOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="All Statuses" 
              class="w-full"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <DatePicker 
              v-model="filters.dateFrom" 
              placeholder="Start Date" 
              class="w-full"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <DatePicker 
              v-model="filters.dateTo" 
              placeholder="End Date" 
              class="w-full"
            />
          </div>
        </div>
        
        <div class="flex justify-end mt-4">
          <Button 
            @click="clearFilters" 
            icon="clear" 
            label="Clear Filters" 
            text 
            severity="secondary"
          />
        </div>
      </template>
    </Card>

    <!-- Orders Table -->
    <Card>
      <template #content>
        <DataTable 
          :value="orders" 
          :loading="loading"
          paginator 
          :rows="pagination.limit"
          :totalRecords="pagination.total"
          :rowsPerPageOptions="[10, 20, 50]"
          @page="onPageChange"
          class="w-full"
        >
          <Column field="id" header="Order ID" sortable style="width: 200px">
            <template #body="{ data }">
              <code class="text-xs bg-gray-100 px-2 py-1 rounded">{{ data.id }}</code>
            </template>
          </Column>
          
          <Column field="buyerName" header="Customer" sortable style="width: 200px">
            <template #body="{ data }">
              <div>
                <div class="font-medium">{{ data.buyerName || data.user?.name || 'Anonymous' }}</div>
                <div class="text-sm text-gray-500">{{ data.buyerEmail || data.user?.email || 'No email' }}</div>
                <div class="text-sm text-gray-500">{{ data.buyerPhone || data.user?.phone || 'No phone' }}</div>
              </div>
            </template>
          </Column>
          
          <Column field="total" header="Total" sortable style="width: 120px">
            <template #body="{ data }">
              <span class="font-medium">${{ parseFloat(data.total).toFixed(2) }}</span>
            </template>
          </Column>
          
          <Column field="status" header="Status" sortable style="width: 120px">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>
          
          <Column field="items" header="Items" style="width: 150px">
            <template #body="{ data }">
              <div class="text-sm">
                <div>{{ data.items?.length || 0 }} items</div>
                <div class="text-gray-500">{{ data.items?.reduce((sum:any, item:any) => sum + item.quantity, 0) || 0 }} vouchers</div>
              </div>
            </template>
          </Column>
          
          <Column field="createdAt" header="Created" sortable style="width: 150px">
            <template #body="{ data }">
              <div class="text-sm">
                {{ formatDate(data.createdAt) }}
              </div>
            </template>
          </Column>
          
          <Column header="Actions" style="width: 120px">
            <template #body="{ data }">
              <div class="flex space-x-2">
                <Button 
                  @click="viewOrder(data)" 
                  icon="visibility" 
                  size="small" 
                  text 
                  severity="info"
                  v-tooltip.top="'View Details'"
                />
                <Button 
                  @click="editOrder(data)" 
                  icon="edit" 
                  size="small" 
                  text 
                  severity="warning"
                  v-tooltip.top="'Edit Order'"
                />
                <Button 
                  @click="confirmDeleteOrder(data)" 
                  icon="delete" 
                  size="small" 
                  text 
                  severity="danger"
                  v-tooltip.top="'Delete Order'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Toast -->
    <Toast />
    
    <!-- Confirm Dialog -->
    <ConfirmDialog />
  </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
// Toast
const toast = useToast()
const confirm = useConfirm()
// Reactive data
const loading:any = ref(false)
const orders:any = ref([])
const stats:any = ref({})
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
})

// Filters
const filters:any = ref({
  search: '',
  status: '',
  dateFrom: null,
  dateTo: null
})

// Options
const statusOptions = ref([
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Failed', value: 'FAILED' }
])

// Lifecycle
onMounted(() => {
  fetchOrders()
  fetchOrderStats()
})

// Methods
const fetchOrders = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.dateFrom) params.append('dateFrom', filters.value.dateFrom.toISOString())
    if (filters.value.dateTo) params.append('dateTo', filters.value.dateTo.toISOString())
    
    const response = await $fetch(`/api/admin/orders?${params}`)
    orders.value = response.orders
    pagination.value = response.pagination
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch orders',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const fetchOrderStats = async () => {
  try {
    const params = new URLSearchParams()
    if (filters.value.dateFrom) params.append('dateFrom', filters.value.dateFrom.toISOString())
    if (filters.value.dateTo) params.append('dateTo', filters.value.dateTo.toISOString())
    
    const response = await $fetch(`/api/admin/orders/stats?${params}`)
    stats.value = response.stats
  } catch (error) {
    console.error('Error fetching order stats:', error)
  }
}

const openCreateDialog = () => {
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Create order functionality coming soon',
    life: 3000
  })
}

const editOrder = (order:any) => {
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Edit order functionality coming soon',
    life: 3000
  })
}

const viewOrder = (order:any) => {
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'View order functionality coming soon',
    life: 3000
  })
}

const confirmDeleteOrder = (order:any) => {
  confirm.require({
    message: `Are you sure you want to delete order ${order.id}?`,
    header: 'Delete Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => deleteOrder(order.id)
  })
}

const deleteOrder = async (orderId:any) => {
  try {
    await $fetch(`/api/admin/orders/${orderId}`, {
      method: 'DELETE'
    })
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Order deleted successfully',
      life: 3000
    })
    
    fetchOrders()
    fetchOrderStats()
  } catch (error) {
    console.error('Error deleting order:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete order',
      life: 3000
    })
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    dateFrom: null,
    dateTo: null
  }
  pagination.value.page = 1
  fetchOrders()
  fetchOrderStats()
}

const onPageChange = (event:any) => {
  pagination.value.page = event.page + 1
  pagination.value.limit = event.rows
  fetchOrders()
}

const getStatusCount = (status:any) => {
  return stats.value.statusBreakdown?.find((s:any) => s.status === status)?.count || 0
}

const getStatusSeverity = (status:any) => {
  const severityMap:any = {
    'PENDING': 'warning',
    'PROCESSING': 'info',
    'COMPLETED': 'success',
    'CANCELLED': 'danger',
    'FAILED': 'danger'
  }
  return severityMap[status] || 'info'
}

const formatDate = (date:any) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch filters for auto-refresh
watch(filters, () => {
  pagination.value.page = 1
  fetchOrders()
  fetchOrderStats()
}, { deep: true })
</script>
