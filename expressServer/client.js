const socket = io('http://localhost:9000');
console.log(socket);
//Send message when the client establishes the connection with the server
socket.on('connect', (data) => {
    //Listen to welcome event
    socket.emit('messageToServer', {data: 'Connection established: Message from client!'});
    socket.on('ping', () => {
        console.log('Client: Ping to Server');
    });
    socket.on('pong', (latency) => {
        console.log('Client: Pong from Server | Latency: ', latency);
    });
});
