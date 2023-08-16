function showFrameRate(){
    var sec = Math.floor(Date.now()/1000);
    if (sec != config.currentSec)
    {
        config.currentSec = sec;
        config.fps = config.frameRate;
        config.frameRate = 1;
    } else {config.frameRate++};
    document.getElementById("test_info").innerHTML =("FPS: "+ config.fps );
}

const refreshGame = () => {
    config.player.move()
    showFrameRate()
};