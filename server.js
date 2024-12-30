const WebSocket = require('ws');

// Create WebSocket server directly (no HTTP server needed since XAMPP handles that)
const wss = new WebSocket.Server({ port: 8080 });

let queue = [];

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send the current queue to the new client
    ws.send(JSON.stringify(queue));

    ws.on('message', (message) => {
        const msg = message.toString();
        
        if (msg === 'next') {
            queue.shift();
            broadcastQueue();
        } else if (msg === 'remove') {
            broadcastQueue();
        } else {
            const newVideoId = msg.trim();
            if (newVideoId) {
                queue.push(newVideoId);
                broadcastQueue();
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function broadcastQueue() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(queue));
        }
    });
}

console.log('WebSocket Server running on ws://localhost:8080');