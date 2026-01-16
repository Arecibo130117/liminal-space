import { Renderer } from '../renderer/Renderer';
import { World } from '../world/World';
import { Player } from '../player/Player';
import { Monster } from '../monster/Monster';
import { InputManager } from '../input/InputManager';

export interface GameConfig {
  internalWidth: number;
  internalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

export class Game {
  private renderer: Renderer;
  private world: World;
  private player: Player;
  private monster: Monster;
  private inputManager: InputManager;
  private isRunning: boolean = false;
  private lastTime: number = 0;
  
  constructor(
    private canvas: HTMLCanvasElement,
    private config: GameConfig
  ) {
    this.renderer = new Renderer(canvas);
    this.inputManager = new InputManager();
    this.world = new World();
    this.player = new Player(this.inputManager);
    this.monster = new Monster();
  }

  async init() {
    // WebGPU 초기화
    await this.renderer.init(this.config);
    
    // 월드 로드
    await this.world.init(this.renderer);
    
    // 플레이어 초기화
    this.player.init(this.world);
    
    // 괴물 초기화
    this.monster.init(this.world, this.player);
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  stop() {
    this.isRunning = false;
  }

  private gameLoop = () => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 1/30); // 최대 30fps 제한
    this.lastTime = currentTime;

    // 업데이트
    this.update(deltaTime);
    
    // 렌더링
    this.render();

    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number) {
    // 입력 처리
    this.inputManager.update();
    
    // 플레이어 업데이트
    this.player.update(deltaTime);
    
    // 괴물 업데이트
    this.monster.update(deltaTime);
    
    // 월드 업데이트 (상호작용 등)
    this.world.update(deltaTime);
  }

  private render() {
    this.renderer.beginFrame();
    
    // 월드 렌더링
    this.world.render(this.renderer);
    
    // 플레이어 렌더링 (필요시)
    // this.player.render(this.renderer);
    
    // 괴물 렌더링
    this.monster.render(this.renderer);
    
    // UI 렌더링
    this.renderer.endFrame();
  }

  handleResize(displayWidth: number, displayHeight: number) {
    this.config.displayWidth = displayWidth;
    this.config.displayHeight = displayHeight;
    this.renderer.handleResize(displayWidth, displayHeight);
  }
}
