export function addHUD(scene: Phaser.Scene, showBackButton = true) {
    // Ensure totalPoints exists
    if (scene.registry.get('totalPoints') === undefined || scene.registry.get('totalPoints') === null) {
        scene.registry.set('totalPoints', 0)
    }

    // ✅ Remove existing points text if it exists
    const oldPoints = scene.children.getByName('totalPointsText') as Phaser.GameObjects.Text;
    if (oldPoints) {
        oldPoints.destroy();
    }

    // ✅ Add fresh points text
    const totalPoints = scene.registry.get('totalPoints') || 0;
    const pointsText = scene.add.text(20, 20, `Total Points: ${totalPoints}`, {
        fontSize: '18px',
        color: '#00ffff'
    }).setOrigin(0, 0).setName('totalPointsText');

    // ✅ Prevent multiple listeners on the same scene
    scene.events.off('updatePoints'); // remove any old listeners
    scene.events.on('updatePoints', () => {
        const updated = scene.registry.get('totalPoints') || 0;
        if (pointsText && pointsText.setText) {
            pointsText.setText(`Total Points: ${updated}`);
        }
    });

    // ✅ Remove existing back button if it exists
    if (showBackButton) {
        const oldBackText = scene.children.getByName('backButtonText');
        const oldBackRect = scene.children.getByName('backButtonRect');
        if (oldBackText) oldBackText.destroy();
        if (oldBackRect) oldBackRect.destroy();

        const backRect = scene.add.rectangle(700, 30, 160, 40, 0x3333aa)
            .setInteractive({ useHandCursor: true })
            .setName('backButtonRect');

        scene.add.text(700, 30, 'Back to Menu', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5).setName('backButtonText');

        backRect.on('pointerdown', () => {
            scene.scene.start('MainMenuScene');
        });
    }
}
