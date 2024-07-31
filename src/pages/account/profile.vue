<script lang="ts" setup>
import { ref } from 'vue'

// Importe seus componentes dinamicamente
import MyProfile from '@/views/apps/myProfile/components/my-profile.vue'
import Organization from '@/views/apps/organization/view/my-organization.vue'
import Security from '@/views/apps/security/view/security.vue'

const currentTab = ref('tab-1')

// Defina a estrutura de dados para os tabs
const tabs = [
  {
    title: 'My Profile',
    value: 'tab-1',
    component: MyProfile,
  },
  {
    title: 'Organization',
    value: 'tab-2',
    component: Organization,
  },
  {
    title: 'Segurança',
    value: 'tab-3',
    component: Security,
  },
]
</script>

<template>
  <VCol>
    <VTabs
      v-model="currentTab"
      grow
      stacked
    >
      <VTab
        v-for="(tab, index) in tabs"
        :key="index"
        :value="tab.value"
      >
        <span>{{ $t(tab.title) }}</span>
      </VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="currentTab">
        <VWindowItem
          v-for="(tab, index) in tabs"
          :key="index"
          :value="tab.value"
        >
          <Component :is="tab.component" />
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCol>
</template>
<route lang="yaml">
meta:
  action: read
  subject: Auth
  auth: true
</route>
