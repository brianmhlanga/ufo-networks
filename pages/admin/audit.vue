<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#2d3040]">Audit Trail</h1>
        <p class="text-[#2d3040]/60 mt-1">
          Permanent record of system activity. Deleted records are preserved here as snapshots.
        </p>
      </div>
      <Button
        label="Refresh"
        icon="refresh"
        severity="secondary"
        @click="fetchAuditLogs"
      />
    </div>

    <Card>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-[#2d3040] mb-2">Search</label>
            <InputText
              v-model="filters.search"
              placeholder="Search action, entity, actor, IP..."
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2d3040] mb-2">Action</label>
            <Dropdown
              v-model="filters.action"
              :options="actionOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Actions"
              showClear
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-[#2d3040] mb-2">Entity</label>
            <Dropdown
              v-model="filters.entity"
              :options="entityOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="All Entities"
              showClear
              class="w-full"
            />
          </div>
          <div class="flex items-end">
            <Button
              label="Clear Filters"
              severity="secondary"
              class="w-full"
              @click="clearFilters"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #content>
        <DataTable
          :value="logs"
          :loading="loading"
          :paginator="true"
          :rows="pageSize"
          :totalRecords="totalLogs"
          :lazy="true"
          :rowsPerPageOptions="[10, 25, 50, 100]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} events"
          dataKey="id"
          stripedRows
          responsiveLayout="scroll"
          class="p-datatable-sm"
          @page="onPageChange"
        >
          <Column field="createdAt" header="When" sortable style="min-width: 11rem">
            <template #body="{ data }">
              <span class="text-[#2d3040]">{{ formatDateTime(data.createdAt) }}</span>
            </template>
          </Column>

          <Column field="action" header="Action" style="min-width: 12rem">
            <template #body="{ data }">
              <Tag :value="formatAction(data.action)" :severity="getActionSeverity(data.action)" />
            </template>
          </Column>

          <Column field="entity" header="Entity" style="min-width: 10rem">
            <template #body="{ data }">
              <div class="text-[#2d3040]">
                <div class="font-medium">{{ data.entity || '—' }}</div>
                <div v-if="data.entityId" class="text-xs text-[#2d3040]/60 truncate max-w-[12rem]">
                  {{ data.entityId }}
                </div>
              </div>
            </template>
          </Column>

          <Column field="actor" header="Actor" style="min-width: 12rem">
            <template #body="{ data }">
              <div v-if="data.actor" class="text-[#2d3040]">
                <div class="font-medium">{{ data.actor.name || 'Unknown user' }}</div>
                <div class="text-xs text-[#2d3040]/60">{{ data.actor.email || data.actor.role }}</div>
              </div>
              <span v-else class="text-[#2d3040]/60">System</span>
            </template>
          </Column>

          <Column field="ip" header="IP" style="min-width: 8rem">
            <template #body="{ data }">
              <span class="text-[#2d3040]/70 text-sm">{{ data.ip || '—' }}</span>
            </template>
          </Column>

          <Column header="Details" style="min-width: 8rem">
            <template #body="{ data }">
              <Button
                text
                size="small"
                label="View"
                @click="openDetails(data)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Dialog
      v-model:visible="showDetailsDialog"
      modal
      header="Audit Event Details"
      class="w-full max-w-4xl"
    >
      <div v-if="selectedLog" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span class="font-medium text-[#2d3040]">Action:</span> {{ formatAction(selectedLog.action) }}</div>
          <div><span class="font-medium text-[#2d3040]">When:</span> {{ formatDateTime(selectedLog.createdAt) }}</div>
          <div><span class="font-medium text-[#2d3040]">Entity:</span> {{ selectedLog.entity || '—' }}</div>
          <div><span class="font-medium text-[#2d3040]">Entity ID:</span> {{ selectedLog.entityId || '—' }}</div>
          <div><span class="font-medium text-[#2d3040]">Actor:</span> {{ selectedLog.actor?.name || selectedLog.actor?.email || 'System' }}</div>
          <div><span class="font-medium text-[#2d3040]">IP:</span> {{ selectedLog.ip || '—' }}</div>
        </div>

        <div>
          <p class="font-medium text-[#2d3040] mb-2">Stored payload</p>
          <pre class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs overflow-auto max-h-[28rem] whitespace-pre-wrap break-words">{{ formattedDetails }}</pre>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const toast = useToast()

const logs = ref<any[]>([])
const loading = ref(false)
const totalLogs = ref(0)
const currentPage = ref(1)
const pageSize = ref(25)
const showDetailsDialog = ref(false)
const selectedLog = ref<any | null>(null)
const availableActions = ref<string[]>([])
const availableEntities = ref<string[]>([])

const filters = ref({
  search: '',
  action: null as string | null,
  entity: null as string | null,
})

const actionOptions = computed(() =>
  availableActions.value.map((action) => ({
    label: formatAction(action),
    value: action,
  })),
)

const entityOptions = computed(() =>
  availableEntities.value.map((entity) => ({
    label: entity,
    value: entity,
  })),
)

const formattedDetails = computed(() => {
  if (!selectedLog.value?.details) return 'No additional details recorded.'
  return JSON.stringify(selectedLog.value.details, null, 2)
})

const formatAction = (action: string) =>
  action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

const getActionSeverity = (action: string) => {
  if (action.includes('DELETED') || action.includes('FAILED')) return 'danger'
  if (action.includes('CREATED') || action.includes('COMPLETED') || action.includes('RECORDED')) return 'success'
  if (action.includes('UPDATED') || action.includes('CHANGED')) return 'info'
  return 'secondary'
}

const clearFilters = () => {
  filters.value = {
    search: '',
    action: null,
    entity: null,
  }
}

const fetchAuditLogs = async () => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: pageSize.value.toString(),
    })

    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.action) params.append('action', filters.value.action)
    if (filters.value.entity) params.append('entity', filters.value.entity)

    const response: any = await $fetch(`/api/admin/audit-logs?${params}`)
    logs.value = response.data || []
    totalLogs.value = response.total || 0
    availableActions.value = response.filters?.actions || []
    availableEntities.value = response.filters?.entities || []
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch audit logs',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const onPageChange = (event: any) => {
  currentPage.value = event.page + 1
  pageSize.value = event.rows
  fetchAuditLogs()
}

const openDetails = (log: any) => {
  selectedLog.value = log
  showDetailsDialog.value = true
}

watch(filters, () => {
  currentPage.value = 1
  fetchAuditLogs()
}, { deep: true })

onMounted(() => {
  fetchAuditLogs()
})

useHead({
  title: 'Audit Trail - UFO Networks Admin',
  meta: [
    { name: 'description', content: 'View permanent audit trail records for UFO Networks admin activity.' },
  ],
})
</script>
