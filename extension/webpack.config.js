const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    popup: './popup.js',
    background: './background.js',
    content: './content.js',
    'firebase-bundle': './firebase-bundle.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};