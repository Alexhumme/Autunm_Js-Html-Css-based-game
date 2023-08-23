function showFrameRate() {
    var sec = Math.floor(Date.now() / 1000);
    if (sec != game.currentSec) {
        game.currentSec = sec;
        game.fps = game.frameRate;
        game.frameRate = 1;
    } else { game.frameRate++ };
    game.info("FPS: " + game.fps);
}

const refreshGame = () => {
    if (!game.pause) {
        game.infoSpace.innerText = "";
        game.info(`pause: ${game.pause}`);

        game.checkGameOver();
        game.player.update();
        //game.generateDrops();
        game.drops.forEach(drop => {
            drop.update()
        });
        game.player.shoot.bullets.actives.forEach(bullet =>{
            bullet.update();
        })
        game.checkMapChange();
        showFrameRate();
    }
};