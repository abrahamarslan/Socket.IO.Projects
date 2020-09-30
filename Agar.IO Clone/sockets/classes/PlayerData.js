// This class will store the data about the player that will be broadcasted to everyone (Public Data)
class PlayerData {
    constructor(playerName, settings) {
        this.name = playerName;
        this.lockX = Math.floor(settings.worldWidth * Math.random() + 100);
        this.lockY = Math.floor(settings.worldWidth * Math.random() + 100);
        this.radius = settings.defaultSize;
        this.color = this.getRandomColor();
        this.score = 0;
    }

    getRandomColor() {
        const r = Math.floor((Math.random() * 200)+50);
        const g = Math.floor((Math.random() * 200)+50);
        const b = Math.floor((Math.random() * 200)+50);
        return `rgb(${r},${g},${b})`;
    }
}

module.exports = PlayerData;