module.exports = {
  apps: [
    {
      name: 'To Do API',
      script: './dist/src/http/server.js',
      instances: 1,
    },
  ],
}
