const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false'
  },
  server: {
    command: 'node test-server.js',
    port: process.env.PORT
  }
}