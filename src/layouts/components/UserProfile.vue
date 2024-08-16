<script setup lang="ts">
import { initialAbility } from '@/plugins/casl/ability'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import { useAuthStore } from '@/store/auth'
import AuthService from '@/services/auth/auth.service'

const authService = new AuthService()

const router = useRouter()

const ability = useAppAbility()
const authUser = useAuthStore()

const userData = JSON.parse(localStorage.getItem('userData') || 'null')

async function logout() {
  // Remove "userData" from localStorage
  authUser.clearLogout()

  // Remove "accessToken" from localStorage
  localStorage.removeItem('accessToken')

  // Remove "refreshToken" from localStorage
  localStorage.removeItem('refreshToken')

  // Redirect to login page

  window.open(`${import.meta.env.VITE_API_URL}/auth/logout`, '_self')
  ability.update(initialAbility)
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg
        :src="userData.avatar"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 user Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg
                      :src="userData.avatar"
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userData.full_name }}
            </VListItemTitle>
            <VListItemSubtitle v-if="userData.role == 'admin'">
              {{ userData.role }}
            </VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Settings -->
          <VListItem
            link
            to="account/profile"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-settings"
                size="22"
              />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem
            link
            @click="logout"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
