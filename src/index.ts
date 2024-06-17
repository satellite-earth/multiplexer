import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'node:http';
import App from '@satellite-earth/personal-node/app';
import { useWebSocketImplementation } from 'nostr-tools/relay';
import { PORT, DATA_PATH } from './env.js';

// @ts-expect-error
global.WebSocket = WebSocket;

useWebSocketImplementation(WebSocket);

const server = createServer();
// const wss = new WebSocketServer({ server });

// Create websocket server
const wss = new WebSocketServer({ server });

// Fix CORS
wss.on('headers', (headers: any) => {
	headers.push('Access-Control-Allow-Origin: *');
});

// TODO manager

// DEV STUFF PLEASE IGNORE
// const Manager = {
// 	apps: {
// 		sbowman: new App('/Users/sbowman/Desktop/demo/sbowman'),
// 	},
// };
// Manager.apps.sbowman.control.attachToServer(wss);
// const sbowmanPubkey = 'ff27d01cb1e56fb58580306c7ba76bb037bf211c5b573c56e4e70ca858755af0';
// Manager.apps.sbowman.config.setField('owner', sbowmanPubkey);
// // Setup handlers for new connections
// wss.on('connection', (ws, req) => {
// 	if (req.url === '/') return Manager.apps.sbowman.relay.handleConnection(ws, req);
// 	Manager.apps.sbowman.relay.handleConnection(ws, req);
// });
// Manager.apps.sbowman.start();

// Listen for http connections
server.listen(PORT, () => {
	console.log('servecdr running on port ' + PORT);
});
