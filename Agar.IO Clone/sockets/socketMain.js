// Where all our main socket stuff will go.
const io = require('../server').io;
const Orb = require('./classes/orb');
let orbs = [];
initGame();
// Populate the orbs at the beginning of the game
function initGame() {
    for (let i = 0; i< 500; i++) {
        orbs.push(new Orb());
    }
}
io.sockets.on('connect', (socket) => {
    socket.emit('init', {
        orbs
    });
});


module.exports = io;