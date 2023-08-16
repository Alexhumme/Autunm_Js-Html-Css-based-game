const tile = (t, pos = { x: 50, y: 50 }) => {
    const newTile = document.createElement("div");
    switch (t) {
        case "P":
            newTile.setAttribute("id", "player");
            newTile.classList.add("idle");
            //player.pos = pos;
            break;
        case "0": newTile.classList.add("tile", "void"); break;
        case "1": newTile.classList.add("tile", "ground"); break;
        case "2": newTile.classList.add("tile", "item"); break;
        case "y": newTile.classList.add("tile", "ground-corner-right"); break;
        case "p": newTile.classList.add("tile", "ground-corner-left"); break;
        case "?": newTile.classList.add("tile", "platform-ground-right"); break;
        case "'": newTile.classList.add("tile", "platform-ground-left"); break;
        case "-": newTile.classList.add("tile", "platform-ground"); break;
        case "=": newTile.classList.add("tile", "platform-ground-between"); break;
        case "m": newTile.classList.add("tile", "bush-small"); break;
        case "w": newTile.classList.add("tile", "bush-small-creature"); break;
        default: break;
    };
    newTile.style.left = pos.x * config.tileWidth + "px";
    newTile.style.top = pos.y * config.tileHeight + "px";
    return newTile;
};