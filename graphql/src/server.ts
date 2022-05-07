'use strict'

import {build} from './app';

(async () => {
  const server = await build({
    logger: {
      level: 'info',
      prettyPrint: true
    }
  })

  server.listen(7100, (err: any, address: string) => {
    if (err) {
      console.log(err)
      process.exit(1)
    }
  })
})();
