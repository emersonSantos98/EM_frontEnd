<script setup lang="ts">
import { provide, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import AddPartnerView from '@/views/apps/workshop/externalservices/AddPartnerView.vue'
import { usePartnerStore } from '@/views/apps/workshop/externalservices/usePartner'
import type { PartnerType } from '@/views/apps/workshop/externalservices/types'

// Store
const partnerStore = usePartnerStore()

// Form state
const formRef = ref<VForm | null>(null)

provide('formRef', formRef)

const partner = ref<PartnerType>({
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

// Save partner
async function savePartner() {
  console.log('Salvando parceiro:', formRef.value)
  if (formRef.value?.validate()) {
    await partnerStore.addPartner(partner.value)
    console.log('Parceiro adicionado com sucesso:', partner.value)
  }
  else {
    console.log('Formulário inválido')
  }
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-between align-center gap-4 mb-6">
      <!-- Botões Voltar e Salvar -->
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Adicionar Parceiro Externo
        </h4>
        <span> Preencha as informações do parceiro externo</span>
      </div>
    </div>
    <div class="d-flex gap-4 align-center">
      <VBtn
        color="warning"
        @click="$router.push('/apps/workshop/externalservices/list')"
      >
        <VIcon icon="tabler-arrow-big-left-lines" />
        Voltar
      </VBtn>
    </div>
    <AddPartnerView class="mt-4" :partner="partner" />
    <VBtn
      color="success"
      @click="savePartner"
    >
      Salvar Parceiro
    </VBtn>
  </div>
</template>


<!--<template>-->
<!--  <div>-->
<!--    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">-->
<!--      <div class="d-flex flex-column justify-center">-->
<!--        <h4 class="text-h4 font-weight-medium">-->
<!--          Adicionar Parceiro Externo-->
<!--        </h4>-->
<!--        <span> Preencha as informações do parceiro externo</span>-->
<!--      </div>-->
<!--      <div class="d-flex gap-4 align-start flex-wrap">-->
<!--        <VBtn-->
<!--          variant="tonal"-->
<!--          color="primary"-->
<!--          @click="$router.push('/apps/workshop/externalservices/list')"-->
<!--        >-->
<!--           <VIcon icon="tabler-arrow-big-left-lines" />-->
<!--        </VBtn>-->
<!--      </div>-->
<!--      <div class="d-flex gap-4 align-center flex-wrap">-->
<!--        <VBtn-->
<!--          variant="tonal"-->
<!--          color="success"-->
<!--          @click="savePartner"-->
<!--        >-->
<!--          Salvar Parceiro-->
<!--        </VBtn>-->
<!--      </div>-->
<!--    </div>-->
<!--    <AddPartnerView :partner="partner" />-->
<!--  </div>-->
<!--</template>-->
