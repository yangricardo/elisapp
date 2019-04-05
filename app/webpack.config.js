var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  entry: './frontend/src/index.jsx',
  output: {
    filename: 'main.js',
    path: __dirname + '/frontend/static/frontend'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new BundleTracker({ path: __dirname, filename: 'webpack-stats.json' })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};