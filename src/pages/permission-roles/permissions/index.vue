<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { Options } from '@core/types'
import { paginationMeta } from '@core/utils'
import PermissionService from '@/services/Permission/permission.service'
import CreatePermissionRoleService from '@/services/Permission/createPermissionRole.service'
import type { IPermission } from '@types/types'
import DialogConfirmation from '@/components/dialogs/DialogConfirmation.vue'

const permissionService = new PermissionService()
const createPermissionRoleService = new CreatePermissionRoleService()

const headers = [
  { title: 'Nome', key: 'subjects' },
  { title: 'Ação', key: 'actions', sortable: false },
  { title: 'Atribuído a', key: 'assignedTo', sortable: false },
  { title: 'Data Criação', key: 'createdAt', sortable: false },
  { title: 'Ações', key: 'acoes', sortable: false },
]

const isDialogConfirmeVisible = ref(false)
const search = ref('')

const options = ref<Options>({
  page: 1,
  perPage: 10,
  sortBy: 'id',
  sortDesc: false,
  total: 1,
  search: null,
  pages: 0,
})

const isPermissionDialogVisible = ref(false)
const isAddPermissionDialogVisible = ref(false)

const colors: any = {
  'read': { color: 'info', text: 'Support' },
  'create': { color: 'success', text: 'Users' },
  'manage': { color: 'warning', text: 'Manager' },
  'administrator': { color: 'primary', text: 'Administrator' },
  'restricted-user': { color: 'error', text: 'Restricted User' },
}

async function fetchPermissions() {
  await permissionService.findAll({
    q: search.value,
    page: options.value.page,
    perPage: options.value.perPage,
    sortBy: options.value.sortBy,
    sortDesc: options.value.sortDesc,
  })
  options.value = {
    page: permissionService.store.pagination.page,
    perPage: permissionService.store.pagination.perPage,
    sortBy: permissionService.store.pagination.sortBy,
    sortDesc: permissionService.store.pagination.sortDesc,
    total: permissionService.store.pagination.total,
  }
}

function updateOptions(value: Options) {
  if (value.sortBy.length === 0)
    return
  options.value = {
    sortBy: value.sortBy[0].key === 'name' ? 'actions' : value.sortBy[0].key,
    sortDesc: value.sortBy[0].order === 'asc',
  }
}

watch(search, fetchPermissions)
watch([() => options.value.page, () => options.value.perPage, () => options.value.sortBy, () => options.value.sortDesc], fetchPermissions)

onMounted(async () => {
  await fetchPermissions()
})

function editPermission(permission: IPermission) {
  console.log(permission)
  permissionService.store.setPermission(permission)
  isAddPermissionDialogVisible.value = true
}

async function onSaveOrUpdate() {
  isPermissionDialogVisible.value = false
  if (permissionService.store.permission.id) {
    await permissionService.update(permissionService.store.permission.id)
    await fetchPermissions()
  }
  else {
    await createPermissionRoleService.createPermissionRole()
    await fetchPermissions()
  }
}

function deletedPermission(permission: IPermission) {
  permissionService.store.setPermission(permission)
  isDialogConfirmeVisible.value = true
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h5 class="text-h4 mb-6">
        {{ $t('Permissions List') }}
      </h5>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VOverlay
          v-if="search === ''"
          v-model="permissionService.store.isLoading"
          contained
          persistent
          class="align-center justify-center"
        >
          <VProgressCircular
            indeterminate
            size="50"
          />
        </VOverlay>
        <VCardText class="d-flex align-center justify-space-between flex-wrap gap-4">
          <AppSelect
            v-model="options.perPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: null, title: $t('All') },
            ]"
            style="width: 5rem;"
          />

          <div class="d-flex align-center gap-4 flex-wrap">
            <AppTextField
              v-model="search"
              :placeholder="$t('Search')"
              density="compact"
              style="width: 12.5rem;"
            />
            <VBtn
              density="default"
              prepend-icon="tabler-plus"
              @click="isAddPermissionDialogVisible = true"
            >
              {{ $t('Permission') }}
            </VBtn>
          </div>
        </VCardText>

        <VDivider />

        <VDataTableServer
          v-model:items-per-page="options.perPage"
          v-model:page="options.page"
          :items-length="options.total"
          :headers="headers"
          :items="permissionService.store.permissions"
          class="text-medium-emphasis text-no-wrap"
          @update:options="updateOptions($event)"
        >
          <!-- Assigned To -->
          <template #item.assignedTo="{ item }">
            <!-- {{ item.raw.assignedTo }} -->
            <div class="d-flex gap-2">
              <VChip
                v-for="permission in item.raw.permissionusergroup"
                :key="permission.id"
                label
                :color="colors[permission.permission.actions].color"
                class="font-weight-medium"
              >
                {{ permission.role.label }}
              </VChip>
            </div>
          </template>

          <template #bottom>
            <VDivider />
            <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
              <p class="text-sm text-disabled mb-0">
                {{ paginationMeta(options, options.total) }}
              </p>

              <VPagination
                v-model="options.page"
                :length="Math.ceil(options.total / options.perPage)"
                :total-visible="$vuetify.display.xs ? 1 : Math.ceil(options.total / options.perPage)"
              >
                <template #prev="slotProps">
                  <VBtn
                    variant="tonal"
                    color="default"
                    v-bind="slotProps"
                    :icon="false"
                  >
                    Previous
                  </VBtn>
                </template>

                <template #next="slotProps">
                  <VBtn
                    variant="tonal"
                    color="default"
                    v-bind="slotProps"
                    :icon="false"
                  >
                    Next
                  </VBtn>
                </template>
              </VPagination>
            </div>
          </template>

          <template #item.createdAt="{ item }">
            <span>{{ $filters.formatDateBr(item.raw.createdAt) }}</span>
          </template>

          <template #item.name="{ item }">
            <span>{{ item.raw.subjects }}</span>
          </template>

          <!-- Actions -->
          <template #item.acoes="{ item }">
            <VBtn
              icon
              size="small"
              color="medium-emphasis"
              variant="text"
              @click="editPermission(item.raw)"
            >
              <VIcon
                size="22"
                icon="tabler-edit"
              />
            </VBtn>
            <VBtn
              icon
              size="small"
              variant="text"
              color="medium-emphasis"
              @click="deletedPermission(item.raw)"
            >
              <VIcon
                size="22"
                icon="tabler-trash"
              />
            </VBtn>
          </template>
        </VDataTableServer>
      </VCard>
      <AddEditPermissionDialog
        v-model:isDialogVisible="isAddPermissionDialogVisible"
        v-model:permission-name="permissionService.store.permission.subjects"
        @onSaveOrUpdate="onSaveOrUpdate"
        @resetPermission="permissionService.store.resetPermission"
      />
    </VCol>

    <DialogConfirmation
      v-model:model-value="isDialogConfirmeVisible"
      title="Confirmação"
      message="Tem certeza que deseja excluir essa permissão?"
      btn-ok-text="Sim, excluir"
      btn-cancel-text="Não"
      btn-ok-color="error"
      btn-cancel-color="error"
      icon="tabler-trash"
      @on-handle-ok="permissionService.delete(permissionService.store.permission.id)"
    />
  </VRow>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
  auth: true
</route>
