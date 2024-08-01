<script setup lang="ts">
import { computed, ref } from 'vue'
import { VAvatar, VBtn, VCard, VCardText, VChip, VCol, VDivider, VForm, VIcon, VRow, VSelect, VSpacer, VTextField } from 'vuetify/components'
import { useCalculateMarketPlacesStore } from '../CalculateMarketPlacesStore'

import { requiredValidator } from '@validators'
import ExportCalculation from '@/views/apps/calculator/components/dialogs/ExportCalculation.vue'

const store = useCalculateMarketPlacesStore()

interface Option {
  title: string
  value: string
}
interface WidgetData {
  title: string
  value: string
  icon: string
  color: string
  porcentagem: string
}
const refForm = ref<VForm>()
const isExportCalcDialogVisible = ref(false)
const programaFreteGratis = ref('sim')
const comissao = ref(14)
const aliquotaImposto = ref(0)
const custoProduto = ref(20)
const margemLucro = ref(17)
const outrasTaxasVenda = ref(0)
const prazoPagamentoFornecedor = ref(0)
const tempoEstoque = ref(0)
const tempoRepasse = ref(0)

const precoVenda = ref<number | null>(0)
const lucroNominal = ref(0)
const capitalGiro = ref(0)

const porcentagemLucro = ref(0)
const porcentagemNominal = ref(0)
const porcentagemCapitalGiro = ref(0)

function formatValue(value: number | null): string {
  if (value === null)
    return ''
  const formattedValue = value.toFixed(2)

  return value < 0 ? `- R$ ${Math.abs(value).toFixed(2)}` : `R$ ${formattedValue}`
}

function formatPorcentagem(value: number | null): string {
  if (value === null)
    return ''

  return `${value.toFixed(2)}%`
}

function getColor(value: number | null): string {
  return value !== null && value < 0 ? 'error' : 'success'
}

const widgetData = computed<WidgetData[]>(() => [
  { title: 'Preço de venda', value: formatValue(precoVenda.value), icon: 'tabler-discount-2', color: getColor(precoVenda.value), porcentagem: formatPorcentagem(porcentagemLucro.value) },
  { title: 'Lucro nominal', value: formatValue(lucroNominal.value), icon: 'tabler-premium-rights', color: getColor(lucroNominal.value), porcentagem: formatPorcentagem(porcentagemNominal.value) },
  { title: 'Capital de giro', value: formatValue(capitalGiro.value), icon: 'tabler-shopping-cart', color: getColor(capitalGiro.value), porcentagem: formatPorcentagem(porcentagemCapitalGiro.value) },
])

const freteGratis = ref<Option[]>([
  { title: 'Sim', value: 'sim' },
  { title: 'Não', value: 'nao' },
])

function calcularPorcentagem(valor: number): number {
  return parseFloat((valor / 100).toString())
}

function primeiraCalculo(valor: number): number {
  return valor / (1 - calcularPorcentagem(aliquotaImposto.value) - calcularPorcentagem(comissao.value) - calcularPorcentagem(margemLucro.value) - calcularPorcentagem(outrasTaxasVenda.value) - 0.5)
}

function segundaCalculo(valor: number): number {
  return (valor + 4) / (1 - calcularPorcentagem(aliquotaImposto.value) - calcularPorcentagem(comissao.value) - calcularPorcentagem(margemLucro.value) - calcularPorcentagem(outrasTaxasVenda.value))
}

function terceiraCalculo(valor: number): number {
  return (valor + 4 + 100) / (1 - calcularPorcentagem(aliquotaImposto.value) - calcularPorcentagem(margemLucro.value) - calcularPorcentagem(outrasTaxasVenda.value))
}

function quartaCalculo(valor: number): number {
  return (valor + 4) / (1 - calcularPorcentagem(aliquotaImposto.value) - calcularPorcentagem(comissao.value) - calcularPorcentagem(margemLucro.value) - 0.06 - calcularPorcentagem(outrasTaxasVenda.value))
}

function quintaCalculo(valor: number): number {
  return (valor + 4 + 100) / (1 - calcularPorcentagem(aliquotaImposto.value) - calcularPorcentagem(margemLucro.value) - calcularPorcentagem(outrasTaxasVenda.value))
}

function calcularValores(): void {
  const custoTotalProduto = parseFloat(custoProduto.value.toString())
  const programaFreteGratisLower = programaFreteGratis.value.toLowerCase()

  let precoVendaTemp: number

  if (primeiraCalculo(custoTotalProduto) < 6) {
    if (primeiraCalculo(custoTotalProduto) >= 0) {
      precoVendaTemp = primeiraCalculo(custoTotalProduto)
    }
    else if (programaFreteGratisLower === 'nao') {
      if (segundaCalculo(custoTotalProduto) * calcularPorcentagem(comissao.value) <= 100)
        precoVendaTemp = segundaCalculo(custoTotalProduto)
      else
        precoVendaTemp = terceiraCalculo(custoTotalProduto)
    }
    else {
      if (quartaCalculo(custoTotalProduto) * calcularPorcentagem(comissao.value) <= 100)
        precoVendaTemp = quartaCalculo(custoTotalProduto)
      else
        precoVendaTemp = quintaCalculo(custoTotalProduto)
    }
  }
  else {
    if (programaFreteGratisLower === 'nao') {
      if (segundaCalculo(custoTotalProduto) * calcularPorcentagem(comissao.value) <= 100)
        precoVendaTemp = segundaCalculo(custoTotalProduto)
      else
        precoVendaTemp = terceiraCalculo(custoTotalProduto)
    }
    else {
      if (quartaCalculo(custoTotalProduto) * calcularPorcentagem(comissao.value) <= 100)
        precoVendaTemp = quartaCalculo(custoTotalProduto)
      else
        precoVendaTemp = quintaCalculo(custoTotalProduto)
    }
  }

  const margemLucroPercentual = calcularPorcentagem(margemLucro.value)

  precoVenda.value = precoVendaTemp
  lucroNominal.value = precoVendaTemp * margemLucroPercentual
  capitalGiro.value = (custoTotalProduto / 30 * tempoEstoque.value) - (custoTotalProduto / 30 * calcularPorcentagem(prazoPagamentoFornecedor.value)) - (precoVendaTemp / 30 * tempoRepasse.value)
  porcentagemNominal.value = (lucroNominal.value / precoVenda.value) * 100
  porcentagemLucro.value = margemLucroPercentual * 100
  porcentagemCapitalGiro.value = (capitalGiro.value / precoVenda.value) * 100
  store.setProduct(parseFloat(custoProduto.value.toString()), parseFloat(porcentagemLucro.value.toFixed(2)))
  store.setCalculateMarketPlace(parseFloat(precoVenda.value.toFixed(2)), parseFloat(lucroNominal.value.toFixed(2)), parseFloat(capitalGiro.value.toFixed(2)))
  store.setParameters(programaFreteGratis.value, parseFloat(comissao.value.toFixed(2)), parseFloat(aliquotaImposto.value.toFixed(2)), parseFloat(outrasTaxasVenda.value.toFixed(2)))
}

function toggleModal() {
  isExportCalcDialogVisible.value = !isExportCalcDialogVisible.value;
}
</script>

<template>
  <div>
    <div>
        <VIcon
          size="50"
          color="warning"
          class="rounded-0"
        >
          tabler-brand-shopee
        </VIcon>

      <span class="ms-1 text-no-wrap  font-weight-black "> Calculadora de Prço Shopee </span>
    </div>

    <!-- 👉 widgets -->
    <VCard class="mb-6 mt-2">
      <VCardText>
        <VRow class="justify-center">
          <template
            v-for="(data, id) in widgetData"
            :key="id"
          >
            <VCol
              cols="12"
              sm="6"
              md="3"
              class="px-6"
            >
              <div
                class="d-flex justify-space-between"
                :class="$vuetify.display.xs
                  ? 'product-widget'
                  : $vuetify.display.sm
                    ? id < 2 ? 'product-widget' : ''
                    : ''"
              >
                <div class="d-flex flex-column gap-y-1">
                  <div class="text-body-2 font-weight-medium text-capitalize text-blue">
                    {{ data.title }}
                  </div>

                  <h4 class="text-h4 my-1">
                    {{ data.value }}
                  </h4>

                  <div class="d-flex">
                    <div class="me-2 text-disabled text-no-wrap">
                      Porcentagem
                    </div>

                    <VChip
                      label
                      color="success"
                    >
                      {{ data.porcentagem }}
                    </VChip>
                  </div>
                </div>

                <VAvatar
                  variant="tonal"
                  rounded
                  size="38"
                  :color="data.color"
                >
                  <VIcon
                    :icon="data.icon"
                    size="28"
                  />
                </VAvatar>
              </div>
            </VCol>
            <VDivider
              v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1
                : $vuetify.display.smAndUp ? id % 2 === 0
                  : false"
              vertical
              inset
              length="95"
            />
          </template>
        </VRow>
      </VCardText>
    </VCard>
    <ExportCalculation v-model:isDialogVisible="isExportCalcDialogVisible" />
    <!-- 👉 products -->
    <VForm
      ref="refForm"
      @submit.prevent="calcularValores"
    >
      <VCard
        title="Atributos para avaliação de preço e margem"
        class="mb-6"
      >
        <VCardText>
          <VRow>
            <!-- 👉 Select Status -->
            <VCol
              cols="12"
              sm="2"
            >
              <VSelect
                v-model="programaFreteGratis"
                placeholder="Programa de Frete Grátis"
                :items="freteGratis"
                clearable
                clear-icon="tabler-x"
                label="Programa de Frete Grátis"
              />
            </VCol>

            <VCol
              cols="12"
              md="2"
            >
              <VTextField
                v-model="comissao"
                label="Comissão do marketplace"
                type="number"
                append-inner-icon="tabler-percentage"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="2"
            >
              <VTextField
                v-model="aliquotaImposto"
                label="Aliquotas de impostos"
                type="number"
                append-inner-icon="tabler-percentage"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="2"
            >
              <VTextField
                v-model="custoProduto"
                label="Custo total do produto"
                type="number"
                append-inner-icon="tabler-currency-real"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="2"
            >
              <VTextField
                v-model="margemLucro"
                label="Margem de lucro"
                type="number"
                append-inner-icon="tabler-percentage"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="2"
            >
              <VTextField
                v-model="outrasTaxasVenda"
                label="Outras taxa"
                type="number"
                append-inner-icon="tabler-percentage"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VDivider class="mt-4" />
      </VCard>
      <VCard
        title="Atributos para avaliação da necessidade de capital de giro"
        class="mb-6"
      >
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="prazoPagamentoFornecedor"

                label="Prazo de pagamento médio com fornecedor"
                type="number"
                append-inner-icon="tabler-percentage"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="tempoEstoque"
                label="Tempo médio de estoque do produto"
                type="number"
                append-inner-icon="tabler-calendar"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <VTextField
                v-model="tempoRepasse"
                label="Tempo de repasse "
                type="number"
                append-inner-icon="tabler-calendar-clock"
                :rules="[requiredValidator]"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
      <VDivider class="my-4" />

      <div class="d-flex flex-wrap gap-4 mx-5">
        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <!-- 👉 Export button -->
          <VBtn
            variant="tonal"
            color="secondary"
            prepend-icon="tabler-upload"
            @click="toggleModal"
          >
            Exportar Calculo
          </VBtn>

          <VBtn
            color="primary"
            prepend-icon="tabler-calculator"
            type="submit"
            @click="refForm?.validate()"
          >
            Calcular
          </VBtn>
        </div>
      </div>
    </VForm>
  </div>
</template>

<style lang="scss" scoped>
.product-widget {
  border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
  padding-block-end: 1rem;
}
</style>
