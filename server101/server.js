const http = require('http');

//3rd party module
const socketIO = require('socket.io');

const server = http.createServer((req, res) => {
    res.end("Basic example");
});

//Create socket.io instance
const io = socketIO(server);

//Start listening
io.on('connection', (socket, req) => {
    //ws.send becomes socket.emit
    //emit 'welcome' event with a message
    socket.emit('welcome','Basic Server example with Socket.IO: Serverside');
    socket.on('message', (message) => {
       console.log(message);
    });
});

server.listen(8000);
