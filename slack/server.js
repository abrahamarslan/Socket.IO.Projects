const express = require('express');
const app = express();
const socketio = require('socket.io');
app.use(express.static(__dirname + '/public'));
let namespaces = require('./data/namespace.js');
//console.log(namespaces);
const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
    //build an array to send back with the image and endpoint for each Namespace
    let namespaceData = namespaces.map((namespace) => {
        return {
            img: namespace.img,
            endpoint: namespace.endpoint
        }
    });
    //Send this list to the clients
    socket.emit('nsList', namespaceData);
});

//loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
        nsSocket.emit('nsRoomLoad', namespaces[0].rooms);
        nsSocket.on('joinRoom', (roomToJoin, memberCountCallbackFunc) => {
            nsSocket.join(roomToJoin);
            io.of('/wiki').in(roomToJoin).clients((error, clients) => {
                memberCountCallbackFunc(clients.length);
            })
        });
        nsSocket.on('newMessageToServer', (message) => {            
            const data = {
                text: message,
                time: Date.now(),
                username: "abraham",
                avatar: "https://source.unsplash.com/random/30x30"
            }            
            console.log(message);
            console.log(nsSocket.rooms);
            // To find which room this socket is from and which room emitted this newMessageToServer 
            // The user will be in the 2nd room in the object list
            // This is because the socket always joins its own room on connection or re-connection
            // Get the keys
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            // Now broadcast this message from client to all clients of this room
            io.of('/wiki').to(roomTitle).emit('messageToClients', data);

            
        })
    });
});
