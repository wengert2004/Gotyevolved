import Phaser from 'phaser'
import { addHUD } from '../utils/SceneUI';

import slotCherry from '../assets/slotmachinesceneimages/slot_cherries.png'
import slotDragonFruit from '../assets/slotmachinesceneimages/slot_dragon_fruit.png'
import slotGrape from '../assets/slotmachinesceneimages/slot_grape.png'
import slotLemon from '../assets/slotmachinesceneimages/slot_lemon.png'
import slotPear from '../assets/slotmachinesceneimages/slot_pear.png'
import slotPineapple from '../assets/slotmachinesceneimages/slot_pineapple.png'
import slotStrawberryRoll from '../assets/slotmachinesceneimages/slot_strawberry_cake_roll.png'

const GAME_WIDTH = 800
const GAME_HEIGHT = 600
const SYMBOL_SIZE = 100
const SPIN_DURATION = 1000

export class SlotMachineScene extends Phaser.Scene {
  private reelSymbols: Phaser.GameObjects.Image[][] = []
  private reelContainers: Phaser.GameObjects.Container[] = []
  private symbols: string[] = []
  private spinButton!: Phaser.GameObjects.Text
  private isSpinning = false

  preload() {
    this.load.image('slot_cherries', slotCherry)
    this.load.image('slot_dragon_fruit', slotDragonFruit)
    this.load.image('slot_grape', slotGrape)
    this.load.image('slot_lemon', slotLemon)
    this.load.image('slot_pear', slotPear)
    this.load.image('slot_pineapple', slotPineapple)
    this.load.image('slot_strawberry_cake_roll', slotStrawberryRoll)
  }

  create() {
    addHUD(this)

    this.symbols = [
      'slot_cherries',
      'slot_dragon_fruit',
      'slot_grape',
      'slot_lemon',
      'slot_pear',
      'slot_pineapple',
      'slot_strawberry_cake_roll'
    ]

    const reelSpacing = 140
    const centerY = GAME_HEIGHT / 2
    const centerX = GAME_WIDTH / 2 - reelSpacing

    for (let i = 0; i < 3; i++) {
      const container = this.add.container(centerX + i * reelSpacing, centerY)
      const images: Phaser.GameObjects.Image[] = []

      for (let j = -1; j <= 1; j++) {
        const symbol = Phaser.Utils.Array.GetRandom(this.symbols)
        const img = this.add.image(0, j * SYMBOL_SIZE, symbol).setDisplaySize(100, 100)
        images.push(img)
        container.add(img)
      }

      const maskShape = this.make.graphics({ x: 0, y: 0})
      maskShape.fillStyle(0xffffff)
      maskShape.fillRect(
        -SYMBOL_SIZE / 2,
        -SYMBOL_SIZE / 2,
        SYMBOL_SIZE,
        SYMBOL_SIZE
      )
      const mask = maskShape.createGeometryMask()
      container.setMask(mask)

      this.reelSymbols.push(images)
      this.reelContainers.push(container)
    }

    this.spinButton = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 80, 'SPIN', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#008800',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true })

    this.spinButton.on('pointerdown', () => {
      if (!this.isSpinning) {
        this.startSpin()
      }
    })
  }

  startSpin() {
    this.isSpinning = true

    for (let i = 0; i < this.reelContainers.length; i++) {
      const container = this.reelContainers[i]
      const oldSymbols = this.reelSymbols[i]
      const newSymbols: Phaser.GameObjects.Image[] = []

      // Shift all symbols down visually (simulate reel spin)
      this.tweens.add({
        targets: container,
        y: container.y + SYMBOL_SIZE,
        duration: SPIN_DURATION,
        ease: 'Cubic.easeInOut',
        onComplete: () => {
          // Reset position to center and replace symbols
          container.y -= SYMBOL_SIZE

          // Clear old symbols
          oldSymbols.forEach(symbol => symbol.destroy())

          for (let j = -1; j <= 1; j++) {
            const symbolKey = Phaser.Utils.Array.GetRandom(this.symbols)
            const img = this.add.image(0, j * SYMBOL_SIZE, symbolKey).setDisplaySize(100, 100)
            newSymbols.push(img)
            container.add(img)
          }

          this.reelSymbols[i] = newSymbols

          if (i === this.reelContainers.length - 1) {
            this.isSpinning = false
          }
        }
      })
    }
  }
}
