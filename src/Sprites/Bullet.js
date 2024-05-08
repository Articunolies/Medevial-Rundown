class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        
        super(scene, x, y, texture, frame);
        
        this.setScale(1);
        this.visible = false;
        this.active = false;
        this.enemy = false;
        this.speed = 10;
        
        return this;
    }

    update() {
        if (this.active) {
            if (!this.enemy) {
                this.y -= this.speed;
                if (this.y < -(this.displayHeight/2)) {
                    this.makeInactive();
                }
            }
            else {
                this.y += this.speed;
                if (this.y > 700 + (this.displayHeight/2)) {
                    this.makeInactive();
                }
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

}