var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var UglifyJsPlugin = require('uglifyjs-3-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin-legacy');
// var PrerenderSpaPlugin = require('prerender-spa-plugin')
// var OfflinePlugin = require('offline-plugin')

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js?[chunkhash]'),
    chunkFilename: utils.assetsPath('js/[id].js?[chunkhash]')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // new UglifyJsPlugin({
    //   test: /\.js($|\?)/i,
    //   sourceMap: true,
    //   exclude: [/vue-beautiful-chat/],
    //   uglifyOptions: {
    //     compress: {
    //       warnings: false
    //     },
    //     mangle: {
    //       keep_fnames: true,
    //     },
    //     output: {
    //       beautify: false,
    //     }
    //   }
    // }),
    new TerserPlugin({
      test: /\.js($|\?)/i,
      sourceMap: true,
      terserOptions: {
        ecma: 6,
      },
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css?[contenthash]')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),

    // new PrerenderSpaPlugin(
    //   // Path to compiled app
    //   path.join(__dirname, '../dist'),
    //   // List of endpoints you wish to prerender
    //   // If you also wanted to prerender /about and /contact,
    //   // then this would be [ '/', '/about', '/contact' ]
    //   [ '/' ]
    // ),
    
    // // it's always better if OfflinePlugin is the last plugin added
    // new OfflinePlugin({
    //   safeToUseOptionalCaches: true,
    //   caches: {
    //     main: [
    //       'css/app.*.css',
    //       'js/vendor.*.js',
    //       'js/app.*.js',
    //       '/'
    //     ],
    //     additional: [
    //       ':externals:'
    //     ],
    //     optional: [
    //       ':rest:'
    //     ]
    //   },
    //   externals: [
    //     // list assets that are not bundled by webpack here to cache them
    //     '/'
    //   ],
    //   ServiceWorker: {
    //     events: true,
    //     navigateFallbackURL: '/',
    //     publicPath: '/sw.js'
    //   },
    //   AppCache: {
    //     FALLBACK: { '/': '/' }
    //   }
    // })
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig

// Enable history mode for vue-router:
// const router = new VueRouter({
// mode: 'history',
// routes: [...]
// })

// var path = require('path')
// var webpack = require('webpack')
// var PrerenderSpaPlugin = require('prerender-spa-plugin')
// var HtmlWebpackPlugin = require('html-webpack-plugin')
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// var VueLoaderPlugin = require('vue-loader')

// module.exports = {
//   entry: path.resolve(__dirname, 'src/main.js'),
//   output: {
//     path: path.resolve(__dirname, './dist'),
//     publicPath: '/',
//     filename: 'build.js'
//   },
//   module: {
//     rules: [{
//         test: /\.css$/,
//         use: [
//           'vue-style-loader',
//           'css-loader'
//         ],
//       }, {
//         test: /\.vue$/,
//         loader: 'vue-loader',
//         options: {
//           loaders: {}
//           // other vue-loader options go here
//         }
//       },
//       {
//         test: /\.js$/,
//         loader: 'babel-loader',
//         exclude: /node_modules/
//       },
//       {
//         test: /\.(png|jpg|gif|svg)$/,
//         loader: 'file-loader',
//         options: {
//           name: '[name].[ext]?[hash]'
//         }
//       }
//     ]
//   },
//   resolve: {
//     alias: {
//       'vue$': 'vue/dist/vue.esm.js'
//     },
//     extensions: ['*', '.js', '.vue', '.json']
//   },
//   devServer: {
//     historyApiFallback: true,
//     noInfo: true,
//     overlay: true
//   },
//   performance: {
//     hints: false
//   },
//   devtool: '#eval-source-map'
// }

// if (process.env.NODE_ENV === 'production') {
//   module.exports = {
//     mode: "production",
//     devtool: '#source-map',
//     optimization: {
//       minimizer: [
//         new UglifyJsPlugin({
//           sourceMap: true
//         })
//       ]
//     },
//     plugins: [
//       new HtmlWebpackPlugin({
//         template: 'index.html',
//         filename: path.resolve(__dirname, 'dist/index.html')
//       }),
//       new PrerenderSpaPlugin({
//         // Absolute path to compiled SPA
//         staticDir: path.resolve(__dirname, './dist'),
//         // List of routes to prerender
//         routes: ['/', '/about', '/contact'],
//         // Options
//         postProcess(context) {
//           let titles = {
//             '/': 'My home page',
//             '/about': 'My awesome about page',
//             '/contact': 'Contact me'
//           };
//           context.html = context.html.replace(
//             /<title>[^<]*<\/title>/i,
//             `<title>${titles[context.route]}</title>`
//           )
//           return context
//         }
//       }),
//       new VueLoaderPlugin()
//     ]
//   }
// }

// wget https://github.com/yongjhih/docker-parse-server/raw/master/docker-compose.yml
// $ APP_ID=iznoapp MASTER_KEY=iznokey PARSE_DASHBOARD_ALLOW_INSECURE_HTTP=1 SERVER_URL=http://localhost:1337/parse docker-compose up -d
// APP_ID=iznoapp MASTER_KEY=iznokey PARSE_DASHBOARD_ALLOW_INSECURE_HTTP=1 SERVER_URL=http://localhost:1337/parse USER1=izno USER1_PASSWORD=iznokey docker-compose up -d