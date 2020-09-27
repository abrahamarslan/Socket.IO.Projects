const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
   socket.emit('messageFromServer',{data: 'Welcome to SocketIO Server'});
   socket.on('messageToServer', (dataFromClient) => {
       console.log(dataFromClient);
   });
   socket.on('ping', () => {
       console.log('Server: Ping from client');
   });
   socket.on('pong', (latency) => {
       console.log('Server: Pong to client | Latency: ', latency);
   });
   socket.on('post-message', (message) => {
       console.log(message);
       io.emit('new-message', {message})
   })
});
