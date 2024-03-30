class Entity {
    constructor() {
        this.vel = { x: 0, y: 0 };
        this.idle = true;
        this.floor = true;
        this.floorType = "";
        this.acceleration = 0.5;
        this.jump = 15;
        this.maxSpeed = 7;
        this.element = HTMLElement.prototype;
        this.noParticles = false;
        this.weight = 1;
        this.collisions = [];
        this.pops = [];
        this.particles = [];
        this.hearts = {
            quantity: 2,
            max: 2,
        };
        this.death = false;
        this.slots = {
            slot1: { item: null, amount: 0 },
        };
        this.invincibility = {
            active: 0,
            max: 10,
        };
        this.fly = false;
        this.dir = 1;
        this.deathState = 0;
    }
    getRect(element = false) { // obtener un rect cuya posicion es relativa a la de la ventana del juego
        let { x, y, width, height } =
            element != false
                ? element.getBoundingClientRect()
                : this.element.getBoundingClientRect();
        let rPos = {
            ...{ width, height },
            x: x - game.gameSpace.getBoundingClientRect().x,
            y: y - game.gameSpace.getBoundingClientRect().y,
        };
        return rPos
    }
    onDeath() { }
    checkCollisionWith(otherElement) {
        const rect1 = this.element.getBoundingClientRect();
        const rect2 = otherElement.getBoundingClientRect();

        const dx = rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2);
        const dy = rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2);
        const width = (rect1.width + rect2.width) / 2;
        const height = (rect1.height + rect2.height) / 2;

        let collisionX = "";
        let collisionY = "";

        const xOverlap = width - Math.abs(dx);
        const yOverlap = height - Math.abs(dy);

        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
            if (
                xOverlap >=
                yOverlap - 13 // se restan 20 a overlap para corregir la deteccion supersencible de colisiones left
            ) {
                collisionY = dy > 0 ? "top" : "bottom";
            } else {
                collisionX = dx > 0 ? "left" : "right";
            }

            return { element: otherElement, data: { x: collisionX, y: collisionY } };
        } else {
            return false;
        }
    }
    destroy() {
        this.particles.forEach((particle) => {
            particle.element.remove();
            particle.retireList(this.particles);
        });
        this.element.remove();
        delete this;
    }

    handleWallCollision(
        collision = { element: HTMLElement.prototype },
        { right = true, left = true, top = true, bottom = true }
    ) {
        if (collision) {
            const rect1 = this.element.getBoundingClientRect();
            const rect2 = collision.element.getBoundingClientRect();
            if (collision.data.y === "bottom" && bottom) {
                this.floorType = collision.element.className;
                this.element.style.top = `${parseFloat(collision.element.style.top) - rect1.height
                    }px`;
                this.floor = true;
            }
            if (collision.data.y === "top" && top) {
                this.floorType = collision.element.className;
                this.element.style.top = `${parseFloat(collision.element.style.top) + rect2.height
                    }px`;
                this.vel.y = -this.vel.y / 2;
            }
            if (collision.data.x === "right" && right) {
                this.element.style.left = `${parseFloat(collision.element.style.left) - rect1.width
                    }px`;
                this.autoLeft = true;
            }
            if (collision.data.x === "left" && left) {
                this.element.style.left = `${parseFloat(collision.element.style.left) + rect2.width
                    }px`;
                this.autoLeft = false;
            }
        } else {
        }
    }

    checkWallCollision() {
        const walls = document.querySelectorAll(".wall");
        if (!this.death) {
            walls.forEach((wall) => {
                this.handleWallCollision(this.checkCollisionWith(wall), {
                    top: true,
                    left: true,
                    right: true,
                    bottom: true,
                });
            });
        }
    }

    checkOutOfBounds(list, { left = true, right = true, bottom = true}) {
        const gameSize = game.gameSize;
        const { x, y, width } = this.getRect();
        if (
            (right && parseInt(x) > parseInt(gameSize.x) + width) ||
            (left && parseInt(x) < -width * 2) ||
            (bottom && parseInt(y) > parseInt(gameSize.y))
        ) {
            this.particles.forEach((particle) => {
                particle.destroy();
            });
            this.heartsContainer && this.heartsContainer.remove();
            this.destroy();
            this.retireList(list);
        }
    }

    checkDeath() {
        if (this.hearts.quantity <= 0) {
            this.death = true;
            this.element.classList.remove("harmful");
            this.pops = [];
            this.onDeath();
        }
    }

    retireList(list) {
        const thisIndex = list.indexOf(this);
        if (thisIndex !== -1) {
            list.splice(thisIndex, 1);
        }
    }

    handleHarm(
        collision = {
            element: HTMLElement.prototype,
            data: { x: String, y: String },
        }
    ) {
        if (collision) {
            if (!this.invincibility.active) {
                this.popMessage({ text: "", types: "broken-heart" });
                this.bleed(collision.data.x === "left" ? 1 : -1);
                this.invincibility.active = this.invincibility.max;
                this.element.classList.add("blinking");
                this.hearts.quantity--;
                game.drawInterface();

                this.vel.x =
                    collision.data.x === "right"
                        ? -7
                        : collision.data.x === "left"
                            ? 7
                            : this.vel.x > 0
                                ? -7
                                : 7;
                if (!this.fly) {
                    this.vel.y -= 10;
                    this.handleJump();
                }
            }
        }
        if (this.invincibility.active) this.invincibility.active--;
        if (!this.invincibility.active) this.element.classList.remove("blinking");
    }

    handleHorizontalMovement() {
        this.element.style.left = `${parseInt(this.element.style.left) + this.vel.x
            }px`;
        //!this.fly &&
        this.updateParticles();
    }
    handleVerticalMovement() {
        this.element.style.top = `${parseInt(this.element.style.top) + this.vel.y
            }px`;
    }

    handleJump() {
        if (this.floor || this.fly) {
            if (!this.fly && !this.noParticles) for (let i = 0; i < 6; i++) this.createJumpDust();
            this.vel.y = -this.jump;
            this.element.classList.add("jump");
            this.floor = false;
        }
    }
    detectFloor() {
        if (
            this.floor &&
            this.element.classList.contains("jump")
        ) {

            this.element.classList.remove("jump");
            this.element.classList.remove("fall");
            for (let i = 0; i < 6; i++) this.createLandingDust();
            this.floor = true;
        }
    }
    accelerateLeft() {
        if (this.vel.x > -this.maxSpeed) {
            //if (this.floor && !this.noParticles) this.createDust();
            this.vel.x -= this.acceleration;
            this.element.classList.remove("right");
            this.element.classList.add("run");
            this.element.classList.add("left");
            this.dir = -1;
        }
    }

    accelerateRight() {
        if (this.vel.x < this.maxSpeed) {
            //if (this.floor && !this.noParticles) this.createDust();
            this.vel.x += this.acceleration;
            this.element.classList.remove("left");
            this.element.classList.add("run");
            this.element.classList.add("right");
            this.dir = 1;
        }
    }

    accelerateUp() {
        if (this.vel.y > -this.maxSpeed) {
            this.vel.y -= this.acceleration;
        }
    }

    accelerateDown() {
        if (this.vel.y < this.maxSpeed) {
            this.vel.y += this.acceleration;
        }
    }
    handleFalling() {
        if (this.vel.y > 0 && !this.floor) {
            this.element.classList.add("fall");
        }
    }
    handleGravity() {
        if (this.vel.y < game.fallLimit * this.weight) {
            this.vel.y += game.gravity;
        }
        this.element.style.top = `${parseInt(this.element.style.top) + this.vel.y
            }px`;
        this.handleFalling();
    }

    createElement(className) {
        const element = document.createElement("div");
        element.className = className;
        game.gameSpace.appendChild(element);
        this.element = element;
        this.drawHearts();
        this.updateHeartsContainer();
    }

    drawHearts() {
        const hearts = document.createElement("div");
        hearts.className = "hearts-mini_container";
        this.element.appendChild(hearts);
        this.heartsContainer = hearts;
    }

    updateHeartsContainer() {
        this.heartsContainer.innerHTML = "";
        for (let heartN = 0; heartN < this.hearts.quantity; heartN++) {
            this.heartsContainer.appendChild(document.createElement("div"));
        }
    }

    checkWeaponCollision() {
        const weapons = document.querySelectorAll(".weapon");
        weapons.forEach((weapon) => {
            this.handleHarm(this.checkCollisionWith(weapon));
            this.updateHeartsContainer();
        });
    }

    handleFrictionAndStop() {
        if (this.element.classList.contains("idle") && this.vel.x != 0) {
            this.vel.x *= game.glide;
        }

        if (this.vel.x < 0.1 && this.vel.x > -0.1) {
            this.vel.x = 0;
        }
    }

    popMessage({ text = "", types = "" }) {
        const newPop = new Pop({ text: text, type: types });
        newPop.createElementIn(this.element);
        newPop.list = this.pops;
        this.pops.push(newPop);
    }

    updatePops() {
        this.pops.forEach((pop) => {
            pop.update();
        });
    }

    createParticle({ yModifier = 0, xModifier = 0, xRandomModifier = 0, yRandomModifier = 0, yDirection = 0, xDirection = 0, duration = 10 }) {
        const newParticle = new DustParticle();
        newParticle.counter = duration;
        newParticle.createElementIn(game.gameSpace);

        const y = this.getRect().y + this.getRect().height * yModifier + Math.random() * yRandomModifier;
        const x = this.getRect().x + this.getRect().width * xModifier + Math.random() * xRandomModifier;

        newParticle.element.style.top = `${y}px`;
        newParticle.element.style.left = `${x}px`;

        newParticle.dir.y = yDirection;
        newParticle.dir.x = xDirection;
        newParticle.list = this.particles;
        this.particles.push(newParticle);
    }

    createJumpDust() {
        const { width, height } = this.getRect();
        this.createParticle({ yModifier: 0.5, xRandomModifier: width, yRandomModifier: height / 2, yDirection: -0.5, duration: 20 });
    }

    createDashDust() {
        const xDirection = Math.random() * this.vel.x < 0 ? 8 : -8;
        const xModifier = Math.random() * this.vel.x < 0 ? 1.5 : -0.5;
        this.createParticle({ xModifier, yRandomModifier: this.getRect().height - 5, xDirection, duration: 5 });
    }

    createLandingDust() {
        const yDirection = Math.random() * -2;
        const xModifier = Math.random() > 0.5 ? 1 : 0;
        const xDirection = Math.random() * (xModifier == 0 ? -2 : 2);
        this.createParticle({ yModifier: 1, xRandomModifier: 10, xModifier, yDirection, xDirection });
    }

    createRunDust() {
        this.createParticle({ yModifier: 0.8, xModifier: -0.2, xRandomModifier: 0 });
    }

    updateParticles() {
        this.particles.forEach((particle) => {
            particle.update();
        });
    }

    bleed(dir) {
        for (let i = 0; i < 2; i++) {
            const bloodDrop = new BloodParticle();

            bloodDrop.dir.x = Math.random() * 5 * dir;

            bloodDrop.createElementIn(game.gameSpace);

            bloodDrop.element.style.top = `${parseInt(this.element.style.top) +
                this.element.getBoundingClientRect().height / 2
                }px`;

            bloodDrop.element.style.left =
                this.vel.x < 0
                    ? `${parseInt(this.element.style.left) +
                    this.element.getBoundingClientRect().width
                    }px`
                    : this.element.style.left;

            bloodDrop.list = this.particles;

            this.particles.push(bloodDrop);
        }
    }
}
