<script lang="ts" setup>
import { VDivider } from 'vuetify/components'
import { ref } from 'vue'
import { useProductStore } from '../../productStore'
import { tableListProductStore } from '../table/tableListProductStore'
import type { ProductData, Variation } from '../../types'

const store = useProductStore()
const tableStore = tableListProductStore()
const isDialogVisible = ref(false)
const name_product = ref('')
const description = ref('')
const colorVariations = ref([{ color: '' }])
const sizeVariations = ref([{ size: '' }])
const variations = ref<Variation[]>([])
const barcode = ref('')

const maxNameLength = 255
const maxDescriptionLength = 500
const maxVariationLength = 30

function addColorVariation(index: number) {
  if (index === colorVariations.value.length - 1 && colorVariations.value[index].color !== '')
    colorVariations.value.push({ color: '' })
}

function addSizeVariation(index: number) {
  if (index === sizeVariations.value.length - 1 && sizeVariations.value[index].size !== '')
    sizeVariations.value.push({ size: '' })
}

function removeColorVariation(index: number) {
  if (colorVariations.value.length > 1)
    colorVariations.value.splice(index, 1)
}

function removeSizeVariation(index: number) {
  if (sizeVariations.value.length > 1)
    sizeVariations.value.splice(index, 1)
}

function removeObjectEmpty() {
  colorVariations.value = colorVariations.value.filter(color => color.color !== '')
  sizeVariations.value = sizeVariations.value.filter(size => size.size !== '')
}

async function mapVariations() {
  variations.value = []
  colorVariations.value.forEach(color => {
    if (color.color.trim() !== '') {
      sizeVariations.value.forEach(size => {
        if (size.size.trim() !== '') {
          variations.value.push({
            size: size.size,
            color: color.color,
            stock: 0,
            barcode: barcode.value,
          })
        }
      })
    }
  })
}

async function clearFields() {
  name_product.value = ''
  description.value = ''
  colorVariations.value = [{ color: '' }]
  sizeVariations.value = [{ size: '' }]
  variations.value = []
  barcode.value = ''
}

async function submit() {
  await removeObjectEmpty()
  await mapVariations()
  isDialogVisible.value = false

  const productData: ProductData = {
    name_product: name_product.value,
    description: description.value,
    variations: variations.value,
  }

  await store.create(productData)
  await clearFields()
  await tableStore.fetchTableData()
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="600"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn
        color="primary"
        v-bind="props"
      >
        <VIcon
          start
          icon="tabler-plus"
        />
        Novo Produto
      </VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Adicionar Produto">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="name_product"
              label="Nome do Produto"
              placeholder="Nome do Produto"
              :counter="maxNameLength"
              :maxlength="maxNameLength"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="description"
              label="Descrição do produto"
              placeholder="Descrição do produto"
              :counter="maxDescriptionLength"
              :maxlength="maxDescriptionLength"
              rows="2"
            />
          </VCol>
        </VRow>
        <VDivider class="my-4" />

        <!-- Variations for Colors -->
        <div
          v-for="(variation, index) in colorVariations"
          :key="index"
        >
          <VRow>
            <VCol
              cols="10"
              sm="5"
            >
              <VTextField
                v-model="variation.color"
                label="Cor"
                placeholder="Insira a cor"
                :counter="maxVariationLength"
                :maxlength="maxVariationLength"
                @blur="addColorVariation(index)"
              />
            </VCol>
            <VCol
              cols="2"
              class="d-flex align-center"
            >
              <VIcon
                v-if="colorVariations.length > 1"
                icon="tabler-trash"
                class="cursor-pointer"
                @click="removeColorVariation(index)"
              />
            </VCol>
          </VRow>
        </div>

        <VDivider class="my-4" />

        <!-- Variations for Sizes -->
        <div
          v-for="(variation, index) in sizeVariations"
          :key="index"
        >
          <VRow>
            <VCol
              cols="10"
              sm="5"
            >
              <VTextField
                v-model="variation.size"
                label="Tamanho"
                placeholder="Insira o tamanho"
                :counter="maxVariationLength"
                :maxlength="maxVariationLength"
                @blur="addSizeVariation(index)"
              />
            </VCol>
            <VCol
              cols="2"
              class="d-flex align-center"
            >
              <VIcon
                v-if="sizeVariations.length > 1"
                icon="tabler-trash"
                class="cursor-pointer"
                @click="removeSizeVariation(index)"
              />
            </VCol>
          </VRow>
        </div>

        <VDivider class="my-4" />

        <!-- GTIN (EAN) -->
        <VRow title="GTIN (EAN)">
          <VCol
            cols="12"
            sm="4"
            md="5"
          >
            <VTextField
              v-model="barcode"
              label="GTIN (EAN)"
              placeholder="Insira o GTIN (EAN)"
              type="number"
              :counter="maxVariationLength"
              :maxlength="maxVariationLength"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isDialogVisible = false"
        >
          Cancelar
        </VBtn>
        <VBtn @click="submit">
          Adicionar
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
