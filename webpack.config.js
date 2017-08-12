var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin('styles.css')

var pkg = require('./package.json')
var config = require('config')
fs.writeFileSync(
  'client-config.json',
  JSON.stringify(config.get('client'))
)
require('dotenv').config({path: 'config/.env.' + process.env.NODE_ENV})

const browserConfig = {
  context: path.resolve(__dirname),
  target: 'web',
  entry: ['babel-polyfill', './client/scripts.js'],
  output: {
    path: path.join(__dirname, 'build', 'public'),
    filename: 'scripts.js',
    publicPath: '/'
    // pathinfo: false, // TODO Add way to decide if this should have verbose path info or not (--verbose)
  }, // end output
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        include: [path.join(__dirname, 'client')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {targets: pkg.browserslist}],
              'react',
              'stage-0'
            ],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // relative: true,
              name: '[path][name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.argv.includes('-p') || process.argv.includes('--production') ? '"production"' : '"development"',
      'process.env.BROWSER': true
    }),
    extractCSS
    // TODO add Common Chunks
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
}

const serverConfig = {
  context: path.resolve(__dirname),
  target: 'node',

  entry: ['babel-polyfill', './server/index.js'],
  output: {
    path: path.join(__dirname, 'build', 'server'),
    filename: 'index.js',
    libraryTarget: 'commonjs'
  },
  externals: [/^(?!\.|\/).+/i],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'stage-0', 'es2015'],
            cacheDirectory: true
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  }
}

module.exports = [browserConfig, serverConfig]
