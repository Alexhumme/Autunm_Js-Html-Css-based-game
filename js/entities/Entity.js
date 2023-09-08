class Entity {
    constructor() {
        this.vel = { x: 0, y: 0 };
        this.idle = true;
        this.floor = true;
        this.floorType = "";
        this.acelerationX = 1.3;
        this.jump = 15;
        this.maxSpeed = 7;
        this.element = HTMLElement.prototype;
        this.weight = 1;
        this.collisions = [];
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
    }

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
            ) { collisionY = dy > 0 ? "top" : "bottom" } else { collisionX = dx > 0 ? "left" : "right" }

            return { element: otherElement, data: { x: collisionX, y: collisionY } };
        } else {
            return false;
        }
    }
    destroy() {
        this.element.remove();
        this.cliffChecker && this.cliffChecker.destroy();
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
                this.element.style.top =
                `${parseFloat(collision.element.style.top) - rect1.height}px`;
                this.floor = true;
            }
            if (collision.data.y === "top" && top) {
                this.floorType = collision.element.className;
                this.element.style.top =
                `${parseFloat(collision.element.style.top) + rect2.height + 1}px`;
                this.vel.y = -this.vel.y / 2;
            }
            if (collision.data.x === "right" && right) {
                this.element.style.left =
                    `${parseFloat(collision.element.style.left) - rect1.width}px`;
                this.autoLeft = true;
            }
            if (collision.data.x === "left" && left) {
                this.element.style.left =
                    `${parseFloat(collision.element.style.left) + rect2.width}px`;
                this.autoLeft = false;
            }
        }else{

        }
    }

    checkWallCollision() {
        const walls = document.querySelectorAll(".wall");
        if (!this.death)  {
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
            this.heartsContainer && this.heartsContainer.remove();
            this.destroy();
            const thisIndex = list.indexOf(this);
            if (thisIndex !== -1) {
                list.splice(thisIndex, 1);
            }
        }
    }
    checkDeath() {
        if (this.hearts.quantity <= 0) {
            this.death = true;
            this.element.classList.remove("harmful");
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
                this.invincibility.active = this.invincibility.max;
                this.element.classList.add("blinking");
                this.hearts.quantity--;
                game.drawInterface();

                this.vel.y -= 10;
                this.vel.x =
                    collision.data.x === "right"
                        ? -5
                        : collision.data.x === "left"
                            ? 5
                            : this.vel.x > 0
                                ? -5
                                : 5;
                this.handleJump()
            }
        }
        if (this.invincibility.active) this.invincibility.active--;
        if (
            !this.invincibility.active &&
            this.element.classList.contains("blinking")
        )
            this.element.classList.remove("blinking");
    }

    handleHorizontalMovement() {
        this.element.style.left = `${parseInt(this.element.style.left) + this.vel.x
            }px`;
    }

    handleJump() {
        if (this.floor || this.fly) {
            this.vel.y = -this.jump;
            this.element.classList.add("jump");
            this.floor = false;
        }
    }
    detectFloor() {
        if (this.floor && this.element.classList.contains("jump")) {
            this.element.classList.remove("jump");
            this.floor = true;
        }
    }
    accelerateLeft() {
        if (this.vel.x > -this.maxSpeed) {
            this.vel.x -= this.acelerationX;
            this.element.classList.remove("right");
            this.element.classList.add("run");
            this.element.classList.add("left");
        }
    }

    accelerateRight() {
        if (this.vel.x < this.maxSpeed) {
            this.vel.x += this.acelerationX;
            this.element.classList.remove("left");
            this.element.classList.add("run");
            this.element.classList.add("right");
        }
    }

    handleGravity() {
        if (this.vel.y < game.fallLimit * this.weight) {
            this.vel.y += game.gravity;
        }
        this.element.style.top = `${parseInt(this.element.style.top) + this.vel.y}px`;
    }

    createElement(className) {
        const element = document.createElement("div");
        element.className = className;
        game.gameSpace.appendChild(element);

        const hearts = document.createElement("div");
        hearts.className = "hearts-mini_container";
        this.heartsContainer = hearts;
        game.gameSpace.appendChild(hearts);

        this.updateHeartsContainer()

        this.element = element;
    }


    checkWeaponCollision() {
        const weapons = document.querySelectorAll(".weapon");
        weapons.forEach((weapon) => {
            this.handleHarm(this.checkCollisionWith(weapon));
            this.updateHeartsContainer();
        });
    }
}
