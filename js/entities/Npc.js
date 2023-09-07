class Npc extends Entity {
    constructor () {
        super();
        this.autoLeft = false;
    }
    autoMove() {
        if (this.autoLeft) this.accelerateLeft();
        else this.accelerateRight();
        this.handleHorizontalMovement();
        //this.moveCliffChecker();
        this.checkCliff();
    }
    checkCliff() {
        if(this.floor){
            if(
                this.floorType.includes("ground-corner-left") ||
                this.floorType.includes("platform-ground-left") ||
                parseInt(this.element.style.left) <= 0
                 ){
                this.autoLeft = false;
            } else if (
                this.floorType.includes("ground-corner-right") ||
                this.floorType.includes("platform-ground-right") ||
                this.element.getBoundingClientRect().left >= game.gameSize.x
                 ){
                this.autoLeft = true;
            }
        }
    }
    updateHeartsContainer() {
        this.heartsContainer.innerHTML = "";
        for (let heartN = 0; heartN < this.hearts.quantity; heartN++) {
            this.heartsContainer.appendChild(document.createElement("div"));
        }
    }
    updateHearts() {
        this.heartsContainer.style.top = `${parseInt(this.element.style.top) -
            this.heartsContainer.getBoundingClientRect().height
            }px`;
        this.heartsContainer.style.left = `${parseInt(this.element.style.left) -
            this.heartsContainer.getBoundingClientRect().width / 2 +
            this.element.getBoundingClientRect().width / 2
            }px`;
    }
}