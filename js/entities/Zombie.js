class Zombie extends Entity {
    constructor() {
      super();
      this.hearts.quantity = 3;
      this.atk = 1;
      this.acelerationX = 0.1;
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
      this.checkDeath();
    }
  
    followPlayer() {
      const playerPos = {
        x: game.player.element.getBoundingClientRect().x,
        y: game.player.element.getBoundingClientRect().y,
      };
      const thisPos = {
        x: this.element.getBoundingClientRect().x,
        y: this.element.getBoundingClientRect().y,
      };
  
      this.detectFloor();
      if (thisPos.x < playerPos.x) this.accelerateRight();
      if (thisPos.x > playerPos.x) this.accelerateLeft();
      if (thisPos.y > playerPos.y && Math.abs(thisPos.x - playerPos.x) < 220) {
        this.handleJump();
      }
    }
  }
  