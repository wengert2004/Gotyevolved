import Phaser from 'phaser';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export class TimerStopScene extends Phaser.Scene {
    private totalPointsText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private actionButton!: Phaser.GameObjects.Text;
    private timerValue = 0;
    private countingUp = true;
    private running = false;
    private finished = false;

    constructor() {
        super('TimerStopScene');
    }

    create() {
        this.timerValue = 0;
        this.running = false;
        this.finished = false;
        this.countingUp = true;

        const backButton = this.add.rectangle(GAME_WIDTH - 100, 30, 140, 40, 0x3333aa)
            .setInteractive({ useHandCursor: true });

        this.add.text(GAME_WIDTH - 100, 30, 'Back to Menu', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });


        this.add.text(GAME_WIDTH / 2, 60, 'Stop the Timer!', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const totalPoints = this.registry.get('totalPoints') || 0;

        this.totalPointsText = this.add.text(20, 20, `Total Points: ${totalPoints}`, {
            fontSize: '18px',
            color: '#00ffff'
        }).setOrigin(0, 0);


        this.timerText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '0.00', {
            fontSize: '48px',
            color: '#00ff00'
        }).setOrigin(0.5);

        const button = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 100, 200, 60, 0xff3333)
            .setInteractive({ useHandCursor: true });

        this.actionButton = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 100, 'START', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.on('pointerdown', () => {
            if (!this.running && !this.finished) {
                this.running = true;
                this.actionButton.setText('STOP');
            } else if (this.running && !this.finished) {
                this.running = false;
                this.finished = true;

                const value = this.timerValue.toFixed(2);
                const points = this.calculatePoints(Number(value));
                this.registry.set('lastPoints', points);

                const totalPoints = (this.registry.get('totalPoints') || 0) + points;
                this.registry.set('totalPoints', totalPoints);
                this.totalPointsText.setText(`Total Points: ${totalPoints}`);

                this.showResult(points, value);
            } else if (this.finished) {
                this.resetGame();
            }

        });
    }

    update(_: number, delta: number) {
        if (!this.running || this.finished) return;

        const dt = delta / 1000;
        this.timerValue += this.countingUp ? dt : -dt;

        if (this.timerValue >= 10) {
            this.countingUp = false;
            this.timerValue = 10;
        } else if (this.timerValue <= 0) {
            this.countingUp = true;
            this.timerValue = 0;
        }

        this.timerText.setText(this.timerValue.toFixed(2));
    }

    private calculatePoints(value: number): number {
        const decimal = value.toFixed(2).split('.')[1];
        const tenths = decimal[0];
        const hundredths = decimal[1];

        if (tenths === '0' && hundredths === '0') return 1000;

        let points = 0;
        if (tenths === '0') points += 10;
        if (hundredths === '0') points += 10;

        if (points == 0)
            points = 1;

        return points;
    }

    private showResult(points: number, value: string) {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, `You stopped at ${value}`, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5).setName('result');

        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, `Points: ${points}`, {
            fontSize: '24px',
            color: points === 1000 ? '#00ff00' : '#ffff00'
        }).setOrigin(0.5).setName('result');

    }

    private resetGame() {
        this.timerValue = 0;
        this.countingUp = true;
        this.running = false;
        this.finished = false;
        this.timerText.setText('0.00');
        this.actionButton.setText('START');

        this.children.getAll().forEach(obj => {
            if (obj.name === 'result') obj.destroy();
        });
    }
}
