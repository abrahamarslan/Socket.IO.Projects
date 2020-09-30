// Where all our main socket stuff will go.
const io = require('../server').io;
const Orb = require('./classes/orb');
const Player = require('./classes/Player');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
let orbs = [];
let players = [];
let settings = {
    defaultOrbs: 500,
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5, // As the player gets bigger, we need to zoom out.
    worldWidth: 500,
    worldHeight: 500
};
initGame();
// Populate the orbs at the beginning of the game
function initGame() {
    for (let i = 0; i< settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings));
    }
}
io.sockets.on('connect', (socket) => {
    // A player has connected
    socket.on('init', (data) => {
        // Make a player configuration object
        let playerConfig = new PlayerConfig(settings);
        // Make a player data object
        let playerData = new PlayerData(data.playerName, settings);
        // Make a player objec
        let player = new Player(socket.id, playerConfig, playerData);
        players.push(playerData);
        socket.emit('initReturn', {
            orbs
        });
    })    
});


module.exports = io;