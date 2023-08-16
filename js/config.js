const config = {
    fps: 25,
    frameRate: 0,
    currentSec: 0,
    loop: null,
    gameSize: { x: 700, y: 400 },
    tileWidth: 50,
    tileHeight: 50,
    gravity: 3,
    fallLimit: 8,
    glide: 0.6,
    keys: [],
    player: {
        vel: { x: 0, y: 0 },
        idle: true,
        floor: true,
        acelerationX: 1.3,
        jump: 15,
        speedLimit: 10,
        element: HTMLElement.prototype,
        move() {
            if (config.keys) {
                if (config.keys[65] && this.vel.x > -this.speedLimit) { this.vel.x -= this.acelerationX; this.element.classList = "run left"; }
                if (config.keys[68] && this.vel.x < this.speedLimit) { this.vel.x += this.acelerationX; this.element.classList = "run right"; }
                if (config.keys[87] && this.floor) { this.vel.y = -this.jump }
            }
            // friccion y detenerse
            if (this.element.classList.contains("idle") && this.vel.x != 0) this.vel.x = this.vel.x*config.glide;
            if (this.vel.x < 0.1 && this.vel.x > -0.1) this.vel.x = 0;
            // movimiento horizontal
            this.element.style.left = `${parseInt(this.element.style.left) + this.vel.x}px`;
            // caer por la gravedad
            if (this.vel.y < config.fallLimit) this.vel.y += config.gravity;
            if (parseInt(this.element.style.top) >= config.gameSize.y-109) {this.element.style.top = config.gameSize.y-109 + "px"; this.floor = true} 
            else this.floor = false;
            this.element.style.top = `${parseInt(this.element.style.top) + this.vel.y}px`;
        }
    }
}
