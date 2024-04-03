require('dotenv').config();
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');
const Http = require('../node/http');
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

const httpServer = Http((req, res, next) => {

	console.log('http request host!', req.host);

	const subdomain = req.host.split('')[0];

	// if (subdomain === 'relay') {
	// 	return;
	// }

	return Functions.ResolveApp(subdomain);

});

console.log('httpServer', httpServer);

httpServer.use(bodyParser());

httpServer.get('/favicon.ico', (req, res) => {

	res.sendFile(path.join(__dirname, 'assets/favicon.ico'));

});

httpServer.post('/event', (req, res) => {

	const event = req.body;

	console.log('event', event);

	let name;

	for (let tag of event.tags) {
		if (tag[0] === 'name') {
			name = tag[1];
		}
	}

	try {

		fs.mkdirSync(path.join(process.env.BASE_DATA_PATH, name));

		fs.writeFileSync(
			path.join(process.env.BASE_DATA_PATH, 'node.json'),
			Buffer.from(JSON.stringify(global.apps))
		);

	} catch (err) {
		console.log(err);
	}

	Functions.LoadApp({
		auth: '1234',
		uuid: name,
		name
	});

	res.send();

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

// Listen for http connections
httpServer.listen(parseInt(process.env.HTTP_PORT || 2011), () => {

	console.log(`http server running`);
});
