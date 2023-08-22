function showFrameRate(){
    var sec = Math.floor(Date.now()/1000);
    if (sec != game.currentSec)
    {
        game.currentSec = sec;
        game.fps = game.frameRate;
        game.frameRate = 1;
    } else {game.frameRate++};
    game.info("FPS: "+ game.fps );
}

const refreshGame = () => {
    game.infoSpace.innerText = "";
    game.checkGameOver();
    game.player.update();
    //game.generateDrops();
    game.drops.forEach(drop => {
        drop.update()
    });
    game.checkMapChange();
    showFrameRate();
};