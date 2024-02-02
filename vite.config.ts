import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'b3e': JSON.stringify({editor: {}, project: {}, draw: {}, tree: {}})
  }
})
