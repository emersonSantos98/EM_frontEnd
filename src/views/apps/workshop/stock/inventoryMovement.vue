<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useInventoryStore } from './inventoryMovementStore'

const inventoryStore = useInventoryStore()

// Computed property para obter as movimentações
const inventoryMovements = computed(() => inventoryStore.movements)

// Fetch de dados na montagem do componente
onMounted(() => {
  inventoryStore.fetchMovements()
})

// Função para limpar a variação (removendo tamanho e caracteres extras)
function cleanVariation(variation: string): string {
  return variation.split('/')[0].trim() // Remove o tamanho e mantém apenas a cor
}

// Função para obter o hex a partir do nome da cor
function getHexFromColorName(colorName: string): string {
  colorName = cleanVariation(colorName)

  // Normalize o input: remove espaços extras, converte para minúsculas e trata acentos.
  const normalizedColor = colorName.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

  // Lista expandida de cores
  const baseColors: Record<string, [number, number, number]> = {
    preto: [0, 0, 0],
    branco: [255, 255, 255],
    vermelho: [255, 0, 0],
    azul: [0, 0, 255],
    verde: [0, 255, 0],
    amarelo: [255, 255, 0],
    rosa: [255, 20, 147],
    roxo: [128, 0, 128],
    cinza: [128, 128, 128],
    laranja: [255, 165, 0],
    marrom: [139, 69, 19],
    turquesa: [64, 224, 208],
    lilas: [200, 162, 200],
    dourado: [255, 215, 0],
    prata: [192, 192, 192],
    vinho: [128, 0, 0],
    creme: [255, 253, 208],
    azulmarinho: [0, 0, 128],
  }

  // Verifica se a cor está no mapa
  if (normalizedColor in baseColors) {
    const [r, g, b] = baseColors[normalizedColor]

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  // Processa cores compostas (e.g., "verde água")
  const words = normalizedColor.split(/\s+/)
  const combinedRGB: [number, number, number] = [0, 0, 0]
  let validColorCount = 0

  words.forEach(word => {
    if (word in baseColors) {
      const [r, g, b] = baseColors[word]

      combinedRGB[0] += r
      combinedRGB[1] += g
      combinedRGB[2] += b
      validColorCount++
    }
  })

  if (validColorCount > 0) {
    // Calcula a média das cores encontradas
    const averagedRGB = combinedRGB.map(value => Math.min(Math.round(value / validColorCount), 255))

    return `#${((1 << 24) + (averagedRGB[0] << 16) + (averagedRGB[1] << 8) + averagedRGB[2]).toString(16).slice(1)}`
  }

  // Gera uma cor fallback com base no hash da string
  const hash = normalizedColor.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)
  const r = (hash & 0xFF0000) >> 16
  const g = (hash & 0x00FF00) >> 8
  const b = hash & 0x0000FF

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Função para gerar o estilo do gradiente
function getGradientStyle(variation: string) {
  const color = getHexFromColorName(variation)

  return {
    backgroundImage: `linear-gradient(to right, ${color} -27%, white)`,
    color: color === '#ffffff' ? 'black' : 'white', // Altera o texto caso a cor seja branca
  }
}

// Função para formatar a quantidade com sinal
function formatQuantity(type: string, quantity: number): string {
  return `${type === 'Entrada' ? '+' : '-'}${quantity}`;
}

// Função para obter a cor correspondente ao tipo
function getQuantityColor(type: string): string {
  return type === 'Entrada' ? '#2dc56c' : 'red';
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
    >
      <td>{{ item.produto }}</td>
      <td>
        <div
          class="variation-style"
          :style="getGradientStyle(item.variacao)"
        >
          {{ item.variacao }}
        </div>
      </td>
      <td :style="{ color: getQuantityColor(item.type) }">
        {{ formatQuantity(item.type, item.quantidade) }}
      </td>
      <td>{{ item.dataMovimentacao }}</td>
      <td>
        <VChip
          :color="item.type === 'Entrada' ? 'success' : 'error'"
          variant="elevated"
        >
          {{ item.type }}
        </VChip>
      </td>
    </tr>
    </tbody>
  </VTable>
</template>

<style scoped>
.variation-style {
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
  /* Alteração para fallback de texto visível */
}
</style>
