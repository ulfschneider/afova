const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || '8888';
const SERVER = process.env.SERVER || 'http://localhost';
const ROOT = 'test/public';
const TEST_URL = `${SERVER}:${PORT}`;
const HEADLESS = process.env.HEADLESS !== 'false';


module.exports = {
    server: SERVER,
    port: PORT,
    root: ROOT,
    testURL: TEST_URL,
    headless: HEADLESS
  }
  