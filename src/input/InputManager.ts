/**
 * 입력 관리 시스템
 * 
 * WASD 이동 / 마우스 시점
 * Space 점프 / Shift 달리기
 */
export class InputManager {
  private keys: Set<string> = new Set();
  private mouseDelta: { x: number; y: number } = { x: 0, y: 0 };
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private isPointerLocked: boolean = false;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // 키보드
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code.toLowerCase());
      
      // 포인터 잠금 (마우스 시점 제어)
      if (e.code === 'KeyE' && !this.isPointerLocked) {
        document.body.requestPointerLock();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code.toLowerCase());
    });

    // 마우스 움직임
    document.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        this.mouseDelta.x += e.movementX;
        this.mouseDelta.y += e.movementY;
      }
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    });

    // 포인터 잠금 상태
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement !== null;
    });
  }

  update() {
    // 마우스 델타는 매 프레임 초기화 (누적 방지)
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  getMouseDelta(): { x: number; y: number } {
    return { ...this.mouseDelta };
  }

  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  // 편의 메서드
  getMoveVector(): { forward: number; right: number } {
    let forward = 0;
    let right = 0;

    if (this.isKeyPressed('KeyW')) forward += 1;
    if (this.isKeyPressed('KeyS')) forward -= 1;
    if (this.isKeyPressed('KeyA')) right -= 1;
    if (this.isKeyPressed('KeyD')) right += 1;

    return { forward, right };
  }

  isRunning(): boolean {
    return this.isKeyPressed('ShiftLeft') || this.isKeyPressed('ShiftRight');
  }

  isJumping(): boolean {
    return this.isKeyPressed('Space');
  }

  isInteracting(): boolean {
    return this.isKeyPressed('KeyE');
  }
}
