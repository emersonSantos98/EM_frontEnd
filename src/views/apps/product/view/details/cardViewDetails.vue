<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { VCard, VCardText, VCardTitle, VDivider, VExpansionPanel, VExpansionPanelText, VExpansionPanelTitle, VExpansionPanels } from 'vuetify/components'
import { tableListProductStore } from '../../components/table/tableListProductStore'

const store = tableListProductStore()

const product = ref({})

watchEffect(() => {
  product.value = store.tableProduct[0]
})
</script>

<template>
  <VCard>
    <VCardTitle>Detalhes do Produto</VCardTitle>
    <VCardText>
      <h2>{{ product.name_product }}</h2>
      <p>{{ product.description }}</p>
      <p><strong>Total Cost:</strong> {{ product.total_cost }}</p>
      <p><strong>General Stock:</strong> {{ product.generalStock }}</p>
      <p><strong>Created At:</strong> {{ product.created_at }}</p>
    </VCardText>

    <VDivider class="my-4" />

    <VCardText>
      <h2>Variações</h2>
      <VExpansionPanels multiple>
        <VExpansionPanel
          v-for="(details, color) in product.mappedVariations"
          :key="color"
        >
          <VExpansionPanelTitle>{{ color }}</VExpansionPanelTitle>
          <VExpansionPanelText>
            <p><strong>Grade:</strong> {{ details.grade.join(', ') }}</p>
            <p><strong>Stock:</strong> {{ details.stock }}</p>
            <p><strong>Barcode:</strong> {{ details.barcode }}</p>
            <p><strong>Product ID:</strong> {{ details.productId }}</p>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </VCardText>

    <VDivider class="my-4" />

    <VCardText>
      <h2>Calculations</h2>
      <div
        v-for="calc in product.calculations"
        :key="calc.id"
        class="calculation-item"
      >
        <p><strong>Price Sale:</strong> {{ calc.price_sale }}</p>
        <p><strong>Nominal Profit:</strong> {{ calc.nominal_profit }}</p>
        <p><strong>Working Capital:</strong> {{ calc.working_capital }}</p>
        <p><strong>Date:</strong> {{ new Date(calc.date_calculo).toLocaleDateString() }}</p>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f9f9f9;
}

.product-details {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.calculation-item {
  background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
