function showFrameRate() {
    var sec = Math.floor(Date.now() / 1000);
    game.currentFrame++;
    if (sec != game.currentSec) {
        game.currentSec = sec;
        game.fps = game.frameRate;
        game.frameRate = 1;

    } else { game.frameRate++ };
    game.info("FPS: " + game.fps);
    game.info("Sec: " + game.currentFrame)
}

const refreshGame = () => {
    if (!game.pause) {
        game.infoSpace.innerText = "";
        game.info("tiles: " + game.gameSpace.querySelectorAll("div").length)
        game.moveCamera();
        game.checkGameOver();
        game.player.update();
        game.updateEnemies();
        game.updateDrops();
        game.player.shoot.bullets.actives.forEach(bullet =>{
            bullet.update();
        })
         
        game.checkMapChange();
        showFrameRate();
    }
};