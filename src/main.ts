import Phaser from 'phaser';
import packImg from '../assets/card_deck.webp';
import card1Img from '../assets/aquatic_dragon.webp';
import card2Img from '../assets/fire_fox.webp';
import card3Img from '../assets/plant_dragon.webp';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1d1d1d',
  scene: {
    preload,
    create
  }
};

function preload(this: Phaser.Scene) {
  this.load.image('pack', packImg);
  this.load.image('card1', card1Img);
  this.load.image('card2', card2Img);
  this.load.image('card3', card3Img);
}

function create(this: Phaser.Scene) {
  const pack = this.add.image(400, 300, 'pack').setInteractive().setScale(0.1);

  this.add.text(400, 100, 'Click to Open Pack', {
    font: '24px Arial',
    color: '#ffffff'
  }).setOrigin(0.5);

  pack.on('pointerdown', () => {
    pack.destroy(); // remove pack image
    this.add.image(250, 300, 'card1').setScale(0.1);
    this.add.image(400, 300, 'card2').setScale(0.1);
    this.add.image(550, 300, 'card3').setScale(0.1);
  });
}

new Phaser.Game(config);