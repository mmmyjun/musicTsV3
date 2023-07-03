import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    // viteCompression()
    // visualizer()
  ],
  server: {
    proxy: {
      '/api': {
        // target: 'http://192.168.10.104:8000',
        // target: 'https://apps.gatsbyjs.io',
        target: 'https://mediaapp-1-w5571626.deta.app',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }
  },
  build: {
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
    // reportCompressedSize: true,
    // //   关闭生成map文件 可以达到缩小打包体积
    sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
   
    rollupOptions: {
      output: {
        // manualChunks(id: any): string {
        //   if (id.includes("node_modules")) {
        //     return id
        //       .toString()
        //       .split("node_modules/")[1]
        //       .split("/")[0]
        //       .toString();
        //   }
        // },

        manualChunks(id: any): string {
          if (id.includes('node_modules')) {
            const arr = id.toString().split('node_modules/')[1].split('/')
            switch (arr[0]) {
              case '@naturefw': // 自然框架
              case '@popperjs':
              case '@vue':
              case 'lodash':
              case 'element-plus': // UI 库
              case '@element-plus': // 图标
                return '_' + arr[0]
                break
              default:
                return '__vendor'
                break
            }
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',  // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js',  // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
      },
    },
    target: 'esnext',
    minify: 'esbuild' // 混淆器，terser构建后文件体积更小
  },
  base: '/mmj/'
})