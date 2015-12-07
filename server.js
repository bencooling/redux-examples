var Path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var example = (argv.example) ? argv.example : 'plain';
var examplePath = Path.join(__dirname, example);

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  contentBase: examplePath,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true }
}).listen(8000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:8000');
});
