const handler = require('serve-handler');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response);
});

server.listen(process.env.PORT, () => {
  console.log(`Running at http://localhost:${process.env.PORT}`);
});
