class GreenPumpkin extends Npc {
    constructor() {
        super();
        this.hearts.quantity = 2;
        this.maxSpeed = 4;
        this.acceleration = 0.5;
        this.jump = 20;
        this.createElement("green-pumpkin harmful enemie");
        this.fly = false;
    }
    update () {
        this.handleGravity();
        this.checkWallCollision();
        this.checkWeaponCollision();
        this.checkOutOfBounds(game.enemies, { left: false, right: false});
        this.updatePops();
        if (this.checkCloseToPlayer()) this.followPlayer()
        else this.autoMove();
        this.checkDeath();
    }
}