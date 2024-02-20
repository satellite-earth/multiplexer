require('dotenv').config();
const WebSocket = require('ws');
const path = require('path');

const Functions = require('./functions');

// Needed for nostr-tools relay lib
global.WebSocket = WebSocket;


// Create websocket server
const wss = new WebSocket.WebSocketServer({
	port: parseInt(process.env.PORT || 2012)
});

// Fix CORS
wss.on('headers', (headers, request) => {
	headers.push('Access-Control-Allow-Origin: *');
});

global.apps = {};

// Setup handlers for new connections
wss.on('connection', (ws, req) => {

	console.log('got connection from ' + req.headers.host);

	const name = /* TODO parse subdomain from host */'uuid_sbowman';

	const app = apps[name];

	if (!app) { return; }

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
