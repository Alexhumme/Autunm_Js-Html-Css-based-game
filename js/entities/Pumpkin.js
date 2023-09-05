class Pumpkin extends Npc {
    constructor() {
        super();
        this.hearts.quantity = 4;
        this.maxSpeed = 3
        this.createElement("pumpkin harmful");
    }
    update () {
        this.handleGravity();
        if (!this.death) this.checkWallCollision();
        this.checkWeaponCollision();
        this.checkOutOfBounds(game.enemies);
        this.updateHearts();
        this.autoMove();
        this.checkDeath();
    }
}