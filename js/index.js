const initGame = () => {
    drawMap(defaultMap);
    config.player.element = document.getElementById("player")
    setEventListeners()
    config.loop = window.setInterval(()=>refreshGame(),25);
};

window.addEventListener("load", initGame(), false);
