class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, left, right) {
        
        super(scene, game.config.width/2, game.config.height - 85, "player");

        this.keyA = left;
        this.keyD = right;
        this.Speed = 8;

        scene.add.existing(this);

        return this;
    }

    update() {
        // Moving left
        if (this.keyA.isDown) {
            // Check to make sure the sprite can actually move left
            if (this.x > (this.displayWidth/2) + 20) {
                this.x -= this.Speed;
                this.setFlipX(true);
            }
        }

        // Moving right
        if (this.keyD.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth/2)) - 20) {
                this.x += this.Speed;
                this.setFlipX(false);
            }
        }
    }

}