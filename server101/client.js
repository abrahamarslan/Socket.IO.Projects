const socket = io('http://localhost:8000');
console.log(socket);
//Send message when the client establishes the connection with the server
socket.on('connect', (data) => {
   //Listen to welcome event
    socket.on('welcome', (message) => {
       alert(message);
    });
    socket.emit('message', {data: 'Socket 101 Example: Message from client!'});
});
