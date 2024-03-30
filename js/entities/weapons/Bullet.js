class Bullet extends Entity {
    constructor(pos, dir) {
        super();
        this.weight = 0.0;
        this.pos = pos;
        this.maxSpeed = 30;
        this.vel = { x: 30 * dir, y: 0 };
        this.hits = 2;
        this.dying = 0;
        this.createElement();
    }
    
    update() {
        this.handleHorizontalMovement();
        this.handleGravity();
        this.checkWallCollisions();
        this.checkOutOfBounds(game.player.shoot.bullets.actives, {});
        if (!this.dying) for (let i = 0; i < 3; i++) this.createDashDust();
    }

    checkWallCollisions() {
        const walls = document.querySelectorAll(".wall");
        walls.forEach((wall) => {
            if (this.checkCollisionWith(wall)) {
                this.handleWallCollision();
            }
        });
        const enemies = document.querySelectorAll(".enemie");
        enemies.forEach((enemie) => {
            if (this.checkCollisionWith(enemie)) {
                this.handleWallCollision();
            }
        });
    }

    handleWallCollision() {
        if (this.dying === 100) {
            this.element.classList.add("blinking", "broken");
            this.element.classList.remove("weapon")
            this.weight = 2;
            this.vel.x *= -0.2;
            this.vel.y -= 20;
            this.dying -= 1;
        } else if (!this.dying) {
            this.dying = 100;
        }
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add(
            "bullet",
            this.vel.x < 0 ? "left" : "right",
            "weapon"
        );
        game.gameSpace.appendChild(this.element);
        this.element.style.left = `${this.pos.x}px`;
        this.element.style.top = `${this.pos.y}px`;
    }
}
