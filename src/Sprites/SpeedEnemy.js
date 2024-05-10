class SpeedEnemy extends Phaser.GameObjects.PathFollower {

    constructor(scene, x, y) {

        super(scene, new Phaser.Curves.Spline(
            [
                668, 14,
                579, 289,
                749, 290,
                668, 190,
                646, 676,
            ]), x, y, "speed");

            // // [
            //     714, 17,
            //     567, 501,
            //     776, 484,
            //     676, 359,
            //     630, 840,
            // // ]
        this.setScale(2);
        this.speed = 1;
        this.points =  400;
        this.activateProb = 0.0002;
        this.attacking = false;

        this.shootProb = 0.005;

        this.pathOffset = new Phaser.Math.Vector2(x, y);
        this.curr_x = x;
        this.const_y = y;
        
        this.scene = scene;

        scene.add.existing(this);

        this.startFollow({
            from:0,
            to: 1,
            delay: 0,
            duration: 6000,
        });

        return this;
    }

    update() {

        if (Phaser.Math.FloatBetween(0,1) < this.shootProb) {

            this.scene.bulletShoot(this, true);
        }
        this.pathOffset.x = this.curr_x;
    }

    // explode(){
    //     this.scene.explodeBullet(this);
    // }
}