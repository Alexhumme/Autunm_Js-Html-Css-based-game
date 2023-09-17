class Pop {
    constructor({ text = "", color = "", type = "" }) {
        this.text = text;
        this.color = color;
        this.classNames = type;
        this.element = HTMLElement.prototype;
        this.counter = 10;
    }
    update() {
        if (this.counter) {
            this.counter--;
            this.element.style.top = `${parseInt(this.element.style.top) - 2}px`;
            this.element.style.opacity = `${parseFloat(this.element.style.opacity) * 0.9}`;
        } else {
            this.destroy();
        }
    }
    createElementIn(parent = HTMLElement.prototype) {
        const element = document.createElement("span");
        element.style.top = "0px";
        element.style.opacity = "1";
        element.style.left = `10px`;
        element.classList.add("pop", this.classNames);
        element.innerText = this.text;
        element.style.color = this.color;
        parent.appendChild(element);
        this.element = element;
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