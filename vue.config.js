const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/assets/less/index.less')
      ]
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', path.resolve('src'))
      .set('@views', path.resolve('src/views'))
      .set('@comp', path.resolve('src/components'))
      .set('@img', path.resolve('src/assets/images'))
      .set('@data', path.resolve('src/assets/data'))
  },
  devServer: {
    proxy: {
      '/api_face/*': {
        target: 'https://api-cn.faceplusplus.com', // Face++
        changeOrigin: true,
        pathRewrite: {
          '^/api_face': ''
        }
      },
      '/api_upload/*': {
        // target: 'http://47.75.112.198:8099', // 测试环境
        target: 'http://cyg.easy.echosite.cn', // 艺高
        changeOrigin: true,
        pathRewrite: {
          '^/api_upload': '/h5/'
        }
      },
      '/api_not_login/*': {
        // target: 'http://47.75.112.198:8099', // 测试环境
        target: 'http://cyg.easy.echosite.cn', // 艺高
        changeOrigin: true,
        pathRewrite: {
          '^/api_not_login': '/h5/'
        }
      },
      '/api/*': {
        // target: 'http://47.75.112.198:8099', // 测试环境
        target: 'http://cyg.easy.echosite.cn', // 艺高
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/external/h5/'
        }
      }
    }
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      // 入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  }
}
