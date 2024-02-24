import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    AutoImport({
      resolvers: [ElementPlusResolver(), NaiveUiResolver()],
      imports: ['vue', 'vue-router']
    }),
    Components({
      resolvers: [ElementPlusResolver(), NaiveUiResolver()],
    })
  ]
})
