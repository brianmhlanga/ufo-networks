module.exports = {
    apps: [
      {
        name: 'Review.co.zw',
        port: '3022',
        exec_mode: 'cluster',
        instances: '1',
        script: './.output/server/index.mjs' 
      }
    ]
  }