// This is where all the data about the player (Public and Private) is stored
class Player {
    constructor (socketId, playerConfig, playerData) {
        this.socketId = socketId;
        this.playerConfig = playerConfig;
        this.playerData = playerData;
    }
}

module.exports = Player;