import Phaser from 'phaser'
import { addHUD } from '../utils/SceneUI'
import { Claw } from '../gameobjects/claw'
import clawBackground1 from '../assets/clawmachineimages/claw_background1.png'
import clawLeft from '../assets/clawmachineimages/claw_arm_left.png'
import clawRight from '../assets/clawmachineimages/claw_arm_right.png'
import clawBase from '../assets/clawmachineimages/claw_base.png'

export class ClawMachineScene extends Phaser.Scene {
    constructor() {
        super('ClawMachineScene')
    }

    preload() {
        this.load.image('background', clawBackground1)
        this.load.image('clawLeft', clawLeft)
        this.load.image('clawRight', clawRight)
        this.load.image('clawBase', clawBase)
    }

    create() {
        const { width, height } = this.scale
        
        this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height)

        addHUD(this)

        // Create claw
        new Claw(this, width / 2, height * 0.2)
    }
}
