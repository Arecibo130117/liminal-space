import { RenderConfig } from './Renderer';

/**
 * WebGPU 기본 렌더링 파이프라인
 */
export class GPURenderer {
  public device!: GPUDevice;
  public context!: GPUCanvasContext;
  public config!: RenderConfig;
  private commandEncoder: GPUCommandEncoder | null = null;
  private renderPassDescriptor: GPURenderPassDescriptor | null = null;

  constructor(private canvas: HTMLCanvasElement) {}

  async init(config: RenderConfig) {
    this.config = config;

    // WebGPU 어댑터 요청
    const adapter = await navigator.gpu!.requestAdapter({
      powerPreference: 'high-performance'
    });

    if (!adapter) {
      throw new Error('WebGPU 어댑터를 사용할 수 없습니다.');
    }

    // 디바이스 요청
    this.device = await adapter.requestDevice({
      requiredLimits: {
        maxBindGroups: 8,
        maxTextureDimension2D: 8192,
        maxBufferSize: 256 * 1024 * 1024 // 256MB
      }
    });

    // 컨텍스트 구성
    this.context = this.canvas.getContext('webgpu')!;
    if (!this.context) {
      throw new Error('WebGPU 컨텍스트를 얻을 수 없습니다.');
    }

    // WebGPU 캔버스 포맷 설정
    const format = (navigator.gpu as any).getPreferredCanvasFormat 
      ? (navigator.gpu as any).getPreferredCanvasFormat()
      : 'bgra8unorm'; // fallback
    
    this.context.configure({
      device: this.device,
      format: format as GPUTextureFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      alphaMode: 'premultiplied',
      colorSpace: 'srgb'
    });

    // 렌더 패스 디스크립터 준비
    const colorAttachments: GPURenderPassColorAttachment[] = [{
      view: undefined as any, // 프레임마다 업데이트
      clearValue: { r: 0.05, g: 0.05, b: 0.1, a: 1.0 },
      loadOp: 'clear',
      storeOp: 'store'
    }];
    
    this.renderPassDescriptor = {
      colorAttachments: colorAttachments
    };
  }

  beginFrame() {
    const textureView = this.context.getCurrentTexture().createView();
    
    if (this.renderPassDescriptor && this.renderPassDescriptor.colorAttachments) {
      const colorAttachments = this.renderPassDescriptor.colorAttachments as GPURenderPassColorAttachment[];
      if (colorAttachments.length > 0) {
        colorAttachments[0].view = textureView;
      }
    }

    this.commandEncoder = this.device.createCommandEncoder();
  }

  endFrame() {
    if (!this.commandEncoder) return;

    const commandBuffer = this.commandEncoder.finish();
    this.device.queue.submit([commandBuffer]);
    this.commandEncoder = null;
  }

  handleResize(displayWidth: number, displayHeight: number) {
    // 캔버스 스타일 크기는 이미 설정됨
    // 내부 해상도는 유지 (1440p)
  }

  getCommandEncoder(): GPUCommandEncoder {
    if (!this.commandEncoder) {
      this.beginFrame();
    }
    return this.commandEncoder!;
  }

  getRenderPassDescriptor(): GPURenderPassDescriptor {
    if (!this.renderPassDescriptor) {
      throw new Error('Renderer not initialized');
    }
    return this.renderPassDescriptor;
  }
}
