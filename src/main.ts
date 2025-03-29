import Phaser from 'phaser'
import { TimerStopScene } from './scenes/TimerStopScene'
import { SlotMachineScene } from './scenes/SlotMachineScene'
import { ClawMachineScene } from './scenes/ClawMachineScene'
import { addHUD } from './utils/SceneUI'

const GAME_WIDTH = 800
const GAME_HEIGHT = 600

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene')
  }

  create() {
    const totalPoints = this.registry.get('totalPoints') || 0
    addHUD(this, false)

    this.add.text(GAME_WIDTH / 2, 60, 'Mini-Game Portal', {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5)

    const buttonLabels = [
      'Gacha Cards\nTBD', 'Angry Birds\nTBD', 'Claw Machine',
      'Slots', 'Timer Stop', 'Drag Maze\nTBD',
      'TBD', 'TBD', 'TBD'
    ]

    const cols = 3
    const spacing = 150
    const startX = GAME_WIDTH / 2 - spacing
    const startY = GAME_HEIGHT / 2 - spacing

    let index = 0
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * spacing
        const y = startY + row * spacing
        const label = buttonLabels[index] || `Game ${index + 1}`

        const button = this.add.rectangle(x, y, 120, 60, 0x4444aa)
          .setInteractive({ useHandCursor: true })

        this.add.text(x, y, label, {
          fontSize: '14px',
          color: '#ffffff',
          align: 'center'
        }).setOrigin(0.5)

        button.on('pointerdown', () => {
          if (label === 'Timer Stop') {
            this.scene.start('TimerStopScene')
          } else if (label === 'Slots') {
            this.scene.start('SlotMachineScene')
          } else if (label === 'Claw Machine') {
            this.scene.start('ClawMachineScene')
          }
        })

        index++
      }
    }
  }
}

class BlurPostPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      renderTarget: true,
      fragShader: `
        precision mediump float;
        uniform sampler2D uMainSampler;
        varying vec2 outTexCoord;
        void main() {
          vec4 color = vec4(0.0);
          float blur = 1.0 / 300.0;
          for (int x = -4; x <= 4; x++) {
            for (int y = -4; y <= 4; y++) {
              vec2 offset = vec2(float(x), float(y)) * blur;
              color += texture2D(uMainSampler, outTexCoord + offset);
            }
          }
          gl_FragColor = color / 81.0;
        }
      `
    })
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#202020',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [MainMenuScene, TimerStopScene, SlotMachineScene, ClawMachineScene],
  physics: {
    default: 'arcade'
  },
  callbacks: {
    postBoot: (game) => {
      const renderer = game.renderer as Phaser.Renderer.WebGL.WebGLRenderer
      renderer.pipelines.add('BlurPostPipeline', new BlurPostPipeline(game))
    }
  }
}

new Phaser.Game(config)
