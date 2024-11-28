<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { computed, ref, watch } from 'vue'
import { usePartnerStore } from '@/views/apps/workshop/externalservices/usePartner'

// Store de parceiros
const partnerStore = usePartnerStore()

// Filtros e opções de paginação
const searchQuery = ref('')
const selectedStatus = ref<'ativo' | 'inativo' | undefined>()
const selectedType = ref<'costureira' | 'oficina' | 'fornecedor' | undefined>()
const itemsPerPage = ref(10)
const page = ref(1)

// Cabeçalhos da tabela
const headers = [
  { title: 'Nome', key: 'name' },
  { title: 'WhatsApp', key: 'whatsapp' },
  { title: 'Status', key: 'status' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Cidade', key: 'cidade' },
  { title: 'Estado', key: 'estado' },
  { title: 'Ações', key: 'actions', sortable: false },
]

// Buscar colaboradores
async function fetchPartners() {
  await partnerStore.fetchPartners({
    tipo: selectedType.value,
    limit: itemsPerPage.value,
    page: page.value,
    status: selectedStatus.value,
  })
}
fetchPartners()

// Atualizar sempre que filtros ou paginação mudarem
watch([selectedStatus, selectedType, searchQuery, page, itemsPerPage], fetchPartners)

// Computed para a lista de parceiros e total
const partners = computed(() => partnerStore.partners?.rows || []) // Previne erro se 'rows' não existir

const totalPartners = computed(() => partnerStore.partners?.count || 0) // Previne erro se 'count' não existir

// Atualizar opções da tabela
function updateOptions(options: any) {
  page.value = options.page
  itemsPerPage.value = options.itemsPerPage
}

// Deletar parceiro
async function deletePartner(id: string) {
  await partnerStore.deletePartner(id)
  fetchPartners()
}
</script>

<template>
  <div>
    <!-- Filtros -->
    <VCard
      title="Filtros"
      class="mb-6"
    >
      <VCardText>
        <VRow>
          <!-- Status -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedStatus"
              placeholder="Status"
              :items="[{ title: 'Ativo', value: 'ativo' }, { title: 'Inativo', value: 'inativo' }]"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>

          <!-- Tipo -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppSelect
              v-model="selectedType"
              placeholder="Tipo"
              :items="[{ title: 'Costureira', value: 'costureira' }, { title: 'Oficina', value: 'oficina' }, { title: 'Fornecedor', value: 'fornecedor' }]"
              clearable
              clear-icon="tabler-x"
            />
          </VCol>

          <!-- Buscar -->
          <VCol
            cols="12"
            sm="4"
          >
            <AppTextField
              v-model="searchQuery"
              placeholder="Buscar pelo nome"
              density="compact"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Botões e tabela -->
    <div class="d-flex justify-space-between align-center mb-4">
      <VBtn
        color="primary"
        prepend-icon="tabler-plus"
        @click="$router.push('/apps/workshop/externalservices/add')"
      >
        Adicionar Colaborador
      </VBtn>
    </div>

    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      :items="partners"
      :items-length="totalPartners"
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <!-- Nome -->
      <template #item.name="{ item }">
        <span>{{ item.raw.name }}</span>
      </template>

      <!-- WhatsApp -->
      <template #item.whatsapp="{ item }">
        <span>{{ item.raw.whatsapp || 'Não informado' }}</span>
      </template>

      <!-- Status -->
      <template #item.status="{ item }">
        <VChip
          :color="item.raw.status === 'ativo' ? 'success' : 'error'"
          label
        >
          {{ item.raw.status }}
        </VChip>
      </template>

      <!-- Tipo -->
      <template #item.tipo="{ item }">
        <span>{{ item.raw.tipo }}</span>
      </template>

      <!-- Cidade -->
      <template #item.cidade="{ item }">
        <span>{{ item.raw.cidade }}</span>
      </template>

      <!-- Estado -->
      <template #item.estado="{ item }">
        <span>{{ item.raw.estado }}</span>
      </template>

      <!-- Ações -->
      <template #item.actions="{ item }">
        <IconBtn @click="$router.push(`/apps/workshop/externalservices/edit/${item.raw.id}`)">
          <VIcon icon="tabler-edit" />
        </IconBtn>
        <IconBtn @click="deletePartner(item.raw.id)">
          <VIcon icon="tabler-trash" />
        </IconBtn>
      </template>

      <!-- Paginação -->
      <template #bottom>
        <VDivider />
        <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3">
          <p class="text-sm text-medium-emphasis mb-0">
            Mostrando {{ partners.length }} de {{ totalPartners }}
          </p>
          <VPagination
            v-model="page"
            :length="Math.ceil(totalPartners / itemsPerPage)"
          />
        </div>
      </template>
    </VDataTableServer>
  </div>
</template>

<style scoped>
</style>
