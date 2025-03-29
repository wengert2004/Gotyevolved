import Phaser from 'phaser'
import Matter from 'matter-js'

export class Claw {
    private scene: Phaser.Scene
    private base: Matter.Body
    private arms: Matter.Body[]

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene

        // Create base of the claw
        const baseRect = scene.add.rectangle(x, y, 40, 20, 0xff0000, 0.8)
        scene.add.existing(baseRect)
        scene.matter.add.gameObject(baseRect, { isStatic: false })
        this.base = baseRect.body as Matter.Body

        // Create arms
        this.arms = []
        const armOffsetX = 25
        const armLength = 60

        const leftArm = Matter.Bodies.rectangle(x - armOffsetX, y + armLength / 2, 10, armLength, {
            chamfer: { radius: 5 }
        })
        const rightArm = Matter.Bodies.rectangle(x + armOffsetX, y + armLength / 2, 10, armLength, {
            chamfer: { radius: 5 }
        })

        this.scene.matter.world.add([leftArm, rightArm])
        this.arms.push(leftArm, rightArm)

        const leftConstraint = Matter.Constraint.create({
            bodyA: this.base,
            bodyB: leftArm,
            pointA: { x: -armOffsetX, y: 10 },
            pointB: { x: 0, y: -armLength / 2 },
            length: 20,
            stiffness: 0.5
        })

        const rightConstraint = Matter.Constraint.create({
            bodyA: this.base,
            bodyB: rightArm,
            pointA: { x: armOffsetX, y: 10 },
            pointB: { x: 0, y: -armLength / 2 },
            length: 20,
            stiffness: 0.5
        })

        this.scene.matter.world.add([leftConstraint, rightConstraint])
    }

    public getBase(): Matter.Body {
        return this.base
    }

    public contains(x: number, y: number): boolean {
        const bounds = this.base.bounds
        return x >= bounds.min.x && x <= bounds.max.x && y >= bounds.min.y && y <= bounds.max.y
    }

    public startDrag(_: Phaser.Input.Pointer) {
        // No-op
    }

    public drag(pointer: Phaser.Input.Pointer) {
        const width = this.scene.scale.width
        const newX = Phaser.Math.Clamp(pointer.x, 50, width - 50)
        const newY = this.base.position.y
        Matter.Body.setPosition(this.base, { x: newX, y: newY })
    }

    public drop(callback: () => void) {
        const originalY = this.base.position.y
        const dropY = this.scene.scale.height * 0.8

        this.scene.tweens.addCounter({
            from: originalY,
            to: dropY,
            duration: 800,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onUpdate: tween => {
                const y = tween.getValue()
                Matter.Body.setPosition(this.base, { x: this.base.position.x, y })
            },
            onComplete: callback
        })
    }
}