class Axe extends Entity {
    constructor() {
        super();
        this.animation = {
            state : 0,
            maxframes : 8,
        };
        this.state = 0;
        this.pos = {
            x: 0,
            y: 0,
        };
        this.element = false;
    }
    update() {
        //this.updatePosition();
        this.updateState();
    }
    updatePosition() {
        this.element.style.left = `${this.pos.x}px`;
        this.element.style.top = `${this.pos.y}px`;
    }
    updateState() {
        if (this.animation.state) {
            this.element.classList.add(`frame-${this.state}`);
            this.element.classList.remove(`frame-${this.state-1}`);
        } else {
            this.element.className = "weapon axe__element";
        };
    }
    createElememt() {
        this.element = document.createElement("div");
        this.element.className = "weapon axe__element";
        game.player.element.appendChild(this.element);
    }


}