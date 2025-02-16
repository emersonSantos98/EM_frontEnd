<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useInventoryStore } from './inventoryMovementStore'

const inventoryStore = useInventoryStore()
const inventoryMovements = computed(() => inventoryStore.movements)

onMounted(() => {
  inventoryStore.fetchMovements()
})

function getRowStyle(tipo: string) {
  const colors = {
    Entrada: '#2dc56c',
    Saida: '#ff4c51'
  }
  const baseColor = tipo === 'Entrada' ? colors.Entrada : colors.Saida

  return {
    backgroundImage: `linear-gradient(to right, ${baseColor}15, white)`,
    transition: 'background-image 0.3s ease'
  }
}

function formatQuantity(tipo: string, quantity: number): string {
  return `${tipo === 'Entrada' ? '+' : '-'}${quantity}`
}

function getQuantityColor(tipo: string): string {
  return tipo === 'Entrada' ? '#2dc56c' : '#ff4c51'
}
</script>

<template>
  <VTable class="text-no-wrap">
    <thead>
      <tr>
        <th class="text-uppercase">Produto</th>
        <th class="text-uppercase">Variação</th>
        <th class="text-uppercase">Quantidade</th>
        <th class="text-uppercase">Data</th>
        <th class="text-uppercase">Tipo</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in inventoryMovements"
        :key="item.produto + item.variacao + item.dataMovimentacao"
        :style="getRowStyle(item.tipo)"
        class="inventory-row"
      >
        <td>{{ item.produto }}</td>
        <td>{{ item.variacao }}</td>
        <td :style="{ color: getQuantityColor(item.tipo) }">
          {{ formatQuantity(item.tipo, item.quantidade) }}
        </td>
        <td>{{ item.dataMovimentacao }}</td>
        <td>
          <VChip
            :color="item.tipo === 'Entrada' ? 'success' : 'error'"
            variant="elevated"
          >
            {{ item.tipo }}
          </VChip>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>

<style scoped>
.inventory-row {
  cursor: pointer;
}

.inventory-row:hover {
  opacity: 0.9;
}
</style>
