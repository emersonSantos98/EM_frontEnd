import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stockMetrics: {
      totalProducts: 150,
      lowStock: 15,
      outOfStock: 5,
      monthlyMovements: 432,
    },
    productMovementData: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      data: [45, 52, 38, 64, 58, 43],
    },
    stockAlerts: [
      {
        product: 'Camiseta Básica',
        variations: {
          P: 2,
          M: 0,
          G: 5,
        },
        minStock: 5,
      },
      {
        product: 'Calça Jeans',
        variations: {
          P: 1,
          M: 3,
          G: 0,
        },
        minStock: 3,
      },
    ],
    topMovingProducts: [
      {
        id: 1,
        name: 'Camiseta Básica',
        totalMovements: 145,
        topVariation: 'M',
        currentStock: 25,
        maxStock: 100,
        minStock: 10,
        status: 'Em Estoque',
      },
      {
        id: 2,
        name: 'Calça Jeans',
        totalMovements: 98,
        topVariation: 'G',
        currentStock: 8,
        maxStock: 50,
        minStock: 10,
        status: 'Baixo Estoque',
      },
      {
        id: 3,
        name: 'Tênis Casual',
        totalMovements: 75,
        topVariation: '42',
        currentStock: 5,
        maxStock: 30,
        minStock: 5,
        status: 'Risco de Falta',
      },
    ],
    nextMonth: 'Julho 2023',
    stockProjections: [
      {
        product: 'Camiseta Básica',
        currentStock: 25,
        projectedStock: 15,
        minStock: 20,
        trend: 'down',
        reason: 'Necessidade de reposição - Alto consumo no período de férias',
        status: 'Risco de Falta',
      },
      {
        product: 'Calça Jeans',
        currentStock: 18,
        projectedStock: 30,
        minStock: 15,
        trend: 'up',
        reason: 'Entrada da estação fria aumenta demanda',
        status: 'Estoque Adequado',
      },
      {
        product: 'Tênis Casual',
        currentStock: 5,
        projectedStock: 2,
        minStock: 5,
        trend: 'down',
        reason: 'Baixa procura no inverno',
        status: 'Risco de Falta',
      },
    ],
    seasonalEvents: [
      {
        date: '15/07',
        name: 'Férias Escolares',
        description: 'Aumento esperado nas vendas de roupas casuais',
        impact: 'warning',
      },
      {
        date: '28/07',
        name: 'Início do Inverno',
        description: 'Maior procura por roupas de frio',
        impact: 'success',
      },
    ],
  }),
})
