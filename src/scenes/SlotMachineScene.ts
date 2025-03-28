import Phaser from 'phaser'
import { addHUD } from '../utils/SceneUI'

const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const REEL_WIDTH = 120
const REEL_HEIGHT = 120

const slotSymbols = [
  'slot_cherries',
  'slot_dragon_fruit',
  'slot_grape',
  'slot_lemon',
  'slot_pair',
  'slot_pineapple',
  'slot_strawberry_cake_roll'
]

export class SlotMachineScene extends Phaser.Scene {
  private resultMessage!: Phaser.GameObjects.Text
  private reels: Phaser.GameObjects.Image[][] = []
  private spinButton!: Phaser.GameObjects.Text
  private finalResults: string[] = []

  constructor() {
    super('SlotMachineScene')
  }

  preload() {
    slotSymbols.forEach(symbol => {
      this.load.image(symbol, `assets/${symbol}.png`)
    })
  }

  create() {
    this.add.text(GAME_WIDTH / 2, 50, 'Slot Machine', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5)

    addHUD(this)

    const startX = GAME_WIDTH / 2 - 180
    for (let i = 0; i < 3; i++) {
      const column: Phaser.GameObjects.Image[] = []
      for (let j = 0; j < 3; j++) {
        const key = Phaser.Utils.Array.GetRandom(slotSymbols)
        const img = this.add.image(startX + i * 180, 150 + j * 130, key).setDisplaySize(REEL_WIDTH, REEL_HEIGHT)
        column.push(img)
      }
      this.reels.push(column)
    }

    const buttonRect = this.add.rectangle(GAME_WIDTH / 2, 520, 160, 50, 0x4CAF50)
      .setInteractive({ useHandCursor: true })

    this.spinButton = this.add.text(GAME_WIDTH / 2, 520, 'SPIN', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    buttonRect.on('pointerdown', () => {
      this.spin()
    })

    this.resultMessage = this.add.text(GAME_WIDTH / 2, 580, '', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)
  }

  private spin() {
    this.finalResults = []
    this.resultMessage.setText('')

    for (let i = 0; i < 3; i++) {
      const symbol = Phaser.Utils.Array.GetRandom(slotSymbols)
      this.finalResults[i] = symbol

      for (let j = 0; j < 3; j++) {
        const delay = Phaser.Math.Between(50, 150)
        this.time.delayedCall(i * 150 + j * delay, () => {
          const newKey = Phaser.Utils.Array.GetRandom(slotSymbols)
          this.reels[i][j].setTexture(newKey)
        })
      }

      this.time.delayedCall(600 + i * 150, () => {
        this.reels[i][1].setTexture(symbol) // stop on final middle symbol
      })
    }

    this.time.delayedCall(1300, () => {
      this.evaluate()
    })
  }

  private evaluate() {
    const [a, b, c] = this.finalResults
    let points = 0
    let message = '❌ No win'

    if (a === b && b === c) {
      message = '🎉 JACKPOT! You matched all 3!'
      points = 100
    } else if (a === b || b === c || a === c) {
      message = '🥈 Small Win! You matched 2!'
      points = 25
    } else if (a === c) {
      message = '🎁 Bonus! Matching outer symbols!'
      points = 40
    }

    this.resultMessage.setText(message)

    const currentPoints = this.registry.get('totalPoints') || 0
    this.registry.set('totalPoints', currentPoints + points)
    this.events.emit('updatePoints')
  }
}
