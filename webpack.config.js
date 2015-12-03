var Path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var example = (argv.example) ? argv.example : 'plain';
var examplePath = Path.join(__dirname, example);

var webpack = require('webpack');

// webpack.config.js
module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8000',
    'webpack/hot/dev-server',
    Path.join(examplePath, 'entry.js')
  ],
  output: {
    path: examplePath,
    publicPath: examplePath,
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015,presets[]=stage-3']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
