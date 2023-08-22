class Player extends Entity {
    constructor(weight = 1) {
        super();
        this.weight = weight;
        this.hearts = {
            quantity: 5,
            max: 6,
        };
        this.shoot = {
            active: false,
            duration: 6,
            force: this.maxSpeed,
            counter: 0,
        };
    }

    update() {
        if (game.keys) {
            this.handleJumpAndRun();
            this.handleShooting();
        }

        this.handleFrictionAndStop();
        this.handleHorizontalMovement();
        this.handleGravity();

        this.updateShootStatus();

        const walls = document.querySelectorAll(".wall");
        walls.forEach(wall => {
            this.handleWallCollision(
                this.checkCollisionWith(wall)
            );
        });
        const drops = document.querySelectorAll(".drop");
        drops.forEach(drop => {
            this.handleDropCollision(
                this.checkCollisionWith(drop)
            );
        });
    }

    handleDropCollision(collision = { element: HTMLElement.prototype, data: { x: Number, y: Number } }) {
        if (collision){ 
            collision.element.remove();
        }
    }
    handleJumpAndRun() {
        if (this.floor && this.element.classList.contains("jump")) {
            this.element.classList.remove("jump");
            this.floor = true;
        }

        if (game.keys[65] && this.vel.x > -this.maxSpeed) {
            this.vel.x -= this.acelerationX;
            this.element.classList = "run left";
        }

        if (game.keys[68] && this.vel.x < this.maxSpeed) {
            this.vel.x += this.acelerationX;
            this.element.classList = "run right";
        }

        if (game.keys[87] && this.floor) {
            this.vel.y = -this.jump;
            this.element.classList.add("jump");
            this.floor = false;
        }
    }

    handleShooting() {
        if (game.keys[75] && !this.shoot.active) {
            this.vel.x -= this.shoot.force * (this.element.classList.contains("left") ? -1 : 1);
            this.shoot.active = true;
        }
    }

    handleFrictionAndStop() {
        if (this.element.classList.contains("idle") && this.vel.x != 0) {
            this.vel.x *= game.glide;
        }

        if (this.vel.x < 0.1 && this.vel.x > -0.1) {
            this.vel.x = 0;
        }
    }

    updateShootStatus() {
        if (this.shoot.active) {
            this.shoot.counter += 1;
            if (this.shoot.counter === this.shoot.duration) {
                this.shoot.counter = 0;
                this.shoot.active = false;
            }
        }
        game.info(`shootStatus:${this.shoot.active}`);
    }

}

/*
update() {
    if (game.keys) {
        if (this.floor && this.element.classList.contains("jump")) { this.element.classList.remove("jump") }
        if (game.keys[65] && this.vel.x > -this.maxSpeed) { this.vel.x -= this.acelerationX; this.element.classList = "run left"; }
        if (game.keys[68] && this.vel.x < this.maxSpeed) { this.vel.x += this.acelerationX; this.element.classList = "run right"; }
        if (game.keys[75] && !this.shoot.active) { this.vel.x -= this.shoot.force * (this.element.classList.contains("left") ? -1 : 1); this.shoot.active = true; }
        if (game.keys[87] && this.floor) { this.vel.y = -this.jump; this.element.classList.add("jump") }
    }
    // friccion y detenerse
    if (this.element.classList.contains("idle") && this.vel.x != 0) this.vel.x = this.vel.x * game.glide;
    if (this.vel.x < 0.1 && this.vel.x > -0.1) this.vel.x = 0;
    // movimiento horizontal
    this.element.style.left = `${parseInt(this.element.style.left) + this.vel.x}px`;
    // caer por la gravedad
    if (this.vel.y < game.fallLimit) this.vel.y += game.gravity;
    if (parseInt(this.element.style.top) >= game.gameSize.y - 109) { this.element.style.top = game.gameSize.y - 109 + "px"; this.floor = true }
    else this.floor = false;
    game.infoSpace.innerHTML += ` (${this.element.style.left}, ${this.element.style.top})`
    this.element.style.top = `${parseInt(this.element.style.top) + this.vel.y}px`;


    this.shoot.active && (this.shoot.counter += 1);
    if (this.shoot.counter === this.shoot.duration) { (this.shoot.counter = 0); (this.shoot.active = false); }
    game.infoSpace.innerHTML += (` frame:${this.shoot.active} `)
}
*/