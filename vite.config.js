import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@assets': path.resolve(__dirname, 'src/assets')
    },
    extensions: ['.vue', '.js']
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/styles/element/index.scss" as *; @use "@/styles/variables.module.scss" as *;`,
        // 最好只引入变量文件，不然会导致样式重复  变量文件全局能拿到
        additionalData: `@use "@/styles/variables.module.scss" as *;`, // 在。vue文件中使用了scss
        api: 'modern-compiler'
      }
    }
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
