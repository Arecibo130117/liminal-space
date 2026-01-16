import { Game } from './game/Game';
import './style.css';

const loadingEl = document.getElementById('loading')!;
const errorEl = document.getElementById('error')!;
const canvas = document.getElementById('app') as HTMLCanvasElement;

if (!canvas) {
  throw new Error('Canvas element not found');
}

async function init() {
  try {
    // WebGPU 지원 확인
    if (!navigator.gpu) {
      throw new Error('WebGPU를 지원하지 않는 브라우저입니다. Chrome/Edge를 사용해주세요.');
    }

    // 내부 해상도 1440p 설정 (요구사항)
    const internalWidth = 2560;
    const internalHeight = 1440;
    
    // 화면 비율 유지하며 캔버스 크기 설정
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.min(window.innerWidth, internalWidth);
    const displayHeight = Math.min(window.innerHeight, internalHeight);
    
    canvas.width = internalWidth;
    canvas.height = internalHeight;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // 게임 인스턴스 생성
    const game = new Game(canvas, {
      internalWidth,
      internalHeight,
      displayWidth,
      displayHeight
    });

    await game.init();
    
    loadingEl.style.display = 'none';
    game.start();

    // 창 크기 조정 시 처리
    window.addEventListener('resize', () => {
      const newDisplayWidth = Math.min(window.innerWidth, internalWidth);
      const newDisplayHeight = Math.min(window.innerHeight, internalHeight);
      game.handleResize(newDisplayWidth, newDisplayHeight);
    });

  } catch (error) {
    console.error('초기화 오류:', error);
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    errorEl.innerHTML = `
      <h2>초기화 실패</h2>
      <p>${error instanceof Error ? error.message : String(error)}</p>
      <p style="margin-top: 20px; font-size: 14px; color: #999;">
        WebGPU를 지원하는 브라우저(Chrome/Edge)를 사용해주세요.
      </p>
    `;
  }
}

init();
