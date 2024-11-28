<script setup lang="ts">
import { defineProps, inject } from 'vue'
import { VForm } from 'vuetify/components'
import type { PartnerType } from './types'

// Props
const props = defineProps<{
  partner: PartnerType
}>()

// Inject formRef
const formRef = inject<typeof VForm | null>('formRef', null)

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
  const digits = value.replace(/\D/g, '') // Remove tudo que não for número

  return digits.length <= 10
    ? digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
    : digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

// Format CEP
function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '') // Remove tudo que não for número

  return digits.replace(/(\d{5})(\d{0,3})/, '$1-$2')
}
</script>

<template>
  <VCard
    class="mb-6"
    title="Informações do Parceiro"
  >
    <VCardText>
      <VForm ref="formRef">
        <VRow>
          <VCol
            cols="4"
            md="6"
          >
            <VTextField
              v-model="props.partner.name"
              label="Nome"
              placeholder="Digite o nome"
              :rules="[requiredRule, maxLengthRule(100)]"
              required
            />
          </VCol>
          <VCol
            cols="4"
            md="6"
          >
            <VTextField
              v-model="props.partner.whatsapp"
              label="WhatsApp"
              placeholder="(11) 93750-7856"
              :rules="[maxLengthRule(15)]"
              @input="props.partner.whatsapp = formatWhatsApp(props.partner.whatsapp)"
            />
          </VCol>
          <VCol
            cols="4"
            md="6"
          >
            <VTextField
              v-model="props.partner.recebedor"
              label="Pix"
              placeholder="Pix do recebedor"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VSelect
              v-model="props.partner.status"
              :items="['ativo', 'inativo']"
              label="Status"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="props.partner.cep"
              label="CEP"
              placeholder="12345-678"
              :rules="[maxLengthRule(9)]"
              @input="props.partner.cep = formatCep(props.partner.cep)"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="props.partner.estado"
              label="Estado"
              placeholder="Ex.: SP"
              maxlength="2"
              :rules="[requiredRule, stateRule]"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="props.partner.logradouro"
              label="Endereço"
              placeholder="Rua, Avenida..."
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <VTextField
              v-model="props.partner.numero"
              label="Número"
              placeholder="Número"
            />
          </VCol>
          <VCol
            cols="12"
            md="3"
          >
            <VTextField
              v-model="props.partner.complemento"
              label="Complemento"
              placeholder="Ex.: Apt 101"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="props.partner.bairro"
              label="Bairro"
              placeholder="Bairro"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="props.partner.cidade"
              label="Cidade"
              placeholder="Cidade"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VSelect
              v-model="props.partner.tipo"
              :items="['oficina', 'costureira']"
              label="Tipo"
              :rules="[requiredRule]"
              required
            />
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
  </VCard>
</template>
