<script setup lang="ts">

import {VAvatar, VIcon} from "vuetify/components";
</script>

<template>
  <div

    style="border-color: rgb(var(--v-theme-primary)) !important; width: 100%;height: 100%;"
    class="d-flex flex-column justify-center align-center cursor-pointer rounded px-5 py-2 me-6 border border-dashed"
  >
    <VAvatar
      rounded
      size="38"
      color="primary'"
      variant="tonal"
      class="mb-2"
    >
      <VIcon icon="tabler-qrcode" />
    </VAvatar>
    <p class="mb-0">
      Adicionar Estoque
    </p>
  </div>
</template>

<style scoped lang="scss">

</style>
<route lang="yaml">
meta:
  action: read
  subject: Auth
</route>
