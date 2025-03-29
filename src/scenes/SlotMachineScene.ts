import Phaser from 'phaser'
import { addHUD } from '../utils/SceneUI'

import slotCherry from '../assets/slotmachinesceneimages/slot_cherries.png'
import slotDragonFruit from '../assets/slotmachinesceneimages/slot_dragon_fruit.png'
import slotGrape from '../assets/slotmachinesceneimages/slot_grape.png'
import slotLemon from '../assets/slotmachinesceneimages/slot_lemon.png'
import slotPear from '../assets/slotmachinesceneimages/slot_pear.png'
import slotPineapple from '../assets/slotmachinesceneimages/slot_pineapple.png'
import slotStrawberryRoll from '../assets/slotmachinesceneimages/slot_strawberry_cake_roll.png'

export class SlotMachineScene extends Phaser.Scene {
    private symbols: string[] = []
    private score = 0
    private spinning = false
    private reelImages: Phaser.GameObjects.Image[] = []
    private resultText!: Phaser.GameObjects.Text
    private scoreText!: Phaser.GameObjects.Text

    constructor() {
        super('SlotMachineScene')
    }

    preload() {
        this.load.image('cherry', slotCherry)
        this.load.image('dragonfruit', slotDragonFruit)
        this.load.image('grape', slotGrape)
        this.load.image('lemon', slotLemon)
        this.load.image('pear', slotPear)
        this.load.image('pineapple', slotPineapple)
        this.load.image('strawberryroll', slotStrawberryRoll)
    }

    create() {
        const { width, height } = this.scale

        this.symbols = [
            'cherry',
            'dragonfruit',
            'grape',
            'lemon',
            'pear',
            'pineapple',
            'strawberryroll'
        ]

        this.reelImages.forEach(img => img.destroy())
        this.reelImages = []

        addHUD(this)

        this.add.text(width / 2, height * 0.07, 'Slot Machine', {
            fontSize: `${Math.floor(height * 0.05)}px`,
            color: '#ffffff'
        }).setOrigin(0.5)

        const imageY = height * 0.4
        const spacing = width * 0.25
        const startX = width / 2 - spacing

        for (let i = 0; i < 3; i++) {
            const key = Phaser.Utils.Array.GetRandom(this.symbols)
            const img = this.add.image(startX + i * spacing, imageY, key)

            // Scale based on max dimension to normalize visual size
            const maxSize = width * 0.18
            const scale = maxSize / Math.max(img.width, img.height)
            img.setScale(scale)

            this.reelImages.push(img)
        }

        this.resultText = this.add.text(width / 2, height * 0.75, '', {
            fontSize: `${Math.floor(height * 0.04)}px`,
            color: '#ffffff'
        }).setOrigin(0.5)

        this.scoreText = this.add.text(width / 2, height * 0.8, `Score: 0`, {
            fontSize: `${Math.floor(height * 0.035)}px`,
            color: '#00ffff'
        }).setOrigin(0.5)

        const spinBtn = this.add.rectangle(width / 2, height * 0.9, width * 0.3, height * 0.07, 0x44aa44)
            .setInteractive({ useHandCursor: true })

        this.add.text(width / 2, height * 0.9, 'SPIN', {
            fontSize: `${Math.floor(height * 0.035)}px`,
            color: '#ffffff'
        }).setOrigin(0.5)

        spinBtn.on('pointerdown', () => {
            if (!this.spinning) this.spin()
        })
    }

    private spin() {
        this.spinning = true
        this.resultText.setText('')
    
        const results: string[] = []
        const { width } = this.scale
        const maxSize = width * 0.18
    
        // Start spinning each reel rapidly
        const spinIntervals: NodeJS.Timeout[] = []
    
        this.reelImages.forEach((img, i) => {
            spinIntervals[i] = setInterval(() => {
                const key = Phaser.Utils.Array.GetRandom(this.symbols)
                img.setTexture(key)
    
                const frame = this.textures.getFrame(key)
                const scale = maxSize / Math.max(frame.width, frame.height)
                img.setScale(scale)
            }, 50) // Change image every 50ms
        })
    
        // After 1 second, stop each reel in sequence 0.1s apart
        this.time.delayedCall(1000, () => {
            this.reelImages.forEach((img, i) => {
                this.time.delayedCall(i * 500, () => {
                    clearInterval(spinIntervals[i])
    
                    const key = Phaser.Utils.Array.GetRandom(this.symbols)
                    img.setTexture(key)
    
                    const frame = this.textures.getFrame(key)
                    const scale = maxSize / Math.max(frame.width, frame.height)
                    img.setScale(scale)
    
                    results[i] = key
    
                    if (i === this.reelImages.length - 1) {
                        this.evaluateResult(results)
                        this.spinning = false
                    }
                })
            })
        })
    }

    private evaluateResult(results: string[]) {
        const [a, b, c] = results
        let score = 0
        let message = '❌ No win'

        if (a === b && b === c) {
            score = 50
            message = '🎉 JACKPOT! You matched all 3!'
        } else if (a === b || b === c || a === c) {
            score = 10
            message = '🥈 Small Win! You matched 2!'
        } else if (a === c) {
            score = 30
            message = '🎁 Bonus! Matching outer symbols!'
        }

        const totalPoints = (this.registry.get('totalPoints') || 0) + score
        this.registry.set('totalPoints', totalPoints)
        this.events.emit('updatePoints')
        this.resultText.setText(message)
        this.scoreText.setText(`Points: ${score}`)
    }
}
