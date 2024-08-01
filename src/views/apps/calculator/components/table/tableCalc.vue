<script setup lang="ts">
import { VAvatar, VCard, VCardText, VIcon, VTable } from 'vuetify/components'
import { ref, watchEffect } from 'vue'
import type { Calculation } from '../../types'
import { tableCalcStore } from './tableCalcStore'

const calculos = ref<Calculation[]>([])
const store = tableCalcStore()

watchEffect(() => {
  calculos.value = store.tableData
})
</script>

<template>
  <VCard class="mb-6 mt-4">
    <VCardText>
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th>
              data calculo
            </th>
            <th>
              preço de venda
            </th>
            <th>
              lucro nominal
            </th>
            <th>
              capital de giro
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in calculos"
            :key="item.id_product"
          >
            <td>
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
              <span class="ms-1 text-no-wrap"> {{ item.date_calculo }}</span>
            </td>
            <Td>
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
              <span class="ms-1 text-no-wrap"> {{ item.price_sale }}</span>
            </Td>
            <Td>
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
                  tabler-premium-rights
                </VIcon>
              </VAvatar>
              <span class="ms-1 text-no-wrap"> {{ item.nominal_profit }}</span>
            </Td>
            <Td>
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
                  tabler-shopping-cart
                </VIcon>
              </VAvatar>
              <span class="ms-1 text-no-wrap"> {{ item.working_capital }}</span>
            </Td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>
