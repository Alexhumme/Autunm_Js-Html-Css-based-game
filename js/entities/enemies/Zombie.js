class Zombie extends Npc {
    constructor() {
      super();
      this.hearts.quantity = 3;
      this.atk = 1;
      this.acceleration = 0.1;
      this.maxSpeed = Math.random() * 10 + 2;
      this.invincibility.max = 5;
      this.jump = 22;
      this.createElement("zombie harmful");
    }
    update() {
      this.handleGravity();
      this.checkWallCollision();
      this.handleHorizontalMovement();
      this.followPlayer();
      this.checkWeaponCollision();
      this.checkOutOfBounds(game.zombies);
      this.updateHearts();
      this.updatePops();
      this.checkDeath();
    }
  
  }
  