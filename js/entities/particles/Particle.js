class Particle {
    constructor(
        mainClass,
        pos = {
            y: {
                rand: false,
                top: false,
                middle: false,
                bottom: false,
            },
            x: {
                rand: false,
                left: false,
                center: false,
                right: false,
            },
        }
    ) {
        this.list = [];
        this.dir = { x: 0, y: -2 };
        this.pos = pos;
        this.counter = 10;
        this.mainClass = mainClass;
        this.speed = 2;
        this.text = "";
    }
    update() {
        if (this.counter) {
            this.handleFade();
        } else {
            this.destroy();
            this.retireList(this.list);
        }
    }
    createElementIn(
        parent = HTMLElement.prototype,
    ) {
        const element = document.createElement("span");
        // posiscion vertical
        if (this.pos.y.top) element.style.top = "0px";
        else if (this.pos.y.bottom) {
            element.style.top = "auto";
            element.style.bottom = "0px";
        };
        (this.pos.y.rand)
            ? element.style.top = `${Math.floor(Math.random() * 45)}px`
            : element.style.top = `10px`;
        // posicion horizontal
        if (this.pos.x.right) element.style.left = "45px";
        else if (this.pos.x.left) {
            element.style.left = "0px";
        };
        (this.pos.x.rand)
            ? element.style.left = `${Math.floor(Math.random() * 45)}px`
            : element.style.left = `10px`;

        element.style.opacity = "1";

        element.className = `${this.mainClass} ${this.classNames}`;
        element.innerText = this.text;
        element.style.color = this.color;
        parent.appendChild(element);
        this.element = element;
    }
    handleFade() {
        this.counter--;
        this.element.style.top = `${parseInt(this.element.style.top) + this.dir.y}px`;
        this.element.style.left = `${parseInt(this.element.style.left) + this.dir.x}px`;
        this.element.style.opacity = `${parseFloat(this.element.style.opacity) * 0.9}`;
    }
    retireList(list) {
        const thisIndex = list.indexOf(this);
        if (thisIndex !== -1) {
            list.splice(thisIndex, 1);
        }
    }
    destroy() {
        this.element.remove();
    }
}