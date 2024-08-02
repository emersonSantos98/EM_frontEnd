import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import vuetify from 'vite-plugin-vuetify'
import DefineOptions from 'unplugin-vue-define-options/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log('mode:', mode)

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
    : {  }

  return {
    plugins: [
      vue(),
      vueJsx(),
      vuetify({
        styles: {
          configFile: 'src/styles/variables/_vuetify.scss',
        },
      }),
      Pages({
        dirs: ['./src/pages'],
      }),
      Layouts({
        layoutsDirs: './src/layouts/',
      }),
      Components({
        dirs: ['src/@core/components', 'src/views/demos', 'src/components'],
        dts: true,
      }),
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'vue-i18n', 'pinia'],
        vueTemplate: true,
      }),
      VueI18nPlugin({
        runtimeOnly: true,
        compositionOnly: true,
        include: [
          fileURLToPath(new URL('./src/plugins/i18n/locales/**', import.meta.url)),
        ],
      }),
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
    build: {
      chunkSizeWarningLimit: 5000,
    },
    optimizeDeps: {
      exclude: ['vuetify'],
      entries: [
        './src/**/*.vue',
      ],
    },
  }
})
