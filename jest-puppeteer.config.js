const dotenv = require('dotenv');
dotenv.config();
const config = require('./test-server.config.js');

module.exports = {
  launch: {
    headless: config.headless
  },
  server: {
    command: 'node test-server.js',
    port: config.port
  }
}