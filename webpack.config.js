var path = require('path')
var webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin('styles.css')

var pkg = require('./package.json')

const config = {
  context: path.resolve(__dirname),
  target: 'web',

  entry: ['babel-polyfill', './client/scripts.js'],
  output: {
    path: path.resolve(__dirname, './build/public'),
    filename: 'scripts.js'
    // publicPath: '/assets/', // Still not sure what this is for
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
            'stage-2'
          ]
        } // end options
      }, // end jsx
      {
        test: /\.scss$/,
        loader: extractCSS.extract(['css-loader', 'sass-loader'])
      }
    ] // end rules
  }, // end modules
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

module.exports = config
