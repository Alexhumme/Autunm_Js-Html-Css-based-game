const resetButton = document.getElementById("game__reset");
resetButton.addEventListener("click", () => game.reset(), false);
const pauseButton = document.getElementById("game__pause");
pauseButton.addEventListener("click", () => game.changePause(), false);

window.addEventListener("load", game.start(), false);
