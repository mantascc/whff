import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8081 });

console.log('WebSocket server running on ws://localhost:8081');

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = message.toString();
    console.log('Received:', data);

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send welcome message
  ws.send(JSON.stringify({ type: 'connected', message: 'Canvas WebSocket ready' }));
});
