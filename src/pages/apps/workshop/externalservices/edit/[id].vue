<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditPartnerView from '@/views/apps/workshop/externalservices/EditPartnerView.vue'
import { usePartnerStore } from '@/views/apps/workshop/externalservices/usePartner'
import type { PartnerType } from '@/views/apps/workshop/externalservices/types'

// Store
const partnerStore = usePartnerStore()

// Router e Route
const route = useRoute()
const router = useRouter()

// Form state
const formRef = ref(null)

// Provide formRef para o componente filho
provide('formRef', formRef)

// Partner state inicializado como reativo
const partner = ref<PartnerType | null>(null)

// Buscar parceiro para edição
async function fetchPartner() {
  const partnerId = route.params.id
  if (!partnerId) {
    console.error('ID do parceiro não foi fornecido!')

    return
  }

  try {
    await partnerStore.fetchOnePartner(partnerId as string)
    partner.value = partnerStore.findOne
    console.log('Dados do parceiro carregados:', partner.value)
  }
  catch (error) {
    console.error('Erro ao buscar parceiro:', error)
  }
}

// Salvar alterações
async function savePartnerChanges() {
  if (formRef.value?.validate()) {
    if (partner.value) {
      await partnerStore.updatePartner(partner.value.id, partner.value)
      console.log('Parceiro atualizado com sucesso:', partner.value)
      router.push('/apps/workshop/externalservices') // Redireciona para a lista
    }
  }
  else {
    console.log('Formulário inválido')
  }
}

// Carregar dados do parceiro ao montar o componente
onMounted(fetchPartner)
</script>

<template>
  <div>
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          Editar Parceiro Externo
        </h4>
        <span>Altere as informações do parceiro externo</span>
      </div>
      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn
          variant="tonal"
          color="primary"
          @click="savePartnerChanges"
        >
          Salvar Alterações
        </VBtn>
      </div>
    </div>
    <EditPartnerView
      v-if="partner"
      :partner="partner"
    />
  </div>
</template>
