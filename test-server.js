
const config = require('./test-server.config.js');
const liveServer = require('live-server');

let params = {
	port: config.port, // Set the server port. Defaults to 8080.
	host: config.host, // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
	root: config.root, // Set root directory that's being served. Defaults to cwd.
	open: false, // When false, it won't load your browser by default.
	file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
};

liveServer.start(params);
