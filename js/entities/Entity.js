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
        this.noParticles = true;
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

    onDeath() { }
    checkCollisionWith(otherElement) {
        /*
        const rect1 = this.element.getBoundingClientRect();
        const rect2 = otherElement.getBoundingClientRect();

        const dx = rect1.left + rect1.width / 2 - (rect2.left + rect2.width / 2);
        const dy = rect1.top + rect1.height / 2 - (rect2.top + rect2.height / 2);
        const width = (rect1.width + rect2.width) / 2;
        const height = (rect1.height + rect2.height) / 2;
        */
        const rect1 = this.element.style;
        const rect2 = otherElement.style;

        const dx = parseFloat(rect1.left) + parseFloat(rect1.width) / 2 - (parseFloat(rect2.left) + parseFloat(rect2.width) / 2);
        const dy = parseFloat(rect1.top) + parseFloat(rect1.height) / 2 - (parseFloat(rect2.top) + parseFloat(rect2.height) / 2);
        const width = (parseFloat(rect1.width) + parseFloat(rect2.width)) / 2;
        const height = (parseFloat(rect1.height) + parseFloat(rect2.height)) / 2;

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
                this.element.style.top = `${parseFloat(collision.element.style.top) + rect2.height + 1
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

    checkOutOfBounds(list) {
        const gameSize = game.gameSize;
        if (
            parseInt(this.element.style.left) >
            parseInt(gameSize.x) + this.element.getBoundingClientRect() ||
            parseInt(this.element.style.left) <
            -this.element.getBoundingClientRect().width * 2 ||
            parseInt(this.element.style.top) > parseInt(gameSize.y)
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
            (this.element.classList.contains("jump") ||
                this.element.classList.contains("jump"))
        ) {
            this.element.classList.remove("jump");
            this.element.classList.remove("fall");
            this.floor = true;
        }
    }
    accelerateLeft() {
        if (this.vel.x > -this.maxSpeed) {
            if (this.floor && !this.noParticles) this.createDust();
            this.vel.x -= this.acceleration;
            this.element.classList.remove("right");
            this.element.classList.add("run");
            this.element.classList.add("left");
            this.dir = -1;
        }
    }

    accelerateRight() {
        if (this.vel.x < this.maxSpeed) {
            if (this.floor && !this.noParticles) this.createDust();
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

    createJumpDust() { 
        const newParticle = new DustParticle();
        newParticle.createElementIn(game.gameSpace);

        newParticle.element.style.top = `${parseFloat(this.element.style.top) +
            this.element.getBoundingClientRect().height/2 +
            this.element.getBoundingClientRect().height/2 * Math.random()
            }px`;

        newParticle.element.style.left =
                `${parseFloat(this.element.style.left) +
                this.element.getBoundingClientRect().width * Math.random()
                }px`;

        newParticle.list = this.particles;
        this.particles.push(newParticle);
    }

    createDust() {
        const newParticle = new DustParticle();
        newParticle.createElementIn(game.gameSpace);

        newParticle.element.style.top = `${parseInt(this.element.style.top) +
            this.element.getBoundingClientRect().height -
            newParticle.element.getBoundingClientRect().height
            }px`;

        newParticle.element.style.left =
            this.vel.x < 0
                ? `${parseInt(this.element.style.left) +
                this.element.getBoundingClientRect().width
                }px`
                : this.element.style.left;

        newParticle.list = this.particles;
        this.particles.push(newParticle);
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
