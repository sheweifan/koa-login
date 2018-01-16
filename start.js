const { resolve } = require('path')
const r = path => resolve(__dirname, path)

require('babel-core/register')({
  presets: [
    ['env', {
      targets: {
        node: '4.4.4'
      }
    }],
    'stage-3',
    'latest-node'
  ],
  plugins: [
    'transform-decorators-legacy',
    ['module-alias', [
      {src: r('./server'), 'expose': '~'},
      {src: r('./server/database'), 'expose': 'database'}
    ]]
  ]
})

require('babel-polyfill')
if (process.env.NODE_ENV === 'production') {
  require('./build/main.js')
} else {
  require('./server')
}
// require('./server/cralwer/uploader')
