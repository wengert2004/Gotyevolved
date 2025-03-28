import Phaser from 'phaser'

export class Claw {
    private scene: Phaser.Scene
    private leftArm: Phaser.GameObjects.Image
    private rightArm: Phaser.GameObjects.Image
    private clawBase: Phaser.GameObjects.Image

    // Store offsets for left and right arms relative to the base
    private leftOffsetX = -25
    private rightOffsetX = 25
    private armsOffsetY = 45
    private scaleRatio: number

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene

        // Create parts first
        this.clawBase = scene.add.image(x, y, 'clawBase')
        this.leftArm = scene.add.image(x + this.leftOffsetX, y + this.armsOffsetY, 'clawLeft')
        this.rightArm = scene.add.image(x + this.rightOffsetX, y + this.armsOffsetY, 'clawRight')

        // Scale based on screen height
        this.scaleRatio = scene.scale.height * 0.15 / this.clawBase.height
        this.clawBase.setScale(this.scaleRatio)
        this.leftArm.setScale(this.scaleRatio)
        this.rightArm.setScale(this.scaleRatio)

        this.leftArm.setRotation(Phaser.Math.DegToRad(30))
        this.rightArm.setRotation(Phaser.Math.DegToRad(-30))
        // Adjust relative offsets with scaling
        this.leftOffsetX *= this.scaleRatio
        this.rightOffsetX *= this.scaleRatio
        this.armsOffsetY *= this.scaleRatio

        // Set interactive base
        this.clawBase.setInteractive({ draggable: true, useHandCursor: true })
        scene.input.setDraggable(this.clawBase)


        const leftArmOffset = {
            x: this.leftArm.x - this.clawBase.x,
            y: this.leftArm.y - this.clawBase.y
        }
        const rightArmOffset = {
            x: this.rightArm.x - this.clawBase.x,
            y: this.rightArm.y - this.clawBase.y
        }

        scene.input.on(
            'drag',
            (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
                if (gameObject === this.clawBase) {
                    const clampedX = Phaser.Math.Clamp(dragX, 50, scene.scale.width - 50)
                    this.clawBase.x = clampedX

                    // Maintain arm positions relative to the base
                    this.leftArm.x = clampedX + leftArmOffset.x
                    this.leftArm.y = this.clawBase.y + leftArmOffset.y

                    this.rightArm.x = clampedX + rightArmOffset.x
                    this.rightArm.y = this.clawBase.y + rightArmOffset.y
                }
            }
        )
    }
}
