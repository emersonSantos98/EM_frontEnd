<script setup lang="ts">
import type {VForm} from 'vuetify/components/VForm'


import {requiredValidator} from '@validators'
const refForm = ref<VForm>()

const nome_organizaca = ref('')
const lastName = ref('')
const cep = ref('')
const stateList = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
]

import avatar1 from '@images/bandeiras/icons8-brazil-96.png'
import avatar2 from '@images/bandeiras/icons8-mexico-96.png'

const friends = ref()

const people = [
  {
    name: 'Brasil',
    avatar: avatar1,
  },
  {
    name: 'México',
    avatar: avatar2,
  }
]

const message = ref('')
const loading = ref(false)


const clickMe = () => {
  loading.value = true
  message.value = ''

  setTimeout(() => {
    loading.value = false
    message.value = ''
  }, 2000)
}


</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard>
        <VCardText>
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  <span class="text-body-5">
                  Dados da organização
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>
        <VDivider/>

        <!-- 👉 Details -->
        <VCardText>
          <VForm ref="refForm"
                 @submit.prevent="() => {}" class="mt-2">
            <VRow>
              <VCol
                  md="8"
                  cols="12"
              >
                <AppTextField
                    v-model="nome_organizaca"
                    label="Nome da organização"
                    :rules="[requiredValidator]"
                />
              </VCol>

              <VCol
                  md="4"
                  cols="12"
              >
                <AppTextField
                    v-model="lastName"
                    label="Documento / CPF / CNPJ"
                    v-mask="['###.###.###-##', '##.###.###/####-##']"
                    :rules="[requiredValidator]"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>


        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-start">
          <VBtn
              variant="elevated"
              class="me-4"
              type="submit"
              @click="refForm?.validate()"
          >
            salvar
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText>
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  <span class="text-body-5">
                     Endereço
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>
        <VDivider/>

        <!-- 👉 Details -->
        <VCardText>
          <VRow>
            <!-- 👉 País -->
            <VCol
                cols="12"
                md="2"
            >
              <AppSelect
                  v-model="friends"
                  :items="people"
                  label="Paìs"
              >
                <template #chip="{ props, item }">
                  <VChip
                      v-bind="props"
                      :prepend-avatar="item.raw.avatar"
                      :text="item.raw.name"
                  />
                </template>

                <template #item="{ props, item }">
                  <VListItem
                      v-bind="props"
                      :prepend-avatar="item?.raw?.avatar"
                      :title="item?.raw?.name"
                  />
                </template>
              </AppSelect>
            </VCol>

            <!-- 👉 Cep -->
            <VCol md="3" cols="12">
              <AppTextField
                  v-model="cep"
                  clearable
                  label="Cep"
                  v-mask="['#####-###', '#####']"
                  type="text"
                  class="textfield-demo-icon-slot"
              >

                <!-- AppendInner -->
                <template #append-inner>
                  <VFadeTransition leave-absolute>
                    <VProgressCircular
                        v-if="loading"
                        color="primary"
                        indeterminate
                    />
                  </VFadeTransition>
                </template>

                <!-- Append -->
                <template #append>
                  <VBtn
                      :icon="$vuetify.display.smAndDown"
                      @click="clickMe"
                  >
                    <VIcon icon="tabler-search" v-if="$vuetify.display.mdAndUp" />
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>

            <!-- 👉 Address -->
            <VCol md="5" cols="12">
              <AppTextarea
                  label="Endereço"
                  rows="1"
              />
            </VCol>

            <!-- 👉 Número -->
            <VCol
                cols="12"
                md="2"
            >
              <AppTextField
                  label="Número"
                  type="number"
              />
            </VCol>

            <!-- 👉 Bairro -->
            <VCol
                cols="12"
                md="4"
            >
              <AppTextField label="Bairro"/>
            </VCol>

            <!-- 👉 Complemente -->
            <VCol
                cols="12"
                md="8"
            >
              <AppTextField label="Complemento"/>
            </VCol>

            <!-- 👉 Cidade -->
            <VCol
                cols="12"
                md="6"
            >
              <AppSelect
                  :items="stateList"
                  label="Cidade"
              />
            </VCol>

            <!-- 👉 Estado -->
            <VCol
                cols="12"
                md="6"
            >
              <AppSelect
                  :items="stateList"
                  label="Estado"
              />
            </VCol>
          </VRow>
        </VCardText>


        <!-- 👉 salvar and Suspend button -->
        <VCardText class="d-flex justify-start">
          <VBtn
              variant="elevated"
              class="me-4"
          >
            salvar
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}


.textfield-demo-icon-slot {
  :deep(.v-input) {
    align-content: center;

    .v-input__prepend,
    .v-input__append {
      padding-block-start: 0 !important;
    }

    .v-input__prepend {
      align-items: center;
    }

    .v-field__append-inner .v-progress-circular svg {
      block-size: 1.3em;
      inline-size: 1.3em;
    }

    .v-field__append-inner svg {
      margin-block-start: 0.1rem;
    }
  }
}
</style>
