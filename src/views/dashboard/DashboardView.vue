<script setup>
import { computed, ref } from 'vue'
import LineChart from './components/LineChart.vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()
const selectedProduct = ref(null)

const keyMetrics = computed(() => [
  {
    title: 'Total de Produtos',
    value: store.stockMetrics.totalProducts,
    icon: 'mdi-package-variant',
    color: 'primary',
  },
  {
    title: 'Produtos em Baixa',
    value: store.stockMetrics.lowStock,
    icon: 'mdi-alert',
    color: 'warning',
  },
  {
    title: 'Sem Estoque',
    value: store.stockMetrics.outOfStock,
    icon: 'mdi-package-variant-closed',
    color: 'error',
  },
  {
    title: 'Movimentações do Mês',
    value: store.stockMetrics.monthlyMovements,
    icon: 'mdi-transfer',
    color: 'success',
  },
])

const getStockAlertColor = (current, min) => current === 0 ? 'error' : current < min ? 'warning' : 'success'
const getVariationStockColor = stock => stock === 0 ? 'error' : stock < 5 ? 'warning' : 'success'
const getStockColor = product => product.currentStock < product.minStock ? 'error' : 'success'

function getStatusColor(status) {
  return {
    'Em Estoque': 'success',
    'Baixo Estoque': 'warning',
    'Sem Estoque': 'error',
  }[status]
}

const getStockPercentage = product => (product.currentStock / product.maxStock) * 100

const chartData = computed(() => ({
  labels: store.productMovementData.labels,
  data: store.productMovementData.data,
}))
</script>

<template>
  <VContainer
    fluid
    class="dashboard-container"
  >
    <VRow class="mb-6">
      <VCol
        v-for="metric in keyMetrics"
        :key="metric.title"
        cols="12"
        md="3"
      >
        <VCard
          class="metric-card"
          :class="`border-${metric.color}`"
        >
          <VCardText class="pa-4">
            <div class="d-flex align-center">
              <div
                class="metric-icon"
                :class="`bg-${metric.color}-lighten-4`"
              >
                <VIcon
                  :color="metric.color"
                  size="32"
                >
                  {{ metric.icon }}
                </VIcon>
              </div>
              <div class="ms-4">
                <div class="text-h5 font-weight-bold">
                  {{ metric.value }}
                </div>
                <div class="text-subtitle-2 text-medium-emphasis">
                  {{ metric.title }}
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <VCard>
          <VCardTitle class="d-flex align-center py-4 px-6">
            Projeção de Estoque - Próximo Mês
          </VCardTitle>
          <VCardText>
            <VList>
              <VListItem
                v-for="projection in store.stockProjections"
                :key="projection.product"
              >
                <template #prepend>
                  <VIcon :color="projection.trend === 'up' ? 'success' : 'error'">
                    {{ projection.trend === 'up' ? 'mdi-trending-up' : 'mdi-trending-down' }}
                  </VIcon>
                </template>

                <VListItemTitle>{{ projection.product }}</VListItemTitle>

                <VListItemSubtitle>
                  <div class="d-flex align-center mt-2">
                    <VChip
                      color="primary"
                      size="small"
                      class="me-2"
                    >
                      Atual: {{ projection.currentStock }}
                    </VChip>
                    <VIcon
                      size="small"
                      color="primary"
                    >
                      mdi-arrow-right
                    </VIcon>
                    <VChip
                      :color="projection.projectedStock < projection.minStock ? 'error' : 'success'"
                      size="small"
                      class="ms-2"
                    >
                      Projeção: {{ projection.projectedStock }}
                    </VChip>
                  </div>
                  <div class="mt-2 text-caption">
                    {{ projection.reason }}
                  </div>
                </VListItemSubtitle>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="6"
      >
        <VCard>
          <VCardTitle class="py-4 px-6">
            Fatores de Impacto - {{ store.nextMonth }}
          </VCardTitle>
          <VCardText>
            <VTimeline density="compact">
              <VTimelineItem
                v-for="event in store.seasonalEvents"
                :key="event.date"
                :dot-color="event.impact"
                size="small"
              >
                <template #opposite>
                  {{ event.date }}
                </template>
                <VCard variant="outlined">
                  <VCardTitle class="text-subtitle-2">
                    {{ event.name }}
                  </VCardTitle>
                  <VCardText>
                    {{ event.description }}
                  </VCardText>
                </VCard>
              </VTimelineItem>
            </VTimeline>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <VCard>
          <VCardTitle class="d-flex align-center py-4 px-6">
            <span>Movimentação de Produtos</span>
            <VSpacer />
            <VSelect
              v-model="selectedProduct"
              :items="productList"
              label="Selecionar Produto"
              density="compact"
              class="w-25"
            />
          </VCardTitle>
          <VCardText style="height: 400px">
            <LineChart :data="chartData" />
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <VCard class="stock-alerts">
          <VCardTitle class="d-flex align-center py-4">
            <span class="me-2">Alertas de Estoque</span>
            <VBadge
              :content="store.stockAlerts.length"
              color="error"
              class="ms-2"
            />
          </VCardTitle>

          <VDivider />
          <VCardText class="pa-0">
            <VList>
              <VListItem
                v-for="alert in store.stockAlerts"
                :key="alert.product"
                class="py-4"
              >
                <template #prepend>
                  <VIcon
                    :color="getStockAlertColor(alert.currentStock, alert.minStock)"
                    icon="mdi-alert-circle"
                    class="me-2"
                  />
                </template>
                <VListItemTitle class="font-weight-medium">
                  {{ alert.product }}
                </VListItemTitle>
                <VListItemSubtitle>
                  <div class="mt-2">
                    <VChip
                      v-for="(stock, size) in alert.variations"
                      :key="size"
                      :color="getVariationStockColor(stock)"
                      size="small"
                      class="me-2"
                    >
                      {{ size }}: {{ stock }}
                    </VChip>
                  </div>
                </VListItemSubtitle>
                <template #append>
                  <VBtn
                    icon="mdi-refresh"
                    variant="text"
                    size="small"
                    color="primary"
                  />
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard>
          <VCardTitle class="py-4">
            Produtos Mais Movimentados
          </VCardTitle>
          <VCardText>
            <VTable>
              <thead>
              <tr>
                <th>Produto</th>
                <th>Saídas Totais</th>
                <th>Variação Mais Vendida</th>
                <th>Estoque Atual</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="product in store.topMovingProducts"
                :key="product.id"
              >
                <td>{{ product.name }}</td>
                <td>{{ product.totalMovements }}</td>
                <td>
                  <VChip
                    size="small"
                    color="primary"
                  >
                    {{ product.topVariation }}
                  </VChip>
                </td>
                <td>
                  <div class="d-flex align-center">
                    <VProgressLinear
                      :model-value="getStockPercentage(product)"
                      :color="getStockColor(product)"
                      height="8"
                      class="me-2"
                    />
                    {{ product.currentStock }}
                  </div>
                </td>
                <td>
                  <VChip
                    :color="getStatusColor(product.status)"
                    size="small"
                  >
                    {{ product.status }}
                  </VChip>
                </td>
              </tr>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.metric-card {
  border-left: 4px solid;
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-icon {
  padding: 12px;
  border-radius: 8px;
}

.stock-alerts {
  max-height: 400px;
  overflow-y: auto;
}
</style>
