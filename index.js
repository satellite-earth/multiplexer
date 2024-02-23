require('dotenv').config();
const WebSocket = require('ws');
const path = require('path');

const Http = require('../instance/http');

const Functions = require('./functions');

// Needed for nostr-tools relay lib
global.WebSocket = WebSocket;




// TODO start an http server on port 2011
// to serve the frontend applcation . . .
// might as well be an express server so
// that you can do things like server rss
// and stuff like that

// Create websocket server
const wss = new WebSocket.WebSocketServer({
	port: parseInt(process.env.PORT || 2012)
});

// Fix CORS
wss.on('headers', (headers, request) => {
	headers.push('Access-Control-Allow-Origin: *');
});

global.apps = {};

Http(req => {

	console.log('http request host!', req.host);

	return Functions.ResolveApp(req.host.split('.')[0]);

});

// Setup handlers for new connections
wss.on('connection', (ws, req) => {

	const app = Functions.ResolveApp(
		req.headers.host.split('.')[0]
	);

	if (!app) {
		//console.log(`Failed to find app with ID ${appId}`);
		return;
	}

	// Handle new connection
	const conn = app.relay.connect(ws, req);

	if (!conn) { return; }

	ws.on('message', (buffer) => {

		app.relay.message(buffer, conn);
	});

	ws.on('close', () => {

		app.relay.disconnect(ws);
	});

});

process.on('SIGINT', () => {
	Functions.Shutdown();
});

Functions.Startup();
