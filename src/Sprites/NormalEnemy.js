class NormalEnemy extends Phaser.GameObjects.PathFollower {

    constructor(scene, x, y) {

        super(scene, new Phaser.Curves.Spline(
            [690, 43, 
            79, 234,
            677, 413, 
            -104, 593,
            588, 684,
            ]), x, y, "normal");

        this.setScale(1.5);
        this.speed = 1;
        this.points = 200;
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
            duration: 20000,
        });

        return this;
    }

    update() {

        if (Phaser.Math.FloatBetween(0,1) < this.shootProb) {

            this.scene.bulletShoot(this, true);
        }
        this.pathOffset.x = this.curr_x;
    }

}