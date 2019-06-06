const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('mini-css-extract-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const process = require('process')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8080
const title = 'Real-time transcription demo'


module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    bundle: './rtapp/boot'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map'
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, '.modernizrrc')
    }
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [ {
          loader: ExtractTextPlugin.loader,
      },
        'css-loader',
        'sass-loader'
    ]
      }
  , {
      // Applies to all imported '.html' files.
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader', // Parses HTML into escaped string that can be used as a variable.
          options: {
            interpolate: true
          }
        }
      ]
    }, {
      // Applied to all imported '.js' files.
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader', // Compiles ES2015 to backwards compatible JavaScript.
          options: {
            presets: ['@babel/preset-env'],
            plugins: [['angularjs-annotate', {"explicitOnly": true}]]
          }
        }
      ]
    }, {
      // Loads font assets references in stylesheets.
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
    }, {
      test: /\.modernizrrc.js$/,
      use: {
        loader: 'modernizr-loader'
      }
    },{
      test: /\.modernizrrc(\.json)?$/,
      use: [{
        loader: 'modernizr-loader'
      }, {
        loader: 'json-loader'
      }]
    }]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    // Generates index.html and injects entries into template.
    new HtmlWebpackPlugin({
      title: title,
      template: 'index.ejs',
      hash: true
    })
  ],
  externals: {
    angular: 'angular',
    moment: 'moment',
    navigator: 'navigator'
  }
}

switch (process.env.NODE_ENV) {
  case 'live':
    // Generates source maps.
    module.exports.devtool = 'source-map'
    // Required for webpack-dev-server inline mode.
    module.exports.entry.inline = `webpack-dev-server/client?http://${host}:${port}/`
    // Options for webpack-dev-server.
    module.exports.devServer = {
      host: host,
      port: port,
      inline: true,
      https: true,
      stats: {
        children: false,
        colors: true,
        chunks: false
      }
    }
    // Force webpack-dev-server to write files to disk for debugging purposes.
    // module.exports.plugins.unshift(new WriteFilePlugin(module.exports.output.path))
    break
  case 'dev':
    // Generates source maps.
    module.exports.devtool = 'source-map'
    module.exports.plugins.unshift(new CleanWebpackPlugin(module.exports.output.path, {
      verbose: false
    }))
    break
  case 'prod':
    // Prefix minified JavaScript files with '.min'.
    // module.exports.devtool = 'source-map'
    for (let key in module.exports.output) {
      if (typeof module.exports.output[key] === 'string' && module.exports.output[key].includes('.js')) {
        module.exports.output[key] = module.exports.output[key].replace('.js', '.min.js')
      }
    }
    module.exports.plugins = [...module.exports.plugins,
      new CleanWebpackPlugin(module.exports.output.path, {
        verbose: false
      }),
      new FaviconsWebpackPlugin({
        title: title,
        logo: './assets/favicon/icon.png',
        persistentCache: true
      }),
      new UglifyJSPlugin({
        // sourceMap: true,
        compress: {
          drop_debugger: true,
          drop_console: true
        }
      })
    ]
    break
}
