/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

let path = require("path"),
  webpack = require("webpack"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  UglifyJSPlugin = require("uglifyjs-webpack-plugin"),
  AssetsPlugin = require("assets-webpack-plugin"),
  WebpackMd5Hash = require("webpack-md5-hash"),
  FileManagerPlugin = require("filemanager-webpack-plugin"),
  config = require("./config"),
  CompressionPlugin = require("compression-webpack-plugin"),
  MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

let NO_OP = () => {},
  PRODUCTION = process.env.BUILD_ENV
    ? /production/.test(process.env.BUILD_ENV)
    : false;

process.env.BABEL_ENV = "client";

const overpassTest = /overpass-.*\.(woff2?|ttf|eot|otf)(\?.*$|$)/;

const prodExternals = {};

module.exports = {
  context: __dirname,
  devtool: PRODUCTION ? "source-map" : "cheap-module-source-map",
  stats: { children: false },
  entry: {
    main: ["babel-polyfill", "./src-web/index.js"],
    "editor.worker": ["monaco-editor/esm/vs/editor/editor.worker.js"]
  },

  externals: Object.assign(PRODUCTION ? prodExternals : {}, {
    // replace require-server with empty function on client
    "./require-server": "var function(){}"
  }),

  module: {
    rules: [
      {
        test: [/\.yml$/, /\.yaml$/],
        include: path.resolve("data"),
        loader: "yaml"
      },
      {
        // Transpile React JSX to ES5
        test: [/\.jsx$/, /\.js$/],
        exclude: /node_modules\/(?!(fuse.js)\/)|\.scss/, // fuse.js requires transpiling
        loader: "babel-loader?cacheDirectory"
      },
      {
        test: [/\.s?css$/],
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader?sourceMap",
              options: {
                minimize: !!PRODUCTION
              }
            },
            {
              loader: "postcss-loader?sourceMap",
              options: {
                plugins() {
                  return [require("autoprefixer")];
                }
              }
            },
            {
              loader: "resolve-url-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "sass-loader?sourceMap",
              options: {
                data: `$font-path: "${config.get("contextPath")}/fonts";`
              }
            }
          ]
        })
      },
      {
        test: /\.woff2?$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      },
      {
        test: /\.css$/,
        include: [
         path.resolve(__dirname, "./node_modules/monaco-editor"),
         path.resolve(__dirname, "./node_modules/@open-cluster-management/temptifly") 
        ],
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.s?css$/,
        include: path.resolve(__dirname, "./node_modules/@patternfly"),
        loader: "null-loader"
      },
      {
        test: /\.properties$/,
        loader: "properties-loader"
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, "./graphics"),
        use: ["svg-sprite-loader"]
      },
      {
        test: [/\.handlebars$/, /\.hbs$/],
        loader: "handlebars-loader",
        query: {
          helperDirs: [path.resolve(__dirname, "./templates/helpers")],
          precompileOptions: {
            knownHelpersOnly: false
          }
        }
      },
      {
        test: /\.yaml$/,
        loader: "js-yaml-loader"
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        exclude: [overpassTest, path.resolve(__dirname, "./graphics")],
        loader: "file-loader",
        options: {
          name: "assets/[name].[ext]"
        }
      },
      {
        // Resolve to an empty module for overpass fonts included in SASS files.
        // This way file-loader won't parse them. Make sure this is BELOW the
        // file-loader rule.
        test: overpassTest,
        loader: "null-loader"
      }
    ],
    noParse: [
      // don't parse minified bundles (vendor libs) for faster builds
      /\.min\.js$/
    ]
  },

  output: {
    filename: PRODUCTION ? "js/[name].[hash].min.js" : "js/[name].min.js", // needs to be hash for production (vs chunckhash) in order to cache bust references to chunks
    chunkFilename: PRODUCTION
      ? "js/[name].[chunkhash].min.js"
      : "js/[name].min.js",
    path: `${__dirname}/public`,
    publicPath: config.get("contextPath").replace(/\/?$/, "/")
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(PRODUCTION ? "production" : "development")
      },
      CONSOLE_CONTEXT_URL: JSON.stringify(config.get("contextPath"))
    }),
    new webpack.DllReferencePlugin({
      context: process.env.STORYBOOK ? path.join(__dirname, "..") : __dirname,
      manifest: require("./dll/vendorhcm-manifest.json")
    }),
    new ExtractTextPlugin({
      filename: PRODUCTION ? "css/[name].[contenthash].css" : "css/[name].css",
      allChunks: true
    }),
    PRODUCTION
      ? new UglifyJSPlugin({
          sourceMap: true
        })
      : NO_OP,
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      }
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$/,
      minRatio: 1
    }),
    new MonacoWebpackPlugin({
      languages: ["yaml"]
    }),
    new AssetsPlugin({
      path: path.join(__dirname, "public"),
      fullPath: false,
      prettyPrint: true,
      update: true
    }),
    PRODUCTION
      ? new webpack.HashedModuleIdsPlugin()
      : new webpack.NamedModulesPlugin(),
    new WebpackMd5Hash(),
    new FileManagerPlugin({
      onEnd: {
        copy: [
          {
            source: "node_modules/carbon-icons/dist/carbon-icons.svg",
            destination: "public/graphics"
          },
          { source: "graphics/*.svg", destination: "public/graphics" },
          { source: "graphics/*.png", destination: "public/graphics" },
          { source: "fonts", destination: "public/fonts" }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      handlebars: "handlebars/dist/handlebars.min.js"
    }
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, "node_modules"),
      path.join(__dirname, "node_modules/node-i18n-util/lib") // properties-loader
    ]
  }
};
