class Pumpkin extends Entity {
    constructor() {
        super();
        this.hearts.quantity = 1;
        this.maxSpeed = 3
        this.createElement("pumpkin harmful");
        //this.createCliffChecker();
    }
    update () {
        this.handleGravity();
        this.checkWallCollision();
        this.checkWeaponCollision();
        this.checkOutOfBounds(game.enemies);
        this.updateHearts();
        this.autoMove();
        this.checkDeath();
    }
}