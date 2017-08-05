var path = require('path')
var webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin('styles.css')

var pkg = require('./package.json')

const browserConfig = {
  context: path.resolve(__dirname),
  target: 'web',
  entry: ['babel-polyfill', './client/scripts.js'],
  output: {
    path: path.resolve(__dirname, './build/public'),
    filename: 'scripts.js'
    // pathinfo: false, // TODO Add way to decide if this should have verbose path info or not (--verbose)
  }, // end output
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, './client')
        ],
        options: {
          presets: [
            ['env', {targets: pkg.browserslist}],
            'react',
            'stage-0'
          ]
        }
      },
      {
        test: /\.scss$/,
        loader: extractCSS.extract(['css-loader', 'sass-loader'])
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
    path: path.resolve(__dirname, './build/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs'
  },
  externals: [/^(?!\.|\/).+/i],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'stage-0', 'es2015']
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
