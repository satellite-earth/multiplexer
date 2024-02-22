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

	// <name>.satellite.earth

	// KEEP WORKING . . . deploy this relay to live
	// server and test routing


	console.log('got connection from ' + req.headers.host);

	const name = req.headers.host.split('.')[0];

	// TODO if app ID is non-numeric, assume it refers to custom subdomain
	// and query to get the appId associated with that subdomain

	const appId = name;

	//const name = /* TODO parse subdomain from host */'uuid_sbowman';

	const app = apps[name];

	if (!app) {
		console.log(`Failed to find app with ID ${appId}`);
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
