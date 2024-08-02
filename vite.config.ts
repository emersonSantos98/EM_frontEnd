import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vuetify from 'vite-plugin-vuetify'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  const serverConfig = isDev
    ? {
      https: {
        key: fs.readFileSync(path.resolve('C:/Users/emers/192.168.18.27-key.pem')),
        cert: fs.readFileSync(path.resolve('C:/Users/emers/192.168.18.27.pem')),
      },
      host: '192.168.18.27',
      port: 5173,
    }
    : {
      host: '0.0.0.0',
      port: process.env.PORT || 5173,
    }

  return {
    plugins: [
      vue(),
      vueJsx(),
      vuetify({
        styles: { configFile: 'src/styles/variables/_vuetify.scss' },
      }),
      Pages({ dirs: ['./src/pages'] }),
      Layouts({ layoutsDirs: './src/layouts/' }),
      Components({ dirs: ['src/@core/components', 'src/views/demos', 'src/components'], dts: true }),
      AutoImport({ imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'vue-i18n', 'pinia'], vueTemplate: true }),
      VueI18nPlugin({ runtimeOnly: true, compositionOnly: true, include: [fileURLToPath(new URL('./src/plugins/i18n/locales/**', import.meta.url))] }),
      DefineOptions(),
    ],
    server: serverConfig,
    define: { 'process.env': {} },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@themeConfig': fileURLToPath(new URL('./themeConfig.ts', import.meta.url)),
        '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
        '@images': fileURLToPath(new URL('./src/assets/images/', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles/', import.meta.url)),
        '@configured-variables': fileURLToPath(new URL('./src/styles/variables/_template.scss', import.meta.url)),
        '@axios': fileURLToPath(new URL('./src/plugins/axios', import.meta.url)),
        '@validators': fileURLToPath(new URL('./src/@core/utils/validators', import.meta.url)),
        'apexcharts': fileURLToPath(new URL('node_modules/apexcharts-clevision', import.meta.url)),
      },
    },
    build: { chunkSizeWarningLimit: 5000 },
    optimizeDeps: { exclude: ['vuetify'], entries: ['./src/**/*.vue'] },
  }
})
