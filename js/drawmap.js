const drawMap = (map) => {
    map.middleground.forEach((row, y) => {
        row.forEach((t, x) => {
            t !== " " &&
            document
                .getElementById("game__container")
                .insertBefore(
                    tile(t, { x: x, y: y }),
                    null);
        });
    });
    map.walls.forEach((row, y) => {
        row.forEach((t, x) => {
            t !== " " &&
            document
                .getElementById("game__container")
                .insertBefore(
                    tile(t, { x: x, y: y }),
                    null);
        });
    });
};
