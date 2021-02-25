/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
var path = require('path'),
    webpack = require('webpack'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    AssetsPlugin = require('assets-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash'),
    CompressionPlugin = require('compression-webpack-plugin')

var NO_OP = () => {},
    PRODUCTION = process.env.BUILD_ENV
      ? /production/.test(process.env.BUILD_ENV)
      : false

process.env.BABEL_ENV = 'client'

const overpassTest = /overpass-.*\.(woff2?|ttf|eot|otf)(\?.*$|$)/

module.exports = {
  entry: {
    vendorhcm: [
      '@patternfly/react-core',
      '@patternfly/react-icons',
      '@patternfly/react-tokens',
      'carbon-components-react',
      'cytoscape',
      'cytoscape-cola',
      'd3',
      'loadable-components',
      'lodash',
      'moment',
      'normalizr',
      'prop-types',
      'react-custom-scrollbars',
      'react-dnd',
      'react-dnd-html5-backend',
      'react-dom',
      'react-dom/server',
      'react-redux',
      'react-router-dom',
      'react-tag-autocomplete',
      'react',
      'redux-logger',
      'redux-thunk',
      'redux',
      'reselect',
      'svg.js',
      'svg-loader'
    ]
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        include: path.resolve(__dirname, './node_modules/monaco-editor'),
        use: [
          { loader: 'style-loader', options: { base: 2000 } },
          { loader: 'css-loader', options: { base: 3000 } }
        ]
      },
      {
        test: /\.s?css$/,
        include: path.resolve(__dirname, './node_modules/@patternfly'),
        loader: 'null-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        exclude: overpassTest,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]'
        }
      },
      {
        // Resolve to an empty module for overpass fonts included in SASS files.
        // This way file-loader won't parse them. Make sure this is BELOW the
        // file-loader rule.
        test: overpassTest,
        loader: 'null-loader'
      }
    ]
  },

  output: {
    path: __dirname + '/public',
    filename: PRODUCTION ? 'dll.[name].[chunkhash].js' : 'dll.[name].js',
    library: '[name]'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(PRODUCTION ? 'production' : 'development')
      }
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dll', '[name]-manifest.json'),
      name: '[name]',
      context: __dirname
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 5
    }),
    PRODUCTION
      ? new UglifyJSPlugin({
        sourceMap: true
      })
      : NO_OP,
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/
    }),
    new AssetsPlugin({
      path: path.join(__dirname, 'public'),
      fullPath: false,
      prettyPrint: true,
      update: true
    }),
    PRODUCTION
      ? new webpack.HashedModuleIdsPlugin()
      : new webpack.NamedModulesPlugin(),
    new WebpackMd5Hash()
  ],
  resolve: {
    modules: [path.join(__dirname, 'node_modules')]
  }
}
