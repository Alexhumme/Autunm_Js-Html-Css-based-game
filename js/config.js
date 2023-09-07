const game = {
    pause: false,
    gameSpace: document.getElementById("game__container"),
    currentMap: 0,
    maps: [map1, map2, map3],
    gameOver: false,
    fps: 25,
    drops: [],
    dropSpan: {
        rate: 2000,
        counter: 0,
        limit: 30,
    },
    enemies: [],
    currentScene: "menu",
    frameRate: 0,
    currentSec: 0,
    loop: null,
    gameSize: { x: 700, y: 400 },
    tileWidth: 50,
    tileHeight: 50,
    gravity: 2,
    fallLimit: 12,
    glide: 0.8,
    keys: [],
    infoSpace: document.getElementById("test_info"),
    player: new Player(), // crear jugador
    changeScene: (scene) => {
        game.currentScene = scene;
        switch (game.currentScene) {
            case "startMenu":
                game.pause = true;
                game.gameOver = true;
                game.drawMenu();
                break;
            case "game":
                game.start();
                break;
            default:
                break;
        }
    },
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
    updateEnemies: () => {
        game.enemies.forEach(enemie => {
            enemie.update()
        });
    },
    // Dibujar la interfaz del juego de manera más eficiente
    drawInterface: () => {
        const mapsContainer = document.getElementById("game__maps");
        const hContainer = document.getElementById("game__hearts");
        const slotsContainer = document.getElementById("game__items");
        const pointsContainer = document.getElementById("game__points");

        mapsContainer.innerHTML = "";
        hContainer.innerHTML = "";
        slotsContainer.innerHTML = "";
        pointsContainer.innerHTML = "";

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
        for (slot in game.player.slots) {
            const newSlot = document.createElement("div");
            newSlot.classList.add("player_slot");
            slotsContainer.appendChild(newSlot);
        }
        pointsContainer.innerText = game.player.shoot.bullets.quantity + " Bullets";

    },
    cleanMap: () => {
        game.gameSpace.querySelector("#startMenu")?.remove();
        game.player.shoot.bullets.actives.forEach(bullet => bullet.destroy());
        game.player.shoot.bullets.actives = [];
        game.enemies.forEach(enemie => enemie.destroy());
        game.enemies = [];
        game.gameSpace.querySelectorAll(".hearts-mini_container").forEach((container) => {
            container.remove()
        })
        game.gameSpace.querySelectorAll(".wall").forEach((wall) => {
            wall.remove()
        })
        game.gameSpace.querySelectorAll(".middle").forEach((middle) => {
            middle.remove()
        })
        game.gameSpace.querySelector("#trash")?.remove();
    },
    drawMenu: () => {
        game.cleanMap()
        //game.gameSpace.style.backgroundImage = "."
        const options = [
            { title: "Iniciar", scene: "game" },
            { title: "Opciones", scene: "" },
            { title: "Creditos", scene: "" },
        ];
        const menu = document.createElement("ul");
        menu.id = "startMenu";
        const menuTitle = document.createElement("h2");
        menuTitle.innerText = "Menu";
        menu.appendChild(menuTitle);
        options.forEach((option) => {
            const opt = document.createElement("li");
            opt.addEventListener("click", () => {
                game.changeScene(option.scene);
            })
            //opt.innerHTML = document.createElement("button");
            opt.innerText = option.title;
            menu.appendChild(opt);
        })
        game.gameSpace.appendChild(menu);

    },
    // dibujar los tiles del mapa actual incluyendo al jugador
    drawMap: () => {
        // limpiar el gameSpace
        game.cleanMap();
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
        game.drawMapEnemies();
    },
    drawMapEnemies: () => {
        game.maps[game.currentMap].enemies.forEach((row, y) => {
            row.forEach((enemieType, x) => {
                let enemie = false;
                switch (enemieType) {
                    case "z": enemie = new Zombie(); break;
                    case "k": enemie = new Pumpkin(); break;
                    default: return false;
                }
                enemie.element.style.top = `${y * 50}px`;
                enemie.element.style.left = `${x * 50}px`;
                game.enemies.push(enemie);

            })
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
        const container = document.getElementById("project__container");
        container.className = "started"
        game.drawInterface();
        game.player.element = document.getElementById("player");
        setEventListeners();
        game.loop = window.setInterval(() => refreshGame(), 25);
        game.gameOver = false;
        game.pause = false;
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
