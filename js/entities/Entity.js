class Entity {
    constructor() {
        this.vel = { x: 0, y: 0 };
        this.idle = true;
        this.floor = true;
        this.acelerationX = 1.3;
        this.jump = 15;
        this.maxSpeed = 4;
        this.element = HTMLElement.prototype;
        this.weight = 1;
        this.lives = 3;
        this.maxVives = 3;
    }

    handleWallCollision(collision) {
        if (collision) {
            const rect1 = this.element.getBoundingClientRect();
            const rect2 = collision.element.getBoundingClientRect();
            if (collision.data.y === "bottom") {
                this.element.style.top = `${parseInt(collision.element.style.top) - rect1.height}px`
                this.floor = true;
            }
            /*
            if (collision.data.x === "right"){
                this.element.style.left = `${parseInt(collision.wall.style.left)-rect1.width}px`
            }
            if (collision.data.x === "left"){
                this.element.style.left = `${parseInt(collision.wall.style.left)+rect2.width}px`
            }
            */
        }
    }

    handleHorizontalMovement() {
        this.element.style.left = `${parseInt(this.element.style.left) + this.vel.x}px`;
    }

    handleGravity() {
        if (this.vel.y < game.fallLimit * this.weight) {
            this.vel.y += game.gravity;
        }

        this.element.style.top = `${parseInt(this.element.style.top) + this.vel.y}px`;
    }

    checkCollisionWith(otherElement) {
        const rect1 = this.element.getBoundingClientRect();
        const rect2 = otherElement.getBoundingClientRect();

        const dx = (rect1.left + rect1.width / 2) - (rect2.left + rect2.width / 2);
        const dy = (rect1.top + rect1.height / 2) - (rect2.top + rect2.height / 2);
        const width = (rect1.width + rect2.width) / 2;
        const height = (rect1.height + rect2.height) / 2;

        let collisionX = '';
        let collisionY = '';

        const xOverlap = width - Math.abs(dx);
        const yOverlap = height - Math.abs(dy);

        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {

            if (xOverlap > yOverlap) {
                collisionY = dy > 0 ? 'top' : 'bottom';
            } else {
                collisionX = dx > 0 ? 'left' : 'right';
            }

            return { element: otherElement, data: { x: collisionX, y: collisionY } };
        } else {
            return false;
        }
    }
}
