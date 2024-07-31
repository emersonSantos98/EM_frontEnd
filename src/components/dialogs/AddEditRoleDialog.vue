<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import type { IPermission } from '@types/types'

interface Permission {
  name: string
  read: boolean
  write: boolean
  create: boolean
}

interface Roles {
  name: string
  permissions: Permission[]
}

interface Props {
  rolePermissions?: Roles
  isDialogVisible: boolean
}
interface IEmit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'update:rolePermissions', value: Roles): void
}

const props = withDefaults(defineProps<Props>(), {
  rolePermissions: () => ({
    name: '',
    permissions: [],
  }),
})

const emit = defineEmits<IEmit>()

// 👉 Permission List
const permissions = ref<IPermission[]>([
  {
    name: 'User Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Content Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Disputes Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Database Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Financial Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Reporting',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'API Control',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Repository Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Payroll',
    read: false,
    write: false,
    create: false,
  },
])

const isSelectAll = ref(false)
const role = ref('')
const refPermissionForm = ref<VForm>()

const checkedCount = computed(() => {
  let counter = 0

  permissions.value.forEach(permission => {
    Object.entries(permission).forEach(([key, value]) => {
      if (key !== 'name' && value)
        counter++
    })
  })

  return counter
})

const isIndeterminate = computed(() => checkedCount.value > 0 && checkedCount.value < (permissions.value.length * 3))

// select all
watch(isSelectAll, val => {
  permissions.value = permissions.value.map(permission => ({
    ...permission,
    read: val,
    write: val,
    create: val,
  }))
})

// if Indeterminate is false, then set isSelectAll to false
watch(isIndeterminate, () => {
  if (!isIndeterminate.value)
    isSelectAll.value = false
})

// if all permissions are checked, then set isSelectAll to true
watch(permissions, () => {
  if (checkedCount.value === (permissions.value.length * 3))
    isSelectAll.value = true
}, { deep: true })

// if rolePermissions is not empty, then set permissions
watch(props, () => {
  if (props.rolePermissions && props.rolePermissions.permissions.length) {
    role.value = props.rolePermissions.name
    permissions.value = permissions.value.map(permission => {
      const rolePermission = props.rolePermissions?.permissions.find(item => item.name === permission.name)

      if (rolePermission) {
        return {
          ...permission,
          ...rolePermission,
        }
      }

      return permission
    })
  }
})

function onSubmit() {
  const rolePermissions = {
    name: role.value,
    permissions: permissions.value,
  }

  emit('update:rolePermissions', rolePermissions)
  emit('update:isDialogVisible', false)
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}

function onReset() {
  emit('update:isDialogVisible', false)
  isSelectAll.value = false
  refPermissionForm.value?.reset()
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 1000"
    :model-value="props.isDialogVisible"
    @update:model-value="onReset"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="onReset" />

    <VCard class="pa-sm-8 pa-5">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <span class="text-h3 mb-3">
          {{ props.rolePermissions.name ? $t('Edit') : $t('Add New') }} {{ $t('Role') }}
        </span>
        <p class="text-base mb-0">
          {{ $t('Set Role Permissions') }}
        </p>
      </VCardItem>

      <VCardText class="mt-6">
        <!-- 👉 Form -->
        <VForm ref="refPermissionForm">
          <!-- 👉 Roles name -->
          <AppTextField
            v-model="role"
            :label="$t('Role Name')"
            :placeholder="$t('Enter Role Name')"
          />

          <h6 class="text-h4 mt-8 mb-3">
            {{ $t('Administrator Access') }}
          </h6>

          <!-- 👉 Roles Permissions -->

          <VTable class="permission-table text-no-wrap">
            <!-- 👉 Admin  -->
            <tr>
              <td>
                {{ $t('Administrator access') }}
              </td>
              <td colspan="6">
                <VCheckbox
                  v-model="isSelectAll"
                  v-model:indeterminate="isIndeterminate"
                  :label="$t('Select All')"
                />
              </td>
            </tr>

            <!-- 👉 Other permission loop -->
            <template
              v-for="permission in permissions"
              :key="permission.name"
            >
              <tr>
                <td>{{ permission.name }}</td>
                <td>
                  <VCheckbox
                    v-model="permission.read"
                    label="Read"
                  />
                </td>
                <td>
                  <VCheckbox
                    v-model="permission.write"
                    label="Write"
                  />
                </td>
                <td>
                  <VCheckbox
                    v-model="permission.create"
                    label="Create"
                  />
                </td>
                <td>
                  <VCheckbox
                    v-model="permission.create"
                    label="Delete"
                  />
                </td>
                <td>
                  <VCheckbox
                    v-model="permission.create"
                    label="Manage"
                  />
                </td>
              </tr>
            </template>
          </VTable>

          <!-- 👉 Actions button -->
          <div class="d-flex align-center justify-center gap-3 mt-6">
            <VBtn @click="onSubmit">
              {{ $t('save') }}
            </VBtn>

            <VBtn
              color="secondary"
              variant="tonal"
              @click="onReset"
            >
              {{ $t('cancel') }}
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;

    .v-checkbox {
      min-inline-size: 4.75rem;
    }

    &:not(:first-child) {
      padding-inline: 0.5rem;
    }

    .v-label {
      white-space: nowrap;
    }
  }
}
</style>
