class endScreen extends Phaser.Scene {
    constructor() {
        super("end");

        this.my = {sprite: {}, text: {}};

        //intitalize texts

    }
    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "ship_0001.png");
        this.load.image("bullet", "tile_0000.png");
        //enemy1
        this.load.image("enemy1", "ship_0000.png");
        this.load.image("hit", "tile_0012.png");

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

    create(){

        let my = this.my;

        document.getElementById('description').innerHTML = '<h2>GAME OVER</h2>'

        my.text.start = this.add.bitmapText(game.config.width/5, game.config.height/2, "rocketSquare", "PLAY AGAIN? [SPACE]");
        my.text.title = this.add.bitmapText(game.config.width/10, game.config.height/3, "rocketSquare", "GAME OVER");
        my.text.title.setScale(1.5);

        this.nextScene = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update(){
        let my = this.my;



        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
                this.scene.start("arrayBoom");
                this.sound.play("select", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
            }

        


    }

}