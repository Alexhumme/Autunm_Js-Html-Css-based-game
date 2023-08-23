const game = {
    pause: false,
    gameSpace: document.getElementById("game__container"),
    currentMap: 0,
    maps: [defaultMap, map2],
    drops: [],
    gameOver: false,
    fps: 25,
    dropSpan: {
        rate: 50,
        counter: 0,
        limit: 4,
    },
    frameRate: 0,
    currentSec: 0,
    loop: null,
    gameSize: { x: 700, y: 400 },
    tileWidth: 50,
    tileHeight: 50,
    gravity: 2,
    fallLimit: 8,
    glide: 0.8,
    keys: [],
    infoSpace: document.getElementById("test_info"),
    handleKeyDown: (ev) => {
        game.keys = (game.keys || []);
        game.keys[ev.keyCode] = true;
        game.player.idle = false;
    },
    handleKeyUp: (ev) => {
        game.keys[ev.keyCode] = false;
        game.player.idle = true;
        (ev.key === ("a") || ev.key === ("d"))
            && game.player.element.classList.remove("run");
        game.player.element.classList.add("idle");
    },
    player: new Player(), // crear jugador
    // Función para mostrar información en el espacio de información
    info: (info) => {
        game.infoSpace.innerText += `\n${info}`;
    },

    // Generar gotas de manera más eficiente
    generateDrops: () => {
        if (game.dropSpan.counter > game.dropSpan.rate) {
            const xPos = Math.random() * (game.gameSize.x - game.tileWidth);
            const yPos = -100;
            const types = ["blue", "red", "green"];
            const drop = new Drop(Math.random() * 0.3, types[Math.floor(Math.random() * 3)], { x: xPos, y: yPos });
            drop.createElement();
            game.drops.push(drop);
            game.dropSpan.counter = 0;
        } else {
            game.dropSpan.counter++;
        }
        if (game.drops.length > game.dropSpan.limit) {
            game.drops.shift().destroy();
        }
    },

    // Dibujar la interfaz del juego de manera más eficiente
    drawInterface: () => {
        const mapsContainer = document.getElementById("game__maps");
        const hContainer = document.getElementById("game__hearts");
        mapsContainer.innerHTML = "";
        hContainer.innerHTML = "";

        game.maps.forEach((map, index) => {
            const mapItem = document.createElement("div");
            mapItem.className = index === game.currentMap ? "map-item" : "map-item__disabled";
            mapItem.innerText = map.name;
            mapsContainer.appendChild(mapItem);
        });

        for (let index = 0; index < game.player.hearts.max; index++) {
            const heart = document.createElement("div");
            heart.className = index >= game.player.hearts.quantity ? "heart__container" : "heart";
            hContainer.appendChild(heart);
        }
    },
    // dibujar los tiles del mapa actual incluyendo al jugador
    drawMap: () => {
        // limpiar el gameSpace
        game.gameSpace.querySelectorAll(".wall").forEach((wall) => {
            wall.remove()
        })
        game.gameSpace.querySelectorAll(".middle").forEach((middle) => {
            middle.remove()
        })
        game.gameSpace.querySelector("#trash")?.remove();

        // rellenar el gameSpace
        game.maps[game.currentMap].middleground.forEach((row, y) => {
            row.forEach((t, x) => {
                t !== " " &&
                    game.gameSpace
                        .insertBefore(
                            tile(t, { x: x, y: y }, "middle"),
                            null);
            });
        });
        game.maps[game.currentMap].walls.forEach((row, y) => {
            row.forEach((t, x) => {
                t !== " " &&
                    game.gameSpace
                        .insertBefore(
                            tile(t, { x: x, y: y }, "wall"),
                            null);
            });
        });
    },

    // Verificar si el juego ha terminado de manera más eficiente
    checkGameOver: () => {
        if (game.player.hearts.quantity <= 0 || parseInt(game.player.element.style.top) > game.gameSize.y) {
            game.gameOver = true;
        }
        if (game.gameOver) {
            clearInterval(game.loop);
            game.gameSpace.classList.add("game__over");
        }
    },
    start: () => {
        game.drawMap();
        game.drawInterface();
        game.player.element = document.getElementById("player");
        setEventListeners();
        game.loop = window.setInterval(() => refreshGame(), 25);
    },
    // Función de reinicio (dejar en blanco o agregar lógica si es necesario)
    reset: () => {
        clearInterval(game.loop);
        if (game.pause) game.changePause();
        game.player = new Player;
        game.drops = [];
        game.gameSpace.innerHTML = "";
        game.gameOver = false;
        game.gameSpace.className = "";
        game.currentMap = 0;
        window.removeEventListener("keydown",
            game.handleKeyDown
            , false);
        window.removeEventListener("keyup",
            game.handleKeyUp
            , false);
        game.start();
    },
    // pausar el juego
    changePause: () => {
        game.pause = !game.pause;
        if (game.gameSpace.classList.contains("game__paused")) {
            game.gameSpace.classList.remove("game__paused");
            document.getElementById("game__pause").className = "";

            console.log("continue");
        } else {
            game.gameSpace.classList.add("game__paused");
            document.getElementById("game__pause").className = "game__continue";
            console.log("pause");
        }
    },
    // cambiar de mapa
    checkMapChange: () => {
        game.info("mapa actual: " + game.currentMap)
        if (parseInt(game.player.element.style.left) >= game.gameSize.x - 25) {
            if (game.currentMap < game.maps.length - 1) {
                game.currentMap++;
                game.drawInterface();
                game.drawMap();
                game.player.element.style.left = "-24px";
            } else {
                game.player.element.style.left = `${game.gameSize.x - 26}px`;
            }
        }
        if (parseInt(game.player.element.style.left) < -25) {
            if (game.currentMap > 0) {
                game.currentMap--;
                game.drawInterface();
                game.drawMap();
                game.player.element.style.left = `${game.gameSize.x - 26}px`;
            } else {
                game.player.element.style.left = "-24px";
            }
        }
    }
};
