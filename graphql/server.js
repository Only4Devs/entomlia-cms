'use strict'

require('./app')({
  logger: {
    level: 'info',
    prettyPrint: true
  }
}).then(server => {
  server.listen(7100, (err, address) => {
    if (err) {
      console.log(err)
      process.exit(1)
    }
  })
})
