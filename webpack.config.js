/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
let path = require("path"),
  webpack = require("webpack"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  AssetsPlugin = require("assets-webpack-plugin"),
  CopyPlugin = require("copy-webpack-plugin"),
  config = require("./config"),
  CompressionPlugin = require("compression-webpack-plugin"),
  MonacoWebpackPlugin = require("monaco-editor-webpack-plugin"),
  TerserPlugin = require("terser-webpack-plugin");

let PRODUCTION = process.env.BUILD_ENV
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
    main: ["@babel/polyfill", "./src-web/index.js"]
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
        exclude: [
          {
            test: [/\.scss$/, path.resolve(__dirname, "./node_modules")],
            exclude: [
              path.resolve(__dirname, "./node_modules/fuse.js")
              //path.resolve(__dirname, './node_modules/temptifly'),
            ]
          }
        ],
        loader: "babel-loader?cacheDirectory",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: ["@babel/plugin-proposal-class-properties"]
        }
      },
      {
        test: [/\.s?css$/],
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader?sourceMap",
            options: {
              plugins: function() {
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
              prependData:
                '$font-path: "' + config.get("contextPath") + '/fonts";'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot)(\?.*$|$)/,
        loader: "file-loader?name=fonts/[name].[ext]"
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, "./node_modules/temptifly"),
          path.resolve(__dirname, "./node_modules/monaco-editor"),
          path.resolve(__dirname, "./node_modules/@stolostron/ui-components")
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
        test: /\.(png|jpg|jpeg|gif|svg|ttf|otf)(\?.*$|$)/,
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

  optimization: {
    minimize: PRODUCTION,
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  },

  output: {
    filename: PRODUCTION ? "js/[name].[contenthash].min.js" : "js/[name].js",
    // chunkFilename: PRODUCTION ? 'js/[name].[chunkhash].min.js' : 'js/[name].js',
    path: __dirname + "/public",
    publicPath: config.get("contextPath").replace(/\/?$/, "/"),
    jsonpFunction: "webpackJsonpFunctionApp"
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
    new MiniCssExtractPlugin({
      filename: PRODUCTION ? "css/[name].[contenthash].css" : "css/[name].css",
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      }
    }),
    new CompressionPlugin({
      filename: "[path].gz",
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
    new CopyPlugin({
      patterns: [
        { from: "graphics", to: "graphics" },
        { from: "fonts", to: "fonts" }
      ],
      options: {
        concurrency: 100
      }
    })
  ],
  resolve: {
    alias: {
      handlebars: "handlebars/dist/handlebars.min.js"
    },
    alias: {
      "react-router-dom": path.resolve("./node_modules/react-router-dom")
    }
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, "node_modules"),
      path.join(__dirname, "node_modules/node-i18n-util/lib") // properties-loader
    ]
  }
};
