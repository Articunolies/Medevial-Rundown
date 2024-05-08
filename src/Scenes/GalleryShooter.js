class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("galleryShooter");
        this.my = {sprite: {}};

        this.bulletCooldown = 15;
        this.enemyspawn = 100;
        this.enemyspawnrate = 1;
        this.speedenemycounter = 0;
        this.waveNumber = 1;

    }

    preload() {

        this.load.setPath("./assets/");
        this.load.image("player", "tile_0085.png");
        this.load.image("knife", "tile_0103.png");
        this.load.image("normal", "tile_0087.png");
        this.load.image("speed", "tile_0121.png");

        this.load.image("dungeon_tiles", "tilemap_packed.png");    // tile sheet   
        this.load.tilemapTiledJSON("map", "ShooterMap.json");

        this.load.audio("playerShootSound", "knifeSlice.ogg");
    }

    create() {
        // reset level vars
        this.bulletCooldownCounter = 0;
        this.enemyspawncounter = 0;
        this.score = 0;
        this.internalscore = 0;
        this.lives = 5;
        this.gameover = false;

        let my = this.my;

        // add background
        this.map = this.add.tilemap("map", 16, 16, 12, 10);

        this.tileset = this.map.addTilesetImage("tilemap_packed", "dungeon_tiles");
        this.sandLayer = this.map.createLayer("sand-layer", this.tileset, 0, 0);
        this.buildLayer = this.map.createLayer("build-layer", this.tileset, 0, 0);
        this.sandLayer.setScale(4.2);
        this.buildLayer.setScale(4.2);

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.reset = this.input.keyboard.addKey("R");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, {fontSize: '32px'});
        this.livesText = this.add.text(600, 16, 'Lives: ' + this.lives, {fontSize: '32px'});
        this.waveText = this.add.text(300, 16, 'Wave: ' + this.waveNumber, {fontSize: '32px'});


        my.sprite.player = new Player(this, this.left, this.right);
        my.sprite.player.setScale(2);

        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "knife",
            maxSize: 20,
            runChildUpdate: true
        });

        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });

        
        my.sprite.enemies = new Phaser.Structs.List();


    }

    update() {

        if (!this.gameover) {
        
            let my = this.my;

            my.sprite.player.update();

            this.bulletShooting();

            this.collisionUpdate();

            this.enemyupdate();

            this.updateWave();

            for (let i of my.sprite.enemies.getAll()) {
                i.update();
            }

        }
        else {

            if (this.reset.isDown) {

                this.scene.start("galleryShooter");
            }
        }
    }
    enemyupdate() {
            
            let my = this.my;
            this.enemyspawncounter--;
            if (this.enemyspawncounter < 0) {
                my.sprite.enemies.add(new NormalEnemy(this, 100, 100));
                this.enemyspawncounter = this.enemyspawn;
                this.speedenemycounter++;
                if (this.speedenemycounter == 2) {
                    my.sprite.enemies.add(new SpeedEnemy(this, 100, 100));
                    this.speedenemycounter = 0;
                }
            }
    }

    updateWave()
    {
        if (this.internalscore >= 3500){
            this.waveNumber++;
            this.lives += 1;
            this.livesText.setText('Lives: ' + this.lives);
            this.waveText.setText('Wave: ' + this.waveNumber);

            if (this.enemyspawn > 15){
                this.enemyspawn = this.enemyspawn - 10;
            }
            this.internalscore = 0;
        }
    }
    bulletShooting() {

        let my = this.my

        this.bulletCooldownCounter--;

        if (this.space.isDown) {

            if (this.bulletCooldownCounter < 0) {

                if (this.bulletShoot(my.sprite.player, false)) {

                    this.bulletCooldownCounter = this.bulletCooldown;
                }
            }
        }
    }

    // scatterBullet(){
    //         let my = this.my
    
    //         for (let i = 0; i < 5; i++) {
    //             let bullet = my.sprite.bulletGroup.getFirstDead();
    //             if (bullet != null) {
    //                 bullet.makeActive();
    //                 bullet.x = my.sprite.player.x - 50 + (i * 25);
    //                 bullet.y = my.sprite.player.y - 50;
    //                 bullet.enemy = false;
    //             }
    //         }
    // }
    explodeBullet(sprite){
        //shoots 5 bullets in different directions from the enemy sprite
        let my = this.my
        for (let i = 0; i < 5; i++) {
            let bullet = my.sprite.bulletGroup.getFirstDead();
            if (bullet != null) {
                bullet.makeActive();
                bullet.x = sprite.x - 50 + (i * 25);
                bullet.y = sprite.y - 50;
                bullet.enemy = true;
            }
        }
    }

    bulletShoot(sprite, enemy) {

        let my = this.my

        let bullet = my.sprite.bulletGroup.getFirstDead();

        if (bullet != null) {

            bullet.makeActive();
            bullet.x = sprite.x;

            if (!enemy) {
                bullet.enemy = false;
                bullet.y = sprite.y - (sprite.displayHeight/2);
                this.sound.play("playerShootSound");
            }
            else {
                bullet.enemy = true;
                bullet.y = sprite.y + (sprite.displayHeight/2);
                // this.sound.play("enemyShootSound");
            }

            
            
            return true;
        }

        return false;
    }


    collisionUpdate() {

        let my = this.my;

        for (let bullet of my.sprite.bulletGroup.getChildren().filter((bullet) => bullet.active)) {

            if (bullet.enemy) { 
                
                if (this.collides(my.sprite.player, bullet)) {
                
                    bullet.y = 1000;
                    this.playerHit();
                }
            }
            else {

                for (let enemymobs of my.sprite.enemies.getAll()) {

                    if (this.collides(enemymobs, bullet)) {
                        // if (enemymobs instanceof SpeedEnemy) {
                        //     enemymobs.explode();
                        // }
                        bullet.y = -100;
                        this.enemyHit(enemymobs);
                    }
                }
            }
        }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    playerHit() {
        
        this.lives--;
        this.livesText.setText('Lives: ' + this.lives);
        // this.sound.play("hitSound");

        if (this.lives == 0) {
            this.my.sprite.player.visible = false;
            this.add.text(400, 300, "Game Over", {fontSize: '64px'}).setOrigin(0.5);
            this.add.text(400, 350, "'R' to restart", {fontSize: '32px'}).setOrigin(0.5);
            this.gameover = true;
        }
    }

    enemyHit(enemymob) {

        enemymob.visible = false;
        this.my.sprite.enemies.remove(enemymob);
        enemymob.destroy();
        // this.sound.play("explosionSound");

        this.score += enemymob.points;
        this.internalscore += enemymob.points;
        this.scoreText.setText('Score: ' + this.score);

        if (this.my.sprite.enemies.length == 0) {
            this.add.text(400, 300, "Victory", {fontSize: '64px'}).setOrigin(0.5);
            this.add.text(400, 350, "'R' to restart", {fontSize: '32px'}).setOrigin(0.5);
            this.gameover = true;
        }
    }


}