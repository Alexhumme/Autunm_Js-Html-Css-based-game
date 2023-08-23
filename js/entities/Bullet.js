class Bullet extends Entity {
    constructor(pos, dir) {
        super();
        this.weight = 0.0;
        this.pos = pos;
        this.maxSpeed = 30;
        this.vel = { x: 30 * dir, y: 0 };
        this.hits = 2
    }
    update() {
        //this.vel.x = 20;
        this.handleHorizontalMovement();
        this.handleGravity();

        game.info("hola")
        const walls = document.querySelectorAll(".wall");
        walls.forEach(wall => {
            this.checkCollisionWith(wall) && this.destroy();
        });
    }
    createElement() {
        this.element = document.createElement("div");
        this.element.className = "bullet";
        game.gameSpace.insertBefore(this.element, null);
        this.element.style.left = `${this.pos.x}px`;
        this.element.style.top = `${this.pos.y}px`;

    }
}