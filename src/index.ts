import Application from '@src/application'

const server = new Application()
server
  .bootstrap()
  .catch((app) => {
    app.shutdown()
    process.exit()
  })
