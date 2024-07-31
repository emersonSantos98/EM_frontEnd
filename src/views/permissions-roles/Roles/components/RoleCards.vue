<script setup lang="ts">
import girlUsingMobile from '@images/pages/girl-using-mobile.png'
import type { IUserGroupDTO } from '@/api/UserGroup/models/types'

export interface IProps {
  modelValue: IUserGroupDTO[]
}

interface IEmit {
  (e: 'update:modelValue', value: IUserGroupDTO[]): void
}

const props = defineProps<IProps>()

const emit = defineEmits<IEmit>()

const roles = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const isRoleDialogVisible = ref(false)

const roleDetail = ref<RoleDetails>()

const isAddRoleDialogVisible = ref(false)

function editPermission(value: RoleDetails) {
  isRoleDialogVisible.value = true
  roleDetail.value = value
}
</script>

<template>
  <VRow>
    <!-- 👉 Roles -->
    <VCol
      v-for="item in roles"
      :key="item.role"
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard>
        <VCardText class="d-flex align-center pb-1">
          <span>Total {{ item.total }} {{ $t('users') }}</span>
        </VCardText>

        <VCardText class="pb-5">
          <h4 class="text-h4">
            {{ item.label }}
          </h4>
          <div class="d-flex align-center">
            <a
              href="javascript:void(0)"
              @click="editPermission(item.details)"
            >
              Edit Role
            </a>

            <VSpacer />
            <VBtn
              icon
              color="disabled"
              variant="text"
              size="x-small"
            >
              <VIcon
                size="24"
                icon="tabler-copy"
              />
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Add New Roles -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard
        class="h-100"
        :ripple="false"
        @click="isAddRoleDialogVisible = true"
      >
        <VRow
          no-gutters
          class="h-100"
        >
          <VCol
            cols="5"
            class="d-flex flex-column justify-end align-center mt-5"
          >
            <img
              width="85"
              :src="girlUsingMobile"
            >
          </VCol>

          <VCol cols="7">
            <VCardText
              class="d-flex flex-column align-end justify-end gap-2 h-100"
              style="text-align: end;"
            >
              <VBtn class="text-none">
                Adicionar Role
              </VBtn>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
      <AddEditRoleDialog
        v-model:is-dialog-visible="isAddRoleDialogVisible"
        @update:role-permissions="roles = $event"
      />
    </VCol>
  </VRow>

  <AddEditRoleDialog
    v-model:is-dialog-visible="isRoleDialogVisible"
    v-model:role-permissions="roleDetail"
  />
</template>
