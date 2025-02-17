<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const chartRef = ref(null)
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

onMounted(() => {
  new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: props.data.labels,
      datasets: [{
        label: 'Vendas Mensais',
        data: props.data.data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
})
</script>
