class Drop extends Entity {
    constructor(type = "coin", pos = { x: 0, y: 0 }) {
        super();
        this.type = type;
        this.pos = pos;
        this.timer = 0;
        this.maxSpeed = 10;
        this.createElement();
    }
    update() {
        this.handleGravity();
        this.checkWallCollision();
        //this.floor && this.handleFloat();
        //this.handleVerticalMovement();
    }
    handleFloat() {
        if (this.timer < 40) {
            this.accelerateUp()
        } else if (this.timer < 80) {
            this.accelerateDown();
        }
        this.timer === 80 &&
            (this.timer = 0);
        this.timer++;
    }
    createElement() {
        const element = document.createElement("div");
        element.className = `drop ${this.type}`;
        element.style.top = `${this.pos.y}px`;
        
        element.style.left = `${this.pos.x}px`;
        game.gameSpace.appendChild(element);
        this.element = element;
    }

}
