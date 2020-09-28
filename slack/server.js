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
