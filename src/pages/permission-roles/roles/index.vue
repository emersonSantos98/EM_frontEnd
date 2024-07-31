<script setup lang="ts">
import RoleCards from '@/views/permissions-roles/Roles/components/RoleCards.vue'
import UserList from '@/views/permissions-roles/Roles/components/UserList.vue'
import UserGroupService from "@/services/UserGroup/userGroup.service";
import {onMounted} from "vue";
import PermissionService from "@/services/Permission/permission.service";

const userGroupService = new UserGroupService()
const permissionService = new PermissionService()

onMounted(() => {
  userGroupService.findAll()
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <RoleCards
        v-model:model-value="userGroupService.store.userGroups"
      />
    </VCol>

    <VCol cols="12">
      <UserList />
    </VCol>
  </VRow>
</template>
<route lang="yaml">
meta:
  action: read
  subject: Auth
  auth: true
</route>
