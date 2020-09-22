const http = require('http');

//3rd party module
const websocket = require('ws');

const server = http.createServer((req, res) => {
   res.end("I am connected!");
});

const wss = new websocket.Server({server});

//Now when the client is first connected, it sends some headers - get those headers and print them.
wss.on('headers', (headers, req) => {
    console.log(headers);
});

//Now get the connection event
wss.on('connection', (ws, req) => {
   //console.log(req);
    //Send a message to the client
   ws.send('Welcome to the Websocket Server 101');
   //Listen to any incoming message from the client.
    ws.on('message', (message) => {
        console.log('Message received from the client: ', message);
    })
});

server.listen(8000);
