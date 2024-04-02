const game = {
    pause: false,
    gameSpace: document.getElementById("game__container"),
    currentMap: 0,
    bgLayers: [],
    maps: [...maps],
    gameOver: false,
    fps: 28,
    drops: [],
    enemies: [],
    enemieKeys: ["z", "k", "g", "h"],
    dropKeys: ["c", "b", "q"],
    currentScene: "menu",
    frameRate: 0,
    currentSec: 0,
    currentFrame: 0,
    loop: null,
    gameSize: { x: 700, y: 450 },
    mapWidth: 0,
    tileWidth: 50,
    tileHeight: 50,
    gravity: 3,
    fallLimit: 12,
    glide: 0.8,
    keys: [],
    infoSpace: document.getElementById("test_info"),
    showJoysticks: false,
    player: new Player(), // crear jugador
    changeScene: (scene) => {
        game.currentScene = scene;
        game.gameSpace.className = "changing";
        switch (game.currentScene) {
            case "startMenu": game.drawMenu(); break;
            case "game": game.reset(); break;
            case "maps": game.mapsListed(); break;
            case "editMode": game.editMode(); break;
            default: break;
        }
        setTimeout(() => {
            game.gameSpace.classList.remove("changing");
        }, 1000);
        console.log(`- going ${scene}`);
    },
    handleKeyDown: (ev) => {
        game.keys = game.keys || [];
        game.keys[ev.keyCode] = true;
        game.player.idle = false;
    },
    handleKeyUp: (ev) => {
        game.keys[ev.keyCode] = false;
        game.player.idle = true;
        (ev.keyCode === 65 || ev.keyCode === 68) &&
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
    newMap: () => {

    },
    drawInterface: () => {
        const mapsContainer = document.getElementById("game__maps");
        const hContainer = document.getElementById("game__hearts");
        const slotsContainer = document.getElementById("game__items");
        const pointsContainer = document.getElementById("game__points");

        mapsContainer.innerHTML = "";
        hContainer.innerHTML = "";
        slotsContainer.innerHTML = "";

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

        pointsContainer.querySelector(".coins")
            .querySelector("span").innerText = game.player.coins;

        pointsContainer.querySelector(".bullets")
            .querySelector("span").innerText = game.player.shoot.bullets.quantity;
    },
    cleanMap: () => {
        game.gameSpace.querySelector("#startMenu")?.remove();
        game.player.shoot.bullets.actives.forEach((bullet) => bullet.destroy());
        game.drops.forEach((drop) => drop.destroy());

        game.player.shoot.bullets.actives = [];

        game.enemies.forEach((enemie) => enemie.destroy());
        game.enemies = [];
        game.gameSpace
            .querySelectorAll(".hearts-mini_container")
            .forEach((container) => {
                container.remove();
            });
        game.gameSpace.querySelectorAll(".dust").forEach((dust) => dust.remove());
        game.gameSpace.querySelectorAll(".tile").forEach((tile) => tile.remove());
        game.gameSpace.querySelector("#trash")?.remove();
        game.gameSpace.querySelectorAll(".bg-layer").forEach((l) => l.remove());
        game.bgLayers = [];
    },
    drawPauseMenu: () => {
        game.gameSpace.querySelector("#game__pause-menu")?.remove();
        const pauseMenu = document.createElement("div");
        pauseMenu.id = "game__pause-menu";
        pauseMenu.appendChild(document.createElement("h3"));
        pauseMenu.querySelector("h3").innerText = "Opciones";
        const optionsList = document.createElement("ul");
        const options = [
            { title: ` joysticks: ${game.showJoysticks ? "on" : "off"}`, onClick: () => game.switchShowJoysticks() },
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
        console.log("- menu drawn");
    },
    drawMenu: () => {
        game.cleanMap();
        document.getElementById("project__container").className = "";
        game.gameSpace.innerHTML = "";
        game.pause = false;
        game.gameOver = false;

        const options = [
            { title: "Iniciar", scene: "game" },
            { title: "Mapas", scene: "maps" },
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
            opt.innerText = option.title;
            menu.appendChild(opt);
        });
        clearInterval(game.loop);
        setTimeout(() => {
            game.gameSpace.appendChild(menu);
        }, 500);
        console.log("- menu drawn");
    },
    handleParallax: () => {
        game.bgLayers.forEach((layer, index) => {
            layer.style.left = `${parseFloat(layer.style.left) + index * (game.player.vel.x > 0 ? 1 : -1)}px`;
        })
    },
    // dibujar los tiles del mapa actual incluyendo al jugador
    drawMap: () => {
        game.mapWidth = game.maps[game.currentMap].middle[0].length * game.tileWidth; // el ancho del mapa, se usa en varios metodos
        // limpiar el gameSpace
        game.cleanMap();
        // rellenar el gameSpace
        game.drawBackground();
        game.drawMapLayer("back");
        game.drawMapMiddle();
        game.drawMapLayer("front");
        game.drawMapLimits();
    },
    drawMapLimits: () => {
        game.gameSpace.querySelectorAll(".map_lim").forEach((lim) => lim.remove())

        game.limitRight = game.gameSpace.appendChild(document.createElement("div"));
        game.limitRight.style.left = `${game.mapWidth}px`;
        game.limitRight.classList.add("map_lim");
        game.limitRight.id = "map_end";
        game.limitLeft = game.gameSpace.appendChild(document.createElement("div"));
        game.limitLeft.style.left = "0px";
        game.limitLeft.classList.add("map_lim");
        game.limitLeft.id = "map_start";

    },
    drawBackground: () => {
        if (!game.gameSpace.querySelectorAll(".bg-layer").length) {
            bgLayer1 = document.createElement("div");
            bgLayer2 = document.createElement("div");
            bgLayer3 = document.createElement("div");

            game.bgLayers = [bgLayer1, bgLayer2, bgLayer3];
            game.bgLayers.forEach((layer, i) => {
                layer.classList.add("bg-layer", "layer-" + (i + 1));
                layer.style.left = "0px";
                layer.style.width = `${game.mapWidth}px`;
                layer.style.height = `${game.gameSize.y}px`;
            })

            game.gameSpace.appendChild(bgLayer3);
            game.gameSpace.appendChild(bgLayer2);
            game.gameSpace.appendChild(bgLayer1);
        }
    },
    drawMapLayer: (layerName) => {
        game.maps[game.currentMap][layerName]?.forEach((row, y) => {
            row.forEach((t, x) => {
                t !== " " &&
                    game.gameSpace.insertBefore(tile(t, { x, y }, layerName), null);
            });
        });
    },
    drawMapMiddle: () => {
        game.maps[game.currentMap].middle.forEach((row, y) => {
            row.forEach((t, x) => {
                t !== " " && game.drawTile(t, { x, y }, "middle");
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
                    case "c": dropType = "coin"; break;
                    case "b": dropType = ""; break;
                    default: return;
                }
                game.drops.push(
                    new Drop(`${dropType} mapDrop`, {
                        x: pos.x * game.tileWidth,
                        y: pos.y * game.tileHeight,
                    })
                );
                return;
            }
            if (t === "P" && document.querySelector("#player")) return;
            game.gameSpace.appendChild(tile(t, { x: pos.x, y: pos.y }, "wall"));
        } else game.gameSpace.appendChild(tile(t, { x: pos.x, y: pos.y }, depth));
    },
    // Verificar si el juego ha terminado de manera más eficiente
    checkGameOver: () => {
        if (
            game.player?.hearts.quantity <= 0 ||
            parseInt(game.player?.element?.style.top) > game.gameSize.y
        ) game.gameOver = true;

        if (game.gameOver) {
            clearInterval(game.loop);
            game.gameSpace.classList.add("game__over");
        }
    },
    start: () => {
        console.log("- STARTING");
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
        if (game.pause) game.switchPause();
        game.gameSpace.className = "changing";
        setTimeout(() => {
            game.player = new Player();
            game.drops = [];
            game.enemies = [];
            game.gameSpace.innerHTML = "";
            game.gameOver = false;
            game.currentMap = 0;
            window.removeEventListener("keydown", game.handleKeyDown, false);
            window.removeEventListener("keyup", game.handleKeyUp, false);
            game.gameSpace.classList.remove("changing");
            game.start();
        }, 500);
        console.log("- reset completed");
    },
    // pausar el juego
    switchPause: () => {
        game.pause = !game.pause;
        if (game.gameSpace.classList.contains("game__paused")) {
            game.gameSpace.classList.remove("game__paused");
            document.getElementById("game__pause").className = "";
        } else {
            game.gameSpace.classList.add("game__paused");
            document.getElementById("game__pause").className = "game__continue";
        }
        console.log(`- set pause: ${game.pause ? "on" : "off"}`);
    },
    // cambiar de mapa
    checkMapChange: () => {
        if (parseInt(game.player.element.style.left) >= game.gameSize.x - 25) {
            if (game.currentMap < game.maps.length - 1) {
                game.currentMap++;
                game.drawInterface();
                game.drawMap();
                game.player.element.style.left = "-4px";
            } else {
                game.player.element.style.left = `${game.gameSize.x - 26}px`;
            }
        }
        if (parseInt(game.player.element.style.left) < -5) {
            if (game.currentMap > 0) {
                game.currentMap--;
                game.drawInterface();
                game.drawMap();
                game.gameSpace.querySelectorAll("div").forEach((tile) => {
                    tile.style.left =
                        `${parseFloat(tile.style.left) -
                        game.mapWidth +
                        game.gameSize.x}px`;
                })
                game.player.element.style.left = `${game.gameSize.x - 26}px`;
            } else {
                game.player.element.style.left = "-4px";
            }
        }
    },
    addButtonsEvl: () => {
        const resetButton = document.getElementById("game__reset");
        resetButton.addEventListener("click", () => game.reset(), false);
        const pauseButton = document.getElementById("game__pause");
        pauseButton.addEventListener("click", () => game.switchPause(), false);

        console.log("- buttons eventListenaers");
    },
    addJoystick: () => {
        function addMouseToKeyListener(element = HTMLElement.prototype, keys = []) {
            element.addEventListener("pointerdown", () => {
                keys.forEach(key => game.handleKeyDown({ keyCode: key }));
            }, false);
            element.addEventListener("pointerup", () => {
                keys.forEach(key => game.handleKeyUp({ keyCode: key }));
            }, false);
        }

        const joystickLeft = document.createElement("div");
        const joystickRight = document.createElement("div");
        joystickLeft.classList.add("joystick", "jt-left", "hide");
        joystickRight.classList.add("joystick", "jt-right", "hide");

        const dirButtons = [
            //{ "title": "top-left", "keys": [87, 65] },
            //{ "title": "top-right", "keys": [87, 68] },
            { "title": "left", "keys": [65], "img": "left-icon.png" },
            { "title": "+", "keys": [0] },
            { "title": "right", "keys": [68], "img": "right-icon.png" },
        ];

        dirButtons.forEach((b) => {
            const eButton = document.createElement("button");
            eButton.classList.add("jt-button");
            eButton.style.backgroundImage = `url(assets/images/interface/joystick/${b.img})`;
            addMouseToKeyListener(eButton, b.keys);
            joystickLeft.appendChild(eButton);
        });

        const actButtons = [
            { "title": "axe", "keys": [74], "img": "axe-icon.png" },
            { "title": "gun", "keys": [75], "img": "gun-icon.png" },
            { "title": "top", "keys": [87], "img": "up-icon.png" },
        ];

        actButtons.forEach((b) => {
            const eButton = document.createElement("button");
            eButton.classList.add("jt-button");
            eButton.style.backgroundImage = `url(assets/images/interface/joystick/${b.img})`;
            console.log(eButton.style.backgroundImage)
            addMouseToKeyListener(eButton, b.keys);
            joystickRight.appendChild(eButton);
        });

        document.body.appendChild(joystickLeft);
        document.body.appendChild(joystickRight);

        console.log("- joysticks created");
    },
    loadMaps: () => {
        const maps = JSON.parse(localStorage.getItem("maps"));
        if (maps != null) game.maps.concat(maps);
    },
    mapsListed: () => {
        game.cleanMap();
        game.loadMaps();
        game.gameSpace.classList.add("maps__mode");
        const mapsList = document.createElement("div");
        mapsList.classList.add("maps-list");
        game.gameSpace.appendChild(mapsList);
        game.maps.forEach((map) => {
            const mapElement = document.createElement("div");
            mapElement.classList.add("map");
            mapElement.innerText = map.name;
            mapsList.appendChild(mapElement);
        })
        const mapAdder = document.createElement("div");
        mapAdder.className = "map";
        mapAdder.innerText = "+";
        mapAdder.addEventListener("click", (ev) => {
            game.changeScene("editMode")
        }, false);
        mapsList.appendChild(mapAdder);
    },
    moveCamera: () => {
        let { x } = game.player.getRect();
        if (
            (
                (x > game.gameSize.x / 2) &&
                (game.player.vel.x > 1) &&
                (parseFloat(game.limitRight.style.left) > game.gameSize.x)) ||
            (
                (x < game.gameSize.x / 2) &&
                (game.player.vel.x < -1) &&
                (parseFloat(game.limitLeft.style.left) < 0)
            )
        ) {
            game.handleParallax();
            game.gameSpace.querySelectorAll("div").forEach((tile) => {
                tile.style.left = `${parseFloat(tile.style.left) - game.player.vel.x}px`;
            })
        }
    },
    editMode: () => {
        game.cleanMap();
        game.gameSpace.classList.add("edit__mode");
        const layer1 = {
            space: document.createElement("div"),
            selected: false,
            tiles: [],
        };
        const layer2 = {
            space: document.createElement("div"),
            selected: false,
            tiles: [],
        };
        const layer3 = {
            space: document.createElement("div"),
            selected: false,
            tiles: [],
        };
        [layer1, layer2, layer3].forEach((layer, index) => {
            layer.space.className = "edit-layer-" + (index + 1);
            game.gameSpace.appendChild(layer.space)
            for (let col = 0; col < 14; col++) {
                layer.tiles.push([]);
                for (let row = 0; row < 9; row++) {
                    const cell = document.createElement("button");
                    cell.className = "cell-button";
                    layer.tiles[col].push("");
                    layer.space.appendChild(cell);
                }
            }
        });
        console.log("-> open Edit mode");

    },
    switchShowJoysticks: () => {
        game.showJoysticks = !game.showJoysticks;
        const joisticksArr = document.querySelectorAll(".joystick");
        joisticksArr.forEach(jt => {
            !game.showJoysticks
                ? jt.classList.add("hide")
                : jt.classList.remove("hide");
        });
        game.drawPauseMenu();
        console.log(`- set showJoysticks: ${game.showJoysticks ? "on" : "off"}`);
    }
};

