class DustParticle extends Particle {
    constructor (){
        super("dust");
        this.timer = 10;
        this.speed = 1;
        this.dir.y = (Math.random() * -2);
    }
}