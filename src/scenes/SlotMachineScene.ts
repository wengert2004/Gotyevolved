import Phaser from 'phaser';
import { addHUD } from '../utils/SceneUI';

export class SlotMachineScene extends Phaser.Scene {
  constructor() {
    super('SlotMachineScene');
  }

  create() {
    addHUD(this);
    this.add.text(400, 300, 'Slot Machine Coming Soon!', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const back = this.add.text(400, 500, 'Back to Menu', {
      fontSize: '24px',
      color: '#00ffff'
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    back.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
