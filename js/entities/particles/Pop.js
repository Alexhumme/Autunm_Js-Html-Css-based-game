class Pop extends Particle {
    constructor({ text = "", color = "", type = "" }) {
        super("pop");
        this.pos.y.top = true;
        this.pos.x.center = true;
        this.text = text;
        this.color = color;
        this.classNames = type;
    }
}