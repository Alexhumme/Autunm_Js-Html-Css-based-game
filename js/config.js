const game = {
    pause: false,
    gameSpace: document.getElementById("game__container"),
    currentMap: 0,
    maps: [map1],
    gameOver: false,
    fps: 35,
    drops: [],
    enemies: [],
    enemieKeys: ["z", "k", "g", "h"],
    dropKeys: ["c", "b", "q"],
    currentScene: "menu",
    frameRate: 0,
    currentSec: 0,
    loop: null,
    gameSize: { x: 700, y: 400 },
    tileWidth: 50,
    tileHeight: 50,
    gravity: 3,
    fallLimit: 12,
    glide: 0.8,
    keys: [],
    infoSpace: document.getElementById("test_info"),
    player: new Player(), // crear jugador
    changeScene: (scene) => {
        game.currentScene = scene;
        game.gameSpace.className = "changing";
        switch (game.currentScene) {
            case "startMenu":
                game.drawMenu();
                break;
            case "game":
                game.reset();
                break;
            default:
                break;
        }
        setTimeout(() => {
            game.gameSpace.classList.remove("changing");
        }, 1000);
    },
    handleKeyDown: (ev) => {
        game.keys = game.keys || [];
        game.keys[ev.keyCode] = true;
        game.player.idle = false;
    },
    handleKeyUp: (ev) => {
        game.keys[ev.keyCode] = false;
        game.player.idle = true;
        (ev.key === "a" || ev.key === "d") &&
            game.player.element.classList.remove("run");
        game.player.element.classList.add("idle");
    },
    // Función para mostrar información en el espacio de información
    info: (info) => {
        game.infoSpace.innerText += `\n${info}`;
    },
    updateEnemies: () => {
        game.enemies.forEach((enemie) => {
            enemie.update();
        });
    },
    updateDrops: () => {
        game.drops.forEach((drop) => {
            drop.update();
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
            mapItem.className =
                index === game.currentMap ? "map-item" : "map-item__disabled";
            mapItem.innerText = map.name;
            mapsContainer.appendChild(mapItem);
        });
        for (let index = 0; index < game.player.hearts.max; index++) {
            const heart = document.createElement("div");
            heart.className =
                index >= game.player.hearts.quantity ? "heart__container" : "heart";
            hContainer.appendChild(heart);
        }
        for (slot in game.player.slots) {
            const newSlot = document.createElement("div");
            newSlot.classList.add("player_slot");
            slotsContainer.appendChild(newSlot);
        }
        pointsContainer.innerText = `${game.player.shoot.bullets.quantity}Bs ${game.player.coins}Bs`;
    },
    cleanMap: () => {
        game.gameSpace.querySelector("#startMenu")?.remove();
        game.player.shoot.bullets.actives.forEach((bullet) => bullet.destroy());
        game.player.shoot.bullets.actives = [];
        game.enemies.forEach((enemie) => enemie.destroy());
        game.enemies = [];
        game.gameSpace
            .querySelectorAll(".hearts-mini_container")
            .forEach((container) => {
                container.remove();
            });
        game.gameSpace.querySelectorAll(".wall").forEach((wall) => {
            wall.remove();
        });
        game.gameSpace.querySelectorAll(".middle").forEach((middle) => {
            middle.remove();
        });
        game.gameSpace.querySelector("#trash")?.remove();
    },
    drawPauseMenu: () => {
        game.gameSpace.querySelector("#game__pause-menu")?.remove();
        const pauseMenu = document.createElement("div");
        pauseMenu.id = "game__pause-menu";
        pauseMenu.appendChild(document.createElement("h3"));
        pauseMenu.querySelector("h3").innerText = "Opciones";
        const optionsList = document.createElement("ul");
        const options = [
            { title: "salir", onClick: () => game.changeScene("startMenu") },
        ];
        options.forEach((option) => {
            const optionElement = document.createElement("li");
            optionElement.innerText = option.title;
            optionsList.appendChild(optionElement);
            optionElement.addEventListener("click", () => option.onClick(), false);
        });
        pauseMenu.appendChild(optionsList);
        game.gameSpace.appendChild(pauseMenu);
    },
    drawMenu: () => {
        game.cleanMap();
        document.getElementById("project__container").className = "";
        game.gameSpace.innerHTML = "";
        game.pause = false;
        game.gameOver = false;

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
            });
            //opt.innerHTML = document.createElement("button");
            opt.innerText = option.title;
            menu.appendChild(opt);
        });
        clearInterval(game.loop);
        setTimeout(() => {
            game.gameSpace.appendChild(menu);
        }, 500);
    },
    // dibujar los tiles del mapa actual incluyendo al jugador
    drawMap: () => {
        // limpiar el gameSpace
        game.cleanMap();
        // rellenar el gameSpace
        game.drawMapBack();
        game.drawMapMiddle();
        game.drawMapFront();
    },
    drawMapBack: () => {
        game.maps[game.currentMap].back?.forEach((row, y) => {
            row.forEach((t, x) => {
                t !== " " &&
                    game.gameSpace.insertBefore(tile(t, { x: x, y: y }, "back"), null);
            });
        });
    },
    drawMapMiddle: () => {
        game.maps[game.currentMap].middle.forEach((row, y) => {
            row.forEach((t, x) => {
                t !== " " && game.drawTile(t, { x: x, y: y }, "middle");
            });
        });
    },
    drawMapFront: () => {
        game.maps[game.currentMap].front?.forEach((row, y) => {
            row.forEach((t, x) => {
                t !== " " &&
                    game.gameSpace.insertBefore(tile(t, { x: x, y: y }, "front"), null);
            });
        });
    },
    drawTile: (t, pos = { x: Number.prototype, y: Number.prototype }, depth) => {
        if (depth === "middle") {
            if (game.enemieKeys.includes(t)) {
                let enemie = false;
                switch (t) {
                    case "z": enemie = new Zombie(); break;
                    case "k": enemie = new Pumpkin(); break;
                    case "g": enemie = new GreenPumpkin(); break;
                    case "h": enemie = new Ghost(); break;
                    default: return;
                }
                enemie.element.style.top = `${pos.y * 50}px`;
                enemie.element.style.left = `${pos.x * 50}px`;
                game.enemies.push(enemie);
                return;
            }
            if (game.dropKeys.includes(t)) {
                let dropType = "";
                switch (t) {
                    case "c": dropType = "coin";  break;
                    case "b": dropType = ""; break;
                    default: return;
                }
                game.drops.push(
                    new Drop(dropType, {
                        x: pos.x * game.tileWidth,
                        y: pos.y * game.tileHeight,
                    })
                );
                return;
            }
            game.gameSpace.appendChild(tile(t, { x: pos.x, y: pos.y }, "wall"));
        } else  game.gameSpace.appendChild(tile(t, { x: pos.x, y: pos.y }, depth));
    },
    // Verificar si el juego ha terminado de manera más eficiente
    checkGameOver: () => {
        if (
            game.player?.hearts.quantity <= 0 ||
            parseInt(game.player?.element?.style.top) > game.gameSize.y
        ) {
            game.gameOver = true;
        }
        if (game.gameOver) {
            clearInterval(game.loop);
            game.gameSpace.classList.add("game__over");
        }
    },
    start: () => {
        game.drawPauseMenu();
        game.drawMap();
        const container = document.getElementById("project__container");
        container.className = "started";
        game.drawInterface();
        game.player.element = document.getElementById("player");
        setEventListeners();
        game.loop = window.setInterval(() => refreshGame(), 1000 / game.fps);
        game.gameOver = false;
        game.pause = false;
    },
    // Función de reinicio (dejar en blanco o agregar lógica si es necesario)
    reset: () => {
        clearInterval(game.loop);
        if (game.pause) game.changePause();
        game.gameSpace.className = "changing";
        setTimeout(() => {
            game.player = new Player();
            game.drops = [];
            game.enemies= [];
            game.gameSpace.innerHTML = "";
            game.gameOver = false;
            game.currentMap = 0;
            window.removeEventListener("keydown", game.handleKeyDown, false);
            window.removeEventListener("keyup", game.handleKeyUp, false);
            game.gameSpace.classList.remove("changing");
            game.start();
        }, 500);
    },
    // pausar el juego
    changePause: () => {
        game.pause = !game.pause;
        if (game.gameSpace.classList.contains("game__paused")) {
            game.gameSpace.classList.remove("game__paused");
            document.getElementById("game__pause").className = "";
        } else {
            game.gameSpace.classList.add("game__paused");
            document.getElementById("game__pause").className = "game__continue";
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
    },
};
