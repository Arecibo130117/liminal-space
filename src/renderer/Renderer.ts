import { GPURenderer } from './GPURenderer';
import { PBRMaterial } from './materials/PBRMaterial';
import { LightingSystem } from './lighting/LightingSystem';
import { PostProcessPipeline } from './postprocess/PostProcessPipeline';

export interface RenderConfig {
  internalWidth: number;
  internalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

/**
 * WebGPU 기반 커스텀 렌더러
 * 요구사항: 1440p 내부 해상도, TAA, PBR, GI, 소프트 섀도우
 */
export class Renderer {
  private gpuRenderer: GPURenderer;
  private lighting: LightingSystem;
  private postProcess: PostProcessPipeline;
  private currentFrame: number = 0;

  constructor(private canvas: HTMLCanvasElement) {
    this.gpuRenderer = new GPURenderer(canvas);
    this.lighting = new LightingSystem();
    this.postProcess = new PostProcessPipeline();
  }

  async init(config: RenderConfig) {
    await this.gpuRenderer.init(config);
    await this.lighting.init(this.gpuRenderer.device);
    await this.postProcess.init(this.gpuRenderer.device, config);
  }

  beginFrame() {
    this.currentFrame++;
    this.gpuRenderer.beginFrame();
  }

  endFrame() {
    // TAA (Temporal Anti-Aliasing) 적용
    this.postProcess.applyTAA(this.gpuRenderer, this.currentFrame);
    
    // 최종 프레임 제출
    this.gpuRenderer.endFrame();
  }

  handleResize(displayWidth: number, displayHeight: number) {
    this.gpuRenderer.handleResize(displayWidth, displayHeight);
  }

  get device(): GPUDevice {
    return this.gpuRenderer.device;
  }

  get context(): GPUCanvasContext {
    return this.gpuRenderer.context;
  }

  get config(): RenderConfig {
    return this.gpuRenderer.config;
  }
}
