<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import { VAvatar } from 'vuetify/components'
import { ref, watchEffect } from 'vue'
import type { ProductData } from '../../types'
import DeleteProduct from '../dialogs/DeleteProduct.vue'
import { tableListProductStore } from '././tableListProductStore'
import GenereteQrCode from '@/views/apps/product/components/dialogs/GenereteQrCode.vue'

const products = ref<ProductData[]>([])
const store = tableListProductStore()
const deleteDialogVisible = ref(false)
const openQrCodeDialog = ref(false)
const itemToDelete = ref<ProductData | null>(null)
const itemToQrCode = ref<ProductData | null>(null)

watchEffect(() => {
  products.value = store.tableProduct
})

function openDeleteDialog(item: ProductData) {
  itemToDelete.value = item
  deleteDialogVisible.value = true
}

function openQrDialog(item: ProductData) {
  itemToQrCode.value = item
  openQrCodeDialog.value = true
}

async function handleDeleteConfirmed(itemId: number) {
  await store.deleteProduct(itemId)
  await store.fetchTableData()
}

// Headers
const headers = [
  { title: 'Produto', key: 'name_product' },
  { title: 'Preço de Venda', key: 'total_cost' },
  { title: 'Estoque', key: 'generalStock' },
  { title: 'Data de Cadastro', key: 'created_at' },
  { title: 'Ações', key: 'actions' },
]
</script>

<template>
  <div>
    <VDataTable
      :headers="headers"
      :items="products"
      :items-per-page="5"
      expand-on-click
    >
      <!-- name_product -->
      <template #item.name_product="{ item }">
        <div class="d-flex align-center">
          <VAvatar
            size="26"
            color="success"
            variant="tonal"
          >
            <VIcon
              size="20"
              color="success"
              class="rounded-0"
            >
              tabler-box-seam
            </VIcon>
          </VAvatar>
          <span class="ms-1 text-no-wrap"> {{ item.props.title.name_product }}</span>
        </div>
      </template>

      <template #item.total_cost="{ item }">
        <VAvatar
          size="26"
          color="success"
          variant="tonal"
        >
          <VIcon
            size="20"
            color="success"
            class="rounded-0"
          >
            tabler-currency-real
          </VIcon>
        </VAvatar>
        <span class="ms-1 text-no-wrap"> {{ item.props.title.total_cost }}</span>
      </template>

      <template #item.generalStock="{ item }">
        <VAvatar
          size="26"
          color="success"
          variant="tonal"
        >
          <VIcon
            size="20"
            color="success"
            class="rounded-0"
          >
            tabler-packages
          </VIcon>
        </VAvatar>
        <span class="ms-1 text-no-wrap"> {{ item.generalStock }}</span>
      </template>

      <template #item.created_at="{ item }">
        <VAvatar
          size="26"
          color="success"
          variant="tonal"
        >
          <VIcon
            size="20"
            color="success"
            class="rounded-0"
          >
            tabler-calendar-week
          </VIcon>
        </VAvatar>
        <span class="ms-1 text-no-wrap"> {{ item.created_at }}</span>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex gap-1">
          <IconBtn
            @click.stop="openQrDialog(item)"
          >
            <VIcon
              icon="tabler-qrcode"
              color="secondary"
            />
          </IconBtn>
          <IconBtn
            :to="{ name: 'product-details-id', params: { id: item.props.title.id } }"
            @click.stop
          >
            <VIcon
              icon="tabler-eye"
              color="info"
            />
          </IconBtn>
          <IconBtn @click.stop>
            <VIcon
              icon="tabler-edit"
              color="warning"
            />
          </IconBtn>
          <IconBtn @click.stop="openDeleteDialog(item)">
            <VIcon
              icon="tabler-trash"
              color="error"
            />
          </IconBtn>
        </div>
      </template>
      <!-- Expanded Row Data -->
      <template #expanded-row="slotProps">
        <tr class="v-data-table__tr">
          <td :colspan="headers.length">
            <p class="my-1">
              Estoque: {{ slotProps.item.props.title.generalStock }}
            </p>
          </td>
        </tr>
      </template>
    </VDataTable>
    <DeleteProduct
      v-model:isDialogVisible="deleteDialogVisible"
      :item="itemToDelete"
      @confirm-delete="handleDeleteConfirmed"
    />
    <GenereteQrCode
      :item="itemToQrCode"
      v-model:isDialogVisible="openQrCodeDialog"
    />
  </div>
</template>
