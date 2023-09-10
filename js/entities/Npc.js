class Npc extends Entity {
    constructor() {
        super();
        this.autoLeft = false;
    }
    autoMove() {
        if (this.autoLeft) this.accelerateLeft();
        else this.accelerateRight();
        this.handleHorizontalMovement();
        this.checkCliff();
    }
    followPlayer() {
        // moverse horizontalmente
        if (
            parseInt(this.element.getBoundingClientRect().left) <
            parseInt(game.player.element.getBoundingClientRect().left)
        )
            this.accelerateRight();
        else this.accelerateLeft();
        this.handleHorizontalMovement();
        // moverse verticalmente
        if (
            parseInt(this.element.style.top) > parseInt(game.player.element.style.top)
        ) {
            if (this.fly) this.accelerateUp();
            else this.handleJump();
        } else if (this.fly) this.accelerateDown();
        if (this.fly) this.handleVerticalMovement();

        // saltar en los acantilados
        this.checkCliff(true);
    }
    checkCloseToPlayer() {
        const myRect = this.element.getBoundingClientRect();
        const playerRect = game.player.element.getBoundingClientRect();
        return (
            Math.abs(myRect.left) - Math.abs(playerRect.left) < 200 &&
            Math.abs(myRect.top) - Math.abs(playerRect.top) < 200
        );
    }
    checkCliff(jump = false) {
        if (this.floor) {
            if (
                this.floorType.includes("ground-corner-left") ||
                this.floorType.includes("platform-ground-left") ||
                parseInt(this.element.style.left) <= 0
            ) {
                if (!jump) this.autoLeft = false;
                else this.handleJump();
            } else if (
                this.floorType.includes("ground-corner-right") ||
                this.floorType.includes("platform-ground-right") ||
                this.element.getBoundingClientRect().left >= game.gameSize.x
            ) {
                if (!jump) this.autoLeft = true;
                else this.handleJump();
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
