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
  private renderPipeline: GPURenderPipeline | null = null;
  private vertexBuffer: GPUBuffer | null = null;

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

    // 어댑터의 지원 제한 확인
    const adapterLimits = adapter.limits;
    
    // 디바이스 요청 - 지원되는 제한 내에서만 요청
    const requestedLimits: Record<string, number> = {
      maxBindGroups: Math.min(8, adapterLimits.maxBindGroups),
      maxTextureDimension2D: Math.min(8192, adapterLimits.maxTextureDimension2D),
      maxBufferSize: Math.min(256 * 1024 * 1024, adapterLimits.maxBufferSize)
    };

    this.device = await adapter.requestDevice({
      requiredLimits: requestedLimits as any
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

    // 기본 테스트 렌더 파이프라인 생성
    await this.createTestPipeline();
  }

  private async createTestPipeline() {
    // 간단한 테스트 삼각형 버텍스 데이터
    const vertices = new Float32Array([
      // x, y (NDC 좌표)
      0.0,  0.5,   // 상단
      -0.5, -0.5,  // 왼쪽 하단
      0.5,  -0.5,  // 오른쪽 하단
    ]);

    this.vertexBuffer = this.device.createBuffer({
      label: 'Test Triangle Vertices',
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.device.queue.writeBuffer(this.vertexBuffer, 0, vertices);

    // 셰이더 모듈
    const vertexShader = this.device.createShaderModule({
      label: 'Test Vertex Shader',
      code: `
        @vertex
        fn vs_main(@location(0) position: vec2<f32>) -> @builtin(position) vec4<f32> {
          return vec4<f32>(position, 0.0, 1.0);
        }
      `,
    });

    const fragmentShader = this.device.createShaderModule({
      label: 'Test Fragment Shader',
      code: `
        @fragment
        fn fs_main() -> @location(0) vec4<f32> {
          return vec4<f32>(0.3, 0.6, 1.0, 1.0); // 밝은 파란색
        }
      `,
    });

    // 렌더 파이프라인
    this.renderPipeline = this.device.createRenderPipeline({
      label: 'Test Render Pipeline',
      layout: 'auto',
      vertex: {
        module: vertexShader,
        entryPoint: 'vs_main',
        buffers: [
          {
            arrayStride: 2 * 4, // vec2<f32> = 8 bytes
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: 'float32x2',
              },
            ],
          },
        ],
      },
      fragment: {
        module: fragmentShader,
        entryPoint: 'fs_main',
        targets: [
          {
            format: (navigator.gpu as any).getPreferredCanvasFormat 
              ? (navigator.gpu as any).getPreferredCanvasFormat()
              : 'bgra8unorm',
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });
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
    
    // 렌더 패스 시작
    if (this.renderPassDescriptor && this.renderPipeline) {
      const renderPass = this.commandEncoder.beginRenderPass(this.renderPassDescriptor);
      
      // 테스트 삼각형 그리기
      if (this.renderPipeline && this.vertexBuffer) {
        renderPass.setPipeline(this.renderPipeline);
        renderPass.setVertexBuffer(0, this.vertexBuffer);
        renderPass.draw(3); // 3개 버텍스
      }
      
      renderPass.end();
    }
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
