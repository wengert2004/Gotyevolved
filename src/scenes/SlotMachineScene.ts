import Phaser from 'phaser'
import { addHUD } from '../utils/SceneUI';

import cherries from '../assets/slotmachinesceneimages/slot_cherries.png'
import dragonfruit from '../assets/slotmachinesceneimages/slot_dragon_fruit.png'
import grape from '../assets/slotmachinesceneimages/slot_grape.png'
import lemon from '../assets/slotmachinesceneimages/slot_lemon.png'
import pair from '../assets/slotmachinesceneimages/slot_pair.png'
import pineapple from '../assets/slotmachinesceneimages/slot_pineapple.png'
import roll from '../assets/slotmachinesceneimages/slot_strawberry_cake_roll.png'

const GAME_WIDTH = 800
const GAME_HEIGHT = 600

const slotSymbols = [
  { key: 'cherries', image: cherries },
  { key: 'dragonfruit', image: dragonfruit },
  { key: 'grape', image: grape },
  { key: 'lemon', image: lemon },
  { key: 'pair', image: pair },
  { key: 'pineapple', image: pineapple },
  { key: 'roll', image: roll }
]

export class SlotMachineScene extends Phaser.Scene {
  private reels: Phaser.GameObjects.Image[][] = []
  private finalResults: string[] = []
  private spinButton!: Phaser.GameObjects.Text
  private resultMessage!: Phaser.GameObjects.Text
  private isSpinning = false

  constructor() {
    super('SlotMachineScene')
  }

  preload() {
    slotSymbols.forEach(symbol => {
      this.load.image(symbol.key, symbol.image)
    })
  }

  create() {
    this.reels = []

    // Draw slot grid (3x3)
    const spacing = 130
    const startX = GAME_WIDTH / 2 - spacing
    const startY = GAME_HEIGHT / 2 - spacing

    for (let col = 0; col < 3; col++) {
      const column: Phaser.GameObjects.Image[] = []
      for (let row = 0; row < 3; row++) {
        const symbol = Phaser.Utils.Array.GetRandom(slotSymbols)
        const img = this.add.image(startX + col * spacing, startY + row * spacing, symbol.key).setDisplaySize(100, 100)
        column.push(img)
      }
      this.reels.push(column)
    }

    // Spin Button
    const buttonRect = this.add.rectangle(GAME_WIDTH / 2, 520, 160, 50, 0x00aa00).setInteractive({ useHandCursor: true })
    this.spinButton = this.add.text(GAME_WIDTH / 2, 520, 'SPIN', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    buttonRect.on('pointerdown', () => this.spin())

    // Result Text
    this.resultMessage = this.add.text(GAME_WIDTH / 2, 80, '', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)

    addHUD(this)
  }

  private spin() {
    if (this.isSpinning) return

    this.isSpinning = true
    this.finalResults = []
    this.resultMessage.setText('')
    this.spinButton.setText('...SPINNING...')
    this.spinButton.disableInteractive()

    for (let col = 0; col < 3; col++) {
      const finalKey = Phaser.Utils.Array.GetRandom(slotSymbols).key
      this.finalResults[col] = finalKey

      for (let row = 0; row < 3; row++) {
        const reel = this.reels[col][row]
        const delay = col * 200 + row * 50
        const spinDuration = 500 + col * 300

        // Add blur pipeline during spin
        this.time.delayedCall(delay, () => {
          reel.setPipeline('BlurPostPipeline') // Requires pipeline config
          const spinTimes = 8 + Phaser.Math.Between(0, 4)

          let counter = 0
          const spinInterval = this.time.addEvent({
            delay: 50,
            repeat: spinTimes,
            callback: () => {
              const tempKey = Phaser.Utils.Array.GetRandom(slotSymbols).key
              reel.setTexture(tempKey)
              counter++
            }
          })

          // Final result for center row
          if (row === 1) {
            this.time.delayedCall(spinDuration, () => {
              reel.setTexture(finalKey)
              reel.resetPipeline()
            })
          } else {
            // Reset blur after spin
            this.time.delayedCall(spinDuration, () => {
              reel.resetPipeline()
            })
          }
        })
      }
    }

    this.time.delayedCall(1500, () => {
      this.evaluate()
      this.spinButton.setText('SPIN')
      this.spinButton.setInteractive({ useHandCursor: true })
      this.isSpinning = false
    })
  }

  private evaluate() {
    const middleRowResults = this.reels.map(col => col[1].texture.key)
    const match = middleRowResults.every(key => key === middleRowResults[0])

    const points = match ? 100 : 0
    const total = (this.registry.get('totalPoints') || 0) + points
    this.registry.set('totalPoints', total)

    if (match) {
      this.resultMessage.setText(`🎉 JACKPOT! +${points} points!`)
    } else {
      this.resultMessage.setText('No match!')
    }

    const hudText = this.children.getByName('totalPointsText') as Phaser.GameObjects.Text
    if (hudText) hudText.setText(`Total Points: ${total}`)
  }
}
