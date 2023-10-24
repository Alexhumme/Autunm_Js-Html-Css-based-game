const tileKeys = [
    { key: "0", class: `ground-solid` },
    { key: "1", class: "ground" },
    { key: "2", class: "item" },
    { key: "3", class: `ground-solid-only` },
    { key: "y", class: "ground-corner-left" },
    { key: "p", class: "ground-corner-right" },
    { key: "?", class: "platform-ground-right" },
    { key: "¿", class: "platform-ground-left" },
    { key: "-", class: "platform-ground" },
    { key: "=", class: "platform-ground-between" },
    { key: "x", class: "platform-ground-pilar-node" },
    { key: "H", class: "platform-pilar-node" },
    { key: "9", class: "platbottom-wall-left-node" },
    { key: "6", class: "platbottom-wall-right-node" },
    { key: "m", class: "bush-small" },
    { key: "w", class: "bush-small-creature" },
    { key: "T", class: "ground-pilar-top" },
    { key: "i", class: "ground-pilar-body" },
    { key: "v", class: "ground-pilar-node" },
    { key: "d", class: "ground-left-top" },
    { key: "f", class: "ground-right-top" },
    { key: "r", class: "ground-wall-right" },
    { key: "l", class: "ground-wall-left" },
    { key: "W", class: "water-top" },
    { key: "s", class: "water-solid" },
    { key: "t", class: "tree" },
];

const tile = (t, pos = { x: 50, y: 50 }, depth) => {
    const newTile = document.createElement("div");
    if (t == "P") {
        if (document.querySelector("#player")) {
            newTile.remove();
            return;
        };
        newTile.setAttribute( "id", "player");
        newTile.classList.add("idle");
    } else {
        newTile.classList.add(
            "tile",
            tileKeys.find((k) => t == k.key).class,
            depth
        );
    }
    newTile.style.left = pos.x * game.tileWidth + "px";
    newTile.style.top = pos.y * game.tileHeight + "px";
    return newTile;
};
