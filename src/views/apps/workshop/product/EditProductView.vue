<script setup lang="ts">
import { defineProps, inject, reactive, watch } from 'vue'
import { VForm } from 'vuetify/components'
import type { PartnerType } from './types'
import { usePartnerStore } from '@/views/apps/workshop/externalservices/usePartner'

// Props
const props = defineProps<{
  partner: PartnerType | null
}>()

// Store
const partnerStore = usePartnerStore()

// Inject formRef
const formRef = inject<typeof VForm | null>('formRef', null)

// Local reactive copy of partner to ensure proper reactivity
const localPartner = reactive<PartnerType>({
  id: '',
  name: '',
  whatsapp: '',
  status: 'ativo',
  recebedor: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  tipo: '',
})

// Watch for changes in props.partner and sync to localPartner
watch(
  () => props.partner,
  (newVal) => {
    if (newVal) {
      Object.assign(localPartner, newVal)
    }
  },
  { immediate: true, deep: true },
)

// Validation rules
const requiredRule = (v: string) => !!v || 'Campo obrigatório'

function maxLengthRule(length: number) {
  return (v: string) => v.length <= length || `Máximo de ${length} caracteres`
}

function stateRule(v: string) {
  return /^[A-Z]{2}$/.test(v) || 'Insira um estado válido (Ex.: SP)'
}

// Format WhatsApp
function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '')

  return digits.length <= 10
    ? digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    : digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

// Format CEP
function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '')

  return digits.replace(/(\d{5})(\d{0,3})/, '$1-$2')
}

// Save changes
async function savePartnerChanges() {
  if (formRef?.value?.validate()) {
    await partnerStore.updatePartner(localPartner.id, localPartner)
    console.log('Parceiro atualizado com sucesso:', localPartner)
  } else {
    console.log('Formulário inválido')
  }
}
</script>

<template>
  <div>
    <VCard class="mb-6" title="Editar Parceiro">
      <VCardText>
        <VForm ref="formRef">
          <VRow>
            <VCol cols="4" md="6">
              <VTextField
                v-model="localPartner.name"
                label="Nome"
                placeholder="Digite o nome"
                :rules="[requiredRule, maxLengthRule(100)]"
                required
              />
            </VCol>
            <VCol cols="4" md="6">
              <VTextField
                v-model="localPartner.whatsapp"
                label="WhatsApp"
                placeholder="(11) 93750-7856"
                :rules="[maxLengthRule(15)]"
                @input="localPartner.whatsapp = formatWhatsApp(localPartner.whatsapp)"
              />
            </VCol>
            <VCol cols="4" md="6">
              <VTextField v-model="localPartner.recebedor" label="Pix" placeholder="Pix do recebedor" />
            </VCol>
            <VCol cols="12" md="4">
              <VSelect v-model="localPartner.status" :items="['ativo', 'inativo']" label="Status" />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="localPartner.cep"
                label="CEP"
                placeholder="12345-678"
                :rules="[maxLengthRule(9)]"
                @input="localPartner.cep = formatCep(localPartner.cep)"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                v-model="localPartner.estado"
                label="Estado"
                placeholder="Ex.: SP"
                maxlength="2"
                :rules="[requiredRule, stateRule]"
              />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="localPartner.logradouro" label="Endereço" placeholder="Rua, Avenida..." />
            </VCol>
            <VCol cols="12" md="3">
              <VTextField v-model="localPartner.numero" label="Número" placeholder="Número" />
            </VCol>
            <VCol cols="12" md="3">
              <VTextField v-model="localPartner.complemento" label="Complemento" placeholder="Ex.: Apt 101" />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="localPartner.bairro" label="Bairro" placeholder="Bairro" />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="localPartner.cidade" label="Cidade" placeholder="Cidade" />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect v-model="localPartner.tipo" :items="['oficina', 'costureira']" label="Tipo" :rules="[requiredRule]" required />
            </VCol>
          </VRow>

        </VForm>
      </VCardText>
    </VCard>
    <VRow class="mt-4">
      <VCol>
        <VBtn color="success" @click="savePartnerChanges">
          Salvar Alterações
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
