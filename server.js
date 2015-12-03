var Path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var example = (argv.example) ? argv.example : 'plain';
var examplePath = Path.join(__dirname, example);

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var server = new WebpackDevServer(webpack(config), {

  contentBase: examplePath,

  hot: true,
  // Enable special support for Hot Module Replacement
  // Page is no longer updated, but a 'webpackHotUpdate' message is send to the content
  // Use 'webpack/hot/dev-server' as additional module in your entry point
  // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.
  historyApiFallback: true

  // webpack-dev-middleware options
  // quiet: true,
  // debug: true,
  // devtool: 'source-map',
  // lazy: true,
  // filename: 'build.js'
  // watchOptions: {
  //   aggregateTimeout: 300,
  //   poll: 1000
  // },
  // publicPath: '/assets/',
  // headers: { 'X-Custom-Header': 'yes' },
  // stats: { colors: true }
});

server.listen(8000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:8000');
});
