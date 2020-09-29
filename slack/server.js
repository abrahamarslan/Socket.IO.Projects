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
        const username = nsSocket.handshake.query.username;
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
        nsSocket.emit('nsRoomLoad', namespace.rooms);
        nsSocket.on('joinRoom', (roomToJoin, memberCountCallbackFunc) => {

            //Leave the room which was previously joined
            const roomToLeave = Object.keys(nsSocket.rooms)[1];
            nsSocket.leave(roomToLeave);
            getUsersInRoom(namespace, roomToLeave);

            //Join the new room
            nsSocket.join(roomToJoin);
            // io.of('/wiki').in(roomToJoin).clients((error, clients) => {
            //     memberCountCallbackFunc(clients.length);
            // });
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomToJoin;
            });
            //console.log('-----------------------------------------------------------------------');
            //console.log(nsRoom.history);
            if(nsRoom) {
                nsSocket.emit('roomHistory', nsRoom.history)
            }

            // Update the number of users in the room and send back this data
            getUsersInRoom(namespace, roomToJoin);

        });
        nsSocket.on('newMessageToServer', (message) => {            
            const data = {
                text: message,
                time: Date.now(),
                id: nsSocket.id,
                username,
                avatar: "https://source.unsplash.com/random/30x30"
           }                      
        
            // To find which room this socket is from and which room emitted this newMessageToServer 
            // The user will be in the 2nd room in the object list
            // This is because the socket always joins its own room on connection or re-connection
            // Get the keys
            const roomTitle = Object.keys(nsSocket.rooms)[1];
            // To get the history, find the room object from the array of namespaces
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle;
            });
            if(nsRoom) {
                nsRoom.addMessage(data);
            }
            // Now broadcast this message from client to all clients of this room
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', data);

            
        })
    });
});

function getUsersInRoom(namespace, roomToJoin) {
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        io.of(namespace.endpoint).in(roomToJoin).emit('roomMembers', clients.length);
    })
}
