const socket = io('http://localhost:9000');

console.log(socket);
//Send message when the client establishes the connection with the server
socket.on('connect', (data) => {

});
