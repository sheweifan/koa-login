module.exports = {
  build: {
    babel: {
      plugins: [
        'lodash',
        ['component', [
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }]
        ]
      ],
      comments: true
    }
  },
  head: {
    title: '十八匠',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      // { src: 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    'minireset.css'
    // '~static/css/main.css'
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#409eff'
  },
  router: {
    middleware: 'address'
  }
  // plugins: [
  //   {
  //     src: '~plugins/element-ui',
  //     ssr: true
  //   }
  // ]
}
