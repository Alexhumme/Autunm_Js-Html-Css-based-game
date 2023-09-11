class Player extends Entity {
    constructor(weight = 1) {
        super();
        this.acceleration = 5.5;
        this.weight = weight;
        this.hearts = {
            quantity: 6,
            max: 6,
        };
        this.invincibility.max = 25;
        this.maxSpeed = 7;
        this.shoot = {
            active: false,
            duration: 5,
            force: this.acceleration,
            counter: 0,
            bullets: {
                actives: [],
                quantity: 1000
            }
        };
        this.axeAttack = {
            state: 0,
            maxFrames: 8,
            axe: new Axe(),
        }
        this.slots = {
            slot1: { item: null, amount: 0 },
            slot2: { item: null, amount: 0 },
            slot3: { item: null, amount: 0 },
            slot4: { item: null, amount: 0 },
        }
    }

    update() {
        if (game.keys) {
            this.handleJumpAndRun();
            this.handleShooting();
            this.handleAxeAttack();
        }

        this.handleFrictionAndStop();
        this.handleHorizontalMovement();
        this.handleGravity();

        this.updateShootStatus();

        this.checkWallCollision();
        this.checkDropCollision();
        this.checkHarmfulCollision();
    }

    checkDropCollision() {
        const drops = document.querySelectorAll(".drop");
        drops.forEach(drop => {
            this.handleDropCollision(
                this.checkCollisionWith(drop)
            );
        });
    }
    checkHarmfulCollision() {
        const harms = document.querySelectorAll(".harmful");
        harms.forEach(harm => {
            this.handleHarm(
                this.checkCollisionWith(harm)
            );
        })
    }

    handleDropCollision(collision = { element: HTMLElement.prototype, data: { x: Number, y: Number } }) {
        if (collision) {
            collision.element.remove();
        }
    }

    handleJumpAndRun() {
        this.detectFloor();
        if (game.keys[65]) this.accelerateLeft();
        if (game.keys[68]) this.accelerateRight();
        if (game.keys[87]) this.handleJump();
    }


    handleShooting() {
        if (game.keys[75] && !this.shoot.active && this.shoot.bullets.quantity && !this.axeAttack.state) {
            this.vel.x -= this.shoot.force * (this.element.classList.contains("left") ? -1 : 1);
            this.shoot.active = true;
            this.element.classList.add("shooting");
            const newBullet = new Bullet(
                {
                    x: parseInt(this.element.style.left)
                        + (this.element.classList.contains("left")
                            ? this.element.getBoundingClientRect().width
                            : 0),
                    y: parseInt(this.element.style.top) + this.element.getBoundingClientRect().height / 2
                },
                this.element.classList.contains("left") ?
                    -1 : 1
            );
            this.shoot.bullets.actives.push(
                newBullet
            );
            this.shoot.bullets.quantity--;
            game.drawInterface();
        }
    }
    handleAxeAttack() {
        if (this.axeAttack.state == this.axeAttack.maxFrames) {
            this.axeAttack.state = 0;
            this.element.classList.remove(`attack-1-frame-${this.axeAttack.maxFrames}`);
        };
        if ((game.keys[74] && !this.axeAttack.state) || this.axeAttack.state) {
            if (!this.axeAttack.axe.element) this.axeAttack.axe.createElememt();
            this.axeAttack.state++;
            this.axeAttack.axe.animation.state = this.axeAttack.state;
            this.axeAttack.axe.pos.x = parseInt(this.element.style.left);
            this.axeAttack.axe.pos.y = parseInt(this.element.style.top);
            this.axeAttack.axe.update();
        }
        if (this.axeAttack.state) {
            this.element.classList.remove(`attack-1-frame-${this.axeAttack.state - 1}`)
            this.element.classList.add(`attack-1-frame-${this.axeAttack.state}`);
        };
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
        if (!game.keys[75] || !this.shoot.bullets) this.element.classList.remove("shooting");
        if (this.shoot.active) {
            this.shoot.counter += 1;
            if (this.shoot.counter === this.shoot.duration) {
                this.shoot.counter = 0;
                this.shoot.active = false;
            }
        }
    }
}
