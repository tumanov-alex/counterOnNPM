'use strict'

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  entry: "./index",
  output: {
    path: __dirname + "/dist",
    filename: "build.js"
  },
  watch: NODE_ENV === 'development',
  watchOptions: {
    aggregateTimeout: 100
  },
  devtool: NODE_ENV === 'development' ? "cheap-module-source-map" : null,

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ["es2015", "stage-0", "react"],
        plugins: ["transform-runtime"]
      }
    }]
  }
}