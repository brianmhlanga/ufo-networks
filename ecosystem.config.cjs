module.exports = {
    apps: [
      {
        name: 'UFO Networks',
        port: '3016',
        exec_mode: 'cluster',
        instances: '1',
        script: './.output/server/index.mjs' 
      }
    ]
  }