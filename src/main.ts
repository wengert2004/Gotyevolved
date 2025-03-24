import Phaser from 'phaser';
import packImg from '../assets/card_deck.webp';
import aquaticImg from '../assets/aquatic_dragon.webp';
import fireFoxImg from '../assets/fire_fox.webp';
import plantDragonImg from '../assets/plant_dragon.webp';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#1d1d1d',
  scale: {
    mode: Phaser.Scale.FIT,                 // ✅ Responsive scaling
    autoCenter: Phaser.Scale.CENTER_BOTH,  // ✅ Centers on screen
    width: 800,  // Base width
    height: 600  // Base height
  },
  scene: {
    preload,
    create
  }
};

function preload(this: Phaser.Scene) {
  this.load.image('pack', packImg);
  this.load.image('aquatic', aquaticImg);
  this.load.image('firefox', fireFoxImg);
  this.load.image('plant', plantDragonImg);
}

function create(this: Phaser.Scene) {
  const { width, height } = this.scale;

  const pack = this.add.image(width / 2, height / 2, 'pack')
    .setInteractive()
    .setScale(0.1);

  this.add.text(width / 2, 100, 'Click to Open Pack', {
    font: '24px Arial',
    color: '#ffffff'
  }).setOrigin(0.5);

  pack.on('pointerdown', () => {
    pack.destroy();
    this.add.image(width * 0.25, height / 2, 'aquatic').setScale(0.1);
    this.add.image(width * 0.5, height / 2, 'firefox').setScale(0.1);
    this.add.image(width * 0.75, height / 2, 'plant').setScale(0.1);
  });
}

new Phaser.Game(config);
