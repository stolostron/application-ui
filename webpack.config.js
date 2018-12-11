/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    AssetsPlugin = require('assets-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash'),
    FileManagerPlugin = require('filemanager-webpack-plugin'),
    GitRevisionPlugin = require('git-revision-webpack-plugin'),
    VersionFile = require('webpack-version-file'),
    config = require('./config'),
    CompressionPlugin = require('compression-webpack-plugin')

var NO_OP = () => { },
    PRODUCTION = process.env.BUILD_ENV ? /production/.test(process.env.BUILD_ENV) : false

process.env.BABEL_ENV = 'client'

var prodExternals = {}

module.exports = {
  context: __dirname,
  devtool: PRODUCTION ? 'source-map' : 'cheap-module-source-map',
  stats: { children: false },
  entry: {
    'common': ['./scss/common.scss'],
    'main': ['babel-polyfill', './src-web/index.js']
  },

  externals: Object.assign(PRODUCTION ? prodExternals : {}, {
    // replace require-server with empty function on client
    './require-server': 'var function(){}'
  }),

  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          quiet: true
        }
      },
      {
        // Transpile React JSX to ES5
        test: [/\.jsx$/, /\.js$/],
        exclude: /node_modules|\.scss/,
        loader: 'babel-loader?cacheDirectory',
      },
      {
        test: [/\.scss$/],
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader?sourceMap',
              options: {
                minimize: PRODUCTION ? true : false
              }
            },
            {
              loader: 'postcss-loader?sourceMap',
              options: {
                plugins: function () {
                  return [
                    require('autoprefixer')
                  ]
                },
              }
            },
            {
              loader: 'sass-loader?sourceMap',
              options: {
                data: '$font-path: "'+ config.get('contextPath') + '/fonts";'
              }
            }
          ]
        })
      },
      {
        test: /\.woff2?$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.properties$/,
        loader: 'properties-loader'
      },
      {
        test: /\.svg$/,
        use: [
          'svg-sprite-loader'
        ]
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          'svg-sprite-loader?symbolId=icon-[name]',
          'image2svg-loader',
        ],
      },
    ],
    noParse: [
      // don't parse minified bundles (vendor libs) for faster builds
      /\.min\.js$/
    ]
  },

  output: {
    filename: PRODUCTION ? 'js/[name].[hash].min.js' : 'js/[name].min.js', //needs to be hash for production (vs chunckhash) in order to cache bust references to chunks
    chunkFilename: PRODUCTION ? 'js/[name].[chunkhash].min.js' : 'js/[name].min.js',
    path: __dirname + '/public',
    publicPath: config.get('contextPath').replace(/\/?$/, '/')
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(PRODUCTION ? 'production' : 'development'),
      },
      CONSOLE_CONTEXT_URL: JSON.stringify(config.get('contextPath'))
    }),
    new webpack.DllReferencePlugin({
      context: process.env.STORYBOOK ? path.join(__dirname, '..') : __dirname,
      manifest: require('./dll/vendorhcm-manifest.json'),
    }),
    new ExtractTextPlugin({
      filename: PRODUCTION ? 'css/[name].[contenthash].css' : 'css/[name].css',
      allChunks: true
    }),
    PRODUCTION ? new UglifyJSPlugin({
      sourceMap: true
    }) : NO_OP,
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: './.eslintrc.json',
          quiet: true
        }
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      }
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$/,
      minRatio: 1,
    }),
    new AssetsPlugin({
      path: path.join(__dirname, 'public'),
      fullPath: false,
      prettyPrint: true,
      update: true
    }),
    PRODUCTION ? new webpack.HashedModuleIdsPlugin() : new webpack.NamedModulesPlugin(),
    new WebpackMd5Hash(),
    new FileManagerPlugin({
      onEnd: {
        copy: [
          { source: 'node_modules/carbon-icons/dist/carbon-icons.svg', destination: 'public/graphics' },
          { source: 'graphics/*.svg', destination: 'public/graphics'},
          { source: 'graphics/*.png', destination: 'public/graphics'},
          { source: 'fonts', destination: 'public/fonts' },
        ]
      }
    }),
    new VersionFile({
      output: './public/version.txt',
      package: './package.json',
      template: './version.ejs',
      data: {
        date: new Date(),
        revision: (new GitRevisionPlugin()).commithash()
      }
    })
  ],

  resolveLoader: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'node_modules/node-i18n-util/lib') // properties-loader
    ]
  }
}
