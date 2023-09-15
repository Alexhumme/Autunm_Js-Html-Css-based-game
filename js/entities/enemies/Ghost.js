class Ghost extends Npc {
    constructor() {
        super();
        this.hearts.quantity = 3;
        this.maxSpeed = 1;
        this.createElement("ghost harmful enemie");
        this.invincibility.max = 5;
        this.fly = true;
        this.weight = 0.5
    }
    update () {
        if (this.death) this.handleGravity();
        this.checkWeaponCollision();
        this.checkOutOfBounds(game.enemies);
        this.updatePops();
        if (this.checkCloseToPlayer()) this.followPlayer()
        this.checkDeath();

    }
}