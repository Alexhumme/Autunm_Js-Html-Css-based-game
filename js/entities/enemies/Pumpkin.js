class Pumpkin extends Npc {
    constructor() {
        super();
        this.hearts.max = 1;
        this.hearts.quantity = 1;
        this.maxSpeed = 3;
        this.createElement("pumpkin harmful enemie");
    }
    update () {
        this.handleGravity();
        this.checkWallCollision();
        this.checkWeaponCollision();
        this.checkOutOfBounds(game.enemies, { left: false, right: false});
        this.updatePops();
        this.autoMove();
        this.checkDeath();
    }
}