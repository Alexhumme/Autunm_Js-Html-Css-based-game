class Drop extends Entity {
    constructor(weight = 1, type = 0, pos = { x: 0, y: 0 }) {
        super();
        this.weight = weight;
        this.type = type;
        this.pos = pos;
        this.floor = false;
        this.timer = 0;
        this.fading = false;
    }
    update() {
        this.handleGravity();
        const walls = document.querySelectorAll(".wall");

        walls.forEach(wall => {
            this.handleWallCollision(
                this.checkCollisionWith(wall)
            );
        });
        this.handleFade()
    }
    handleFade() {
        this.timer > (game.dropSpan.rate) * (game.dropSpan.limit - 1) && !this.fading ?
            (this.fading = true && this.element.classList.add("blinking")) :
            this.timer++
    }
    createElement() {
        const element = document.createElement("div");
        element.classList.add("drop", this.type);
        element.style.top = `${this.pos.y}px`;
        element.style.left = `${this.pos.x}px`;
        game.gameSpace.insertBefore(element, null);
        this.element = element;
    }
    destroy() {
        this.element.remove()
    }
}
