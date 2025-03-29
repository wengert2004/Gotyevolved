import Phaser from 'phaser'
import { addHUD } from '../utils/SceneUI'
import { Claw } from '../gameobjects/claw'

export class ClawMachineScene extends Phaser.Scene {
    private claw!: Claw
    private isDragging = false

    constructor() {
        super('ClawMachineScene')
    }

    preload() {
        // No assets to load since we're using shapes
    }

    create() {
        const { width, height } = this.scale

        addHUD(this)

        this.claw = new Claw(this, width / 2, height * 0.2)

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.claw.contains(pointer.x, pointer.y)) {
                this.isDragging = true
                this.claw.startDrag(pointer)
            }
        })

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging) {
                this.claw.drag(pointer)
            }
        })

        this.input.on('pointerup', () => {
            if (this.isDragging) {
                this.isDragging = false
                this.claw.drop(() => {
                    console.log('Claw returned to top')
                })
            }
        })
    }
}
