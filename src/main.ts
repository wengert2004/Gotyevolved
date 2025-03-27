import Phaser from 'phaser';
import { TimerStopScene } from './scenes/TimerStopScene';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const totalPoints = this.registry.get('totalPoints') || 0;
    const lastPoints = this.registry.get('lastPoints');

    this.add.text(20, 20, `Total Points: ${totalPoints}`, {
      fontSize: '18px',
      color: '#00ffff'
    }).setOrigin(0, 0);

    this.add.text(GAME_WIDTH / 2, 60, 'Mini-Game Portal', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const buttonLabels = [
      'Gacha Cards\nTBD', 'Angry Birds\nTBD', 'Claw Machine\nTBD',
      'Slots\nTBD', 'Timer Stop', 'Drag Maze\nTBD',
      'TBD', 'TBD', 'TBD'
    ];

    const cols = 3;
    const spacing = 150;
    const startX = GAME_WIDTH / 2 - spacing;
    const startY = GAME_HEIGHT / 2 - spacing;

    let index = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * spacing;
        const y = startY + row * spacing;
        const label = buttonLabels[index] || `Game ${index + 1}`;

        const button = this.add.rectangle(x, y, 120, 60, 0x4444aa)
          .setInteractive({ useHandCursor: true });
        this.add.text(x, y, label, {
          fontSize: '14px',
          color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerdown', () => {
          if (label === 'Timer Stop') {
            this.scene.start('TimerStopScene');
          } else {
            console.log(`Clicked ${label}`);
          }
        });

        index++;
      }
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#202020',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [MainMenuScene, TimerStopScene]
});
