<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'
import AppDrawerHeaderSection from '@core/components/AppDrawerHeaderSection.vue'
import { useUserGroupStore } from "@/store/userGroup";
import {cpfCnpjValidator, emailValidator, requiredValidator} from '@validators'
import UserService from "@/services/User/user.service";
const userService = new UserService()
const userGroupStore = useUserGroupStore()
interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
}

interface Props {
  isDrawerOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
    userService.store.resetUser()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      userService.createOrUpdate({
        ...userService.store.user,
        password: '123456',
        passwordConfirmation: '123456'
      })

      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        userService.store.resetUser()
      })
    }
  })
}

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      :title="!userService.store.user.id ? $t('Add New User') : $t('Edit User')"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <AppTextField
                  v-model="userService.store.user.first_name"
                  :rules="[requiredValidator(userService.store.user.first_name, $t('First Name'))]"
                  :label="$t('First Name')"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="userService.store.user.last_name"
                  :rules="[requiredValidator(userService.store.user.last_name, $t('Last Name'))]"
                  :label="$t('Last Name')"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="userService.store.user.email"
                  :rules="[requiredValidator(userService.store.user.email, $t('Email')), emailValidator]"
                  :label="$t('Email')"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="userService.store.user.document"
                  :rules="[requiredValidator(userService.store.user.document, $t('document')), cpfCnpjValidator]"
                  :label="$t('document')"
                  v-mask="['###.###.###-##', '##.###.###/####-##']"
                />
              </VCol>

              <!-- 👉 Contact -->
              <VCol cols="12">
                <AppTextField
                  v-model="userService.store.user.cellphone"
                  :rules="[requiredValidator(userService.store.user.cellphone, $t('Cellphone'))]"
                  :label="$t('Cellphone')"
                  v-mask="['(##) #####-####', '(##) ####-####']"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="userService.store.user.birth_date"
                  :rules="[requiredValidator(userService.store.user.birth_date, $t('Birth Date'))]"
                  :label="$t('Birth Date')"
                  v-mask="'##/##/####'"
                />
              </VCol>
              <!-- 👉 Roles -->
              <VCol cols="12">
                <AppSelect
                  v-model="userService.store.user.user_group_id"
                  label="Select Role"
                  :rules="[requiredValidator]"
                  item-title="label"
                  item-value="id"
                  :items="userGroupStore.userGroups"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect
                  v-model="userService.store.user.status"
                  :label="$t('Status')"
                  :rules="[requiredValidator]"
                  :items="[{ title: 'Active', value: 1 }, { title: 'Inactive', value: 0 }, { title: 'Pending', value: null }]"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  {{ !userService.store.user.id ? $t('save') : $t('update') }}
                </VBtn>
                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  {{ $t('cancel') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
