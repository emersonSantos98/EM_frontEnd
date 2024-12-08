<script lang="ts" setup>
import { ref } from 'vue'
import StockList from "@/views/apps/workshop/stock/stockList.vue";
import InventoryMovement from "@/views/apps/workshop/stock/inventoryMovement.vue";
const currentTab = ref('tab-1');
</script>

<template>
  <VCard>
    <!-- Tabs -->
    <VTabs
      v-model="currentTab"
      grow
      stacked
    >
      <VTab value="tab-1">
        <VIcon
          icon="tabler-packages"
          class="mb-2"
        />
        <span>Estoque</span>
      </VTab>

      <VTab value="tab-2">
        <VIcon
          icon="tabler-package-export"
          class="mb-2"
        />
        <span>Movimentações</span>
      </VTab>
    </VTabs>

    <!-- Tab Content -->
    <VCardText>
      <VWindow v-model="currentTab">
        <!-- Estoque Tab -->
        <VWindowItem value="tab-1">
          <StockList />
        </VWindowItem>

        <!-- Movimentações Tab -->
        <VWindowItem value="tab-2">
          <InventoryMovement />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
