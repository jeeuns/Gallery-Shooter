// Regina Kim
// Created: 4/28/2024
// Phaser: 3.70.0
//
// Gallery Shooter
//
// Class assignment for CMPM 120 where we explore 1D of movement
//
// 
// Art assets from Kenny Assets "Pixel Shmup" set:
// https://kenney.nl/assets/pixel-shmup

"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    scene: [titleScreen, ArrayBoom],
}

const game = new Phaser.Game(config);