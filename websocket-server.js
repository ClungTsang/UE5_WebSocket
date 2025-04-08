import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('New client connected');
  
  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
    
    // Broadcast to all clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

console.log('WebSocket server running on ws://localhost:8080');