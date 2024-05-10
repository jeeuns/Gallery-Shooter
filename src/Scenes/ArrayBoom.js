class ArrayBoom extends Phaser.Scene {
    constructor() {
        super("arrayBoom");

        // Initialize a class variable "my" which is an object.
        this.my = {sprite: {}, text: {}};

        this.my.sprite.bullet = [];   
        this.my.sprite.hitGroup = [];
        this.maxBullets = 10;           // Don't create more than this many bullets
        
        this.myScore = 0;
        this.myHealth = 5;

        //bullet cooldown
        this.bulletCooldown = 3;     
        this.bulletCooldownCounter = 0;

        // this.waves = [
        //     { numEnemies: 5, enemyType: 'enemy1', spawnInterval: 1000 },
        //     { numEnemies: 8, enemyType: 'enemy2', spawnInterval: 900 },
        //     { numEnemies: 10, enemyType: 'enemy1', spawnInterval: 800 }
        // ];
        // this.currentWave = 0;

    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "ship_0001.png");
        this.load.image("bullet", "tile_0000.png");
        //enemy1
        this.load.image("enemy1", "ship_0000.png");
        this.load.image("hit", "tile_0012.png");

        //enemy2
        this.load.image("enemy2", "ship_0004.png" );

        // //health icon
        // this.load.image("hp", "tile_0024.png");

        // For hit animation
        this.load.image("boom1", "tile_0004.png");
        this.load.image("boom2", "tile_0005.png");
        this.load.image("boom3", "tile_0006.png");
        this.load.image("boom4", "tile_0007.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // Sound asset from the Kenny digital audio / interface sounds / impact sounds pack
        // https://kenney.nl/assets/digital-audio
        // https://kenney.nl/assets/interface-sounds
        // https://kenney.nl/assets/impact-sounds
        this.load.audio("select", "switch_004.ogg");
        this.load.audio("enemyhit", "footstep_carpet_000.ogg");
        this.load.audio("playerhit", "footstep_grass_001.ogg");
    }

    create() {
        let my = this.my;

        my.sprite.player = this.add.sprite(game.config.width/2, game.config.height - 40, "player");
        my.sprite.player.setScale(2);

        my.sprite.enemy1 = this.add.sprite(game.config.width/2, 80, "enemy1");
        my.sprite.enemy1.setScale(2);
        my.sprite.enemy1.flipY = true;
        my.sprite.enemy1.scorePoints = 25;

        my.sprite.enemy2 = this.add.sprite(game.config.width /3, 120, "enemy2");
        my.sprite.enemy2.setScale(2);
        my.sprite.enemy2.flipY = true;
        my.sprite.enemy2.scorePoints = 15;

        // BOOM
        this.anims.create({
            key: "puff",
            frames: [
                { key: "boom1" },
                { key: "boom2" },
                { key: "boom3" },
                { key: "boom4" },
            ],
            frameRate: 12,
            repeat: 0.5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("R");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 7;
        this.bulletSpeed = 10;
        this.hitSpeed = 5;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>[A] MOVE LEFT // [D] MOVE RIGHT // [SPACE] SHOOT </h2>'

        // TEXT ON SCREEN
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);
        my.text.health = this.add.bitmapText(20, 550, "rocketSquare", "Health: " + this.myHealth);
        my.text.restart = this.add.bitmapText(game.config.width/5, game.config.height/2, "rocketSquare", "Press [R] to Play Again");
        my.text.restart.visible = false;

        // Put title on screen
        my.text.title = this.add.bitmapText(20, 0, "rocketSquare", "SPACE SHOOTER");

        my.sprite.bulletGroup = this.add.group({
            defaultKey: "bullet",
            maxSize: 10
            }
        )

        my.sprite.health = this.add.group({
            defaultKey: this.myHealth,
            minSize: 0
        }
    )

        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup.createMultiple({
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });

        my.sprite.hitGroup = this.add.group({
            defaultKey: "hit",
            maxSize: 10
        });

        // Initialize the group with inactive "hit" bullets
        my.sprite.hitGroup.createMultiple({
            active: false,
            key: my.sprite.hitGroup.defaultKey,
            repeat: my.sprite.hitGroup.maxSize - 1
        });

        // Timer to emit "hit" bullets if enemy1 is visible
        this.time.addEvent({
            delay: 1000, // Delay in milliseconds (1 second)
            callback: () => {
                if (my.sprite.enemy1.visible) {
                    let hit = my.sprite.hitGroup.getFirstDead(); // Get the first inactive "hit" bullet
                    if (hit) {
                        hit.active = true;
                        hit.visible = true;
                        hit.x = my.sprite.enemy1.x;
                        hit.y = my.sprite.enemy1.y;
                    }
                }
            },
            loop: true
        });

        //enemy2 timer
        this.time.addEvent({
            delay: 500, 
            callback: () => {
                if (my.sprite.enemy2.visible) {
                    let hit = my.sprite.hitGroup.getFirstDead(); // Get the first inactive "hit" bullet
                    if (hit) {
                        hit.active = true;
                        hit.visible = true;
                        hit.x = my.sprite.enemy2.x;
                        hit.y = my.sprite.enemy2.y;
                    }
                }
            },
            loop: true
        });

        //this.startWave();

    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.player.x > (my.sprite.player.displayWidth/2)) {
                my.sprite.player.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.player.x < (game.config.width - (my.sprite.player.displayWidth/2))) {
                my.sprite.player.x += this.playerSpeed;
            }
        }

        this.bulletCooldownCounter--;

        if (this.space.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let bullet = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    bullet.active = true;
                    bullet.visible = true;
                    bullet.x = my.sprite.player.x;
                    bullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/2);
                    this.bulletCooldownCounter = this.bulletCooldown;
                }
            }
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        //Check for collision with the enemy
        for (let bullet of my.sprite.bulletGroup.getChildren()) {
            if (this.collides(my.sprite.enemy1, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.enemy1.x, my.sprite.enemy1.y, "boom4").setScale(1.5).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.enemy1.visible = false;
                my.sprite.enemy1.x = -100;
                // Update score
                this.myScore += my.sprite.enemy1.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("enemyhit", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                // new enemy after animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemy1.visible = true;
                    this.my.sprite.enemy1.x = Math.random()*config.width + 20;
                }, this);

            }
            if (this.collides(my.sprite.enemy2, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.enemy2.x, my.sprite.enemy2.y, "boom4").setScale(1.5).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.enemy2.visible = false;
                my.sprite.enemy2.x = -100;
                // Update score
                this.myScore += my.sprite.enemy2.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("enemyhit", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemy2.visible = true;
                    this.my.sprite.enemy2.x = Math.random()*config.width + 20;
                }, this);
            }
        }

        //check if going off screen
        for (let bullet of my.sprite.bulletGroup.getChildren()) {
            if (bullet.y < -(bullet.displayHeight/2)) {
                bullet.active = false;
                bullet.visible = false;
            }
        }

        //Enemy collision
        for (let hit of my.sprite.hitGroup.getChildren()) {
            if (hit.visible) {
                hit.y += this.hitSpeed;
                // Check if "hit" bullet collides with the player
                if (this.collides(my.sprite.player, hit)) {
                    // Play sound
                    this.sound.play("playerhit", {
                        volume: 1   // Can adjust volume using this, goes from 0 to 1
                    });
                    this.myHealth -=1; // Reduce player health
                    my.text.health.setText('Health: '+ this.myHealth); // Update health display
                    hit.visible = false;
                    hit.active = false;

                    // End game if health reaches 0
                    if (this.myHealth < 1) {
                        this.scene.start("start");
                    }
                }

                // Deactivate the "hit" bullet if it moves off-screen
                if (hit.y > game.config.height) {
                    hit.visible = false;
                    hit.active = false;
                }
            }
        }

        

        // move bullets
        my.sprite.bulletGroup.incY(-this.bulletSpeed);

        // if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
        //     this.scene.start("");
        // }

    }
    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

    // startWave() {
    //     let wave = this.waves[this.currentWave];
    //     this.waveTimer = this.time.addEvent({
    //         delay: wave.spawnInterval,
    //         callback: () => {
    //             this.spawnEnemy(wave.enemyType);
    //             if (--wave.numEnemies === 0) {
    //                 this.waveTimer.remove();
    //                 if (this.currentWave < this.waves.length - 1) {
    //                     this.currentWave++;
    //                     this.startWave(); // Start the next wave
    //                 }
    //             }
    //         },
    //         callbackScope: this,
    //         loop: true
    //     });
        
    // }

    // spawnEnemy(type) {
    //     let xPosition = Phaser.Math.Between(50, game.config.width - 50); // Randomize spawn location
    //     let enemy = this.add.sprite(xPosition, 50, type);
    //     enemy.setScale(2);
    //     enemy.flipY = true; // Depending on your asset

    //     // Ensuring the enemy is active and can be interacted with
    //     enemy.setActive(true);
    //     enemy.setVisible(true);
    // }

}
         