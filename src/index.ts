import WebSocket, { WebSocketServer } from 'ws';
import { createServer } from 'node:http';
import App from '@satellite-earth/personal-node/app';
import { useWebSocketImplementation } from 'nostr-tools/relay';
import { PORT, DATA_PATH } from './env.js';

// @ts-expect-error
global.WebSocket = WebSocket;

useWebSocketImplementation(WebSocket);

const server = createServer();

// Create websocket server
const wss = new WebSocketServer({ server });

// Fix CORS
wss.on('headers', (headers: any) => {
	headers.push('Access-Control-Allow-Origin: *');
});

// Listen for http connections
server.listen(PORT, () => {
	console.log('server running on port ' + PORT);
});
