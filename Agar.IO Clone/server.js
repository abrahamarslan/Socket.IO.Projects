// Server.js is only for making socket.io server and the express server

const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
const socketIO = require('socket.io');
const expressServer = app.listen(8080);
const io = socketIO(expressServer);
const helmet = require('helmet');
app.use(helmet());
console.log('Application initialized');

// Module organization in files
module.exports = {
    app,
    io
}