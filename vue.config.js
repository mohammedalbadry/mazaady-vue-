const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
      proxy: {
          '^/api': {
              target: 'https://staging.mazaady.com/',
              changeOrigin: true,
              secure:false,
              pathRewrite: {'^/api': '/api'},
              logLevel: 'debug' 
          },
      }
        
  }
})
