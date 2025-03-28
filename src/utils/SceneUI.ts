import Phaser from 'phaser';

export function addHUD(scene: Phaser.Scene, showBackButton = true) {
  // Total Points
  const totalPoints = scene.registry.get('totalPoints') || 0;

  const pointsText = scene.add.text(20, 20, `Total Points: ${totalPoints}`, {
    fontSize: '18px',
    color: '#00ffff'
  }).setOrigin(0, 0);

  scene.events.on('updatePoints', () => {
    const updated = scene.registry.get('totalPoints') || 0;
    pointsText.setText(`Total Points: ${updated}`);
  });

  // Optional back button
  if (showBackButton) {
    const backRect = scene.add.rectangle(700, 30, 160, 40, 0x3333aa)
      .setInteractive({ useHandCursor: true });

    scene.add.text(700, 30, 'Back to Menu', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    backRect.on('pointerdown', () => {
      scene.scene.start('MainMenuScene');
    });
  }
}
