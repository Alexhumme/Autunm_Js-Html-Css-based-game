class Pumpkin extends Entity {
    constructor() {
        super();
        this.hearts.quantity = 2;
        this.createElement("pumpkin harmful");
    }
    update () {
        this.handleGravity();
        this.checkWallCollision();
        this.checkWeaponCollision();
        this.checkOutOfBounds(game.enemies);
        this.updateHearts();
        this.checkDeath();
    }
}