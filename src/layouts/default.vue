<script lang="ts" setup>
import { useSkins } from '@core/composable/useSkins'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { useAppLayoutStore } from "@/store/appLayout";

const appLayoutStore = useAppLayoutStore()

// @layouts plugin
import { AppContentLayoutNav } from '@layouts/enums'

const DefaultLayoutWithHorizontalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithHorizontalNav.vue'))
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithVerticalNav.vue'))

const { width: windowWidth } = useWindowSize()
const { appContentLayoutNav, switchToVerticalNavOnLtOverlayNavBreakpoint } = useThemeConfig()

// ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout
// Remove below composable usage if you are not using horizontal nav layout in your app
switchToVerticalNavOnLtOverlayNavBreakpoint(windowWidth)

const { layoutAttrs, injectSkinClasses } = useSkins()

injectSkinClasses()
</script>

<template>
  <template v-if="appContentLayoutNav === AppContentLayoutNav.Vertical">
    <DefaultLayoutWithVerticalNav v-bind="layoutAttrs" />
  </template>
  <template v-else>
    <DefaultLayoutWithHorizontalNav v-bind="layoutAttrs" />
  </template>
  <VOverlay
    v-model="appLayoutStore.getLoading"
    absolute
    color="white"
    opacity="0.9"
    height="100%"
    width="100%"
  >
   <template v-slot:default>
     <VProgressCircular
       style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
       :size="50"
       color="primary"
       indeterminate
     />
   </template>
  </VOverlay>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
