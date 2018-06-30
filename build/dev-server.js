require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')

var webpack = require('webpack')

var webpackConfig = require('./webpack.dev.conf')



var compiler = webpack(webpackConfig)
const watching = compiler.watch({
  aggregateTimeout: 300,
  poll: 1000
 
}, (err, stats) => {
  // 在这里打印 watch/build 结果...
  console.log(stats);
});


// module.exports = {
//   ready: readyPromise,
//   close: () => {
//     server.close()
//   }
// }
