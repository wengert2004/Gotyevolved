import Phaser from 'phaser'
import { addHUD } from '../utils/SceneUI'

import clawOpen from '../assets/clawmachineimages/claw_open.png'
import clawBackground1 from '../assets/clawmachineimages/claw_background1.png'

export class ClawMachineScene extends Phaser.Scene {
    private claw!: Phaser.GameObjects.Image
    private isDragging = false
    private dragOffsetX = 0
    private clawIsDropping = false

    constructor() {
        super('ClawMachineScene')
    }

    preload() {
        this.load.image('claw', clawOpen)
        this.load.image('background', clawBackground1)
    }

    create() {
        const { width, height } = this.scale

        addHUD(this)

        this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height)

        // Create the claw
        this.claw = this.add.image(width / 2, height * 0.2, 'claw')
            .setOrigin(0.5, 0)
            .setScale(0.1)
            .setInteractive({ draggable: true, useHandCursor: true })
        this.input.setDraggable(this.claw)

        this.input.on('dragstart', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            if (gameObject === this.claw && !this.clawIsDropping) {
                this.isDragging = true
                this.dragOffsetX = pointer.x - this.claw.x
            }
        })

        this.input.on('drag', (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject) => {
            if (gameObject === this.claw && this.isDragging) {
                const newX = Phaser.Math.Clamp(pointer.x - this.dragOffsetX, 50, width - 50)
                this.claw.x = newX
            }
        })

        this.input.on('dragend', () => {
            if (this.isDragging) {
                this.isDragging = false
                this.dropClaw()
            }
        })
    }

    private dropClaw() {
        if (this.clawIsDropping) return

        this.clawIsDropping = true

        this.tweens.add({
            targets: this.claw,
            y: this.scale.height * 0.8,
            duration: 800,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.clawIsDropping = false
                console.log('Claw returned to top')
                // Optionally center the claw again
                // this.claw.x = this.scale.width / 2
            }
        })
    }
}
