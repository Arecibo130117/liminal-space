import { InputManager } from '../input/InputManager';
import { World } from '../world/World';

/**
 * 플레이어 컨트롤러
 * 
 * 요구사항:
 * - WASD 이동 / 마우스 시점
 * - Space 점프 / Shift 달리기
 * - 헤드 바빙
 * - 달리면 흔들림 증가
 * - 정지 시 미세 호흡
 * - 실제 사람처럼 (캡슐 콜라이더 금지)
 */
export class Player {
  public position: [number, number, number] = [0, 1.7, 0]; // 눈높이
  public rotation: [number, number] = [0, 0]; // pitch, yaw
  private velocity: [number, number, number] = [0, 0, 0];
  private isGrounded: boolean = true;
  private headBob: number = 0;
  private headBobTime: number = 0;
  private breathing: number = 0;

  constructor(private input: InputManager) {}

  init(world: World) {
    // 플레이어 초기 위치 설정
    this.position = [0, 1.7, 0];
  }

  update(deltaTime: number) {
    // 마우스 회전
    const mouseDelta = this.input.getMouseDelta();
    const sensitivity = 0.002;
    this.rotation[1] += mouseDelta.x * sensitivity; // yaw
    this.rotation[0] -= mouseDelta.y * sensitivity; // pitch
    this.rotation[0] = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation[0])); // -90 ~ 90도 제한

    // 이동 입력
    const move = this.input.getMoveVector();
    const speed = this.input.isRunning() ? 5.0 : 2.5;
    
    // 회전 적용
    const yaw = this.rotation[1];
    const forwardX = Math.sin(yaw);
    const forwardZ = Math.cos(yaw);
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);

    // 속도 계산
    this.velocity[0] = (move.forward * forwardX + move.right * rightX) * speed;
    this.velocity[2] = (move.forward * forwardZ + move.right * rightZ) * speed;

    // 점프
    if (this.input.isJumping() && this.isGrounded) {
      this.velocity[1] = 5.0;
      this.isGrounded = false;
    }

    // 중력
    if (!this.isGrounded) {
      this.velocity[1] -= 9.8 * deltaTime;
    }

    // 위치 업데이트
    this.position[0] += this.velocity[0] * deltaTime;
    this.position[1] += this.velocity[1] * deltaTime;
    this.position[2] += this.velocity[2] * deltaTime;

    // 지면 충돌 (간단 버전)
    if (this.position[1] < 1.7) {
      this.position[1] = 1.7;
      this.velocity[1] = 0;
      this.isGrounded = true;
    }

    // 헤드 바빙
    if (move.forward !== 0 || move.right !== 0) {
      const bobSpeed = this.input.isRunning() ? 15.0 : 10.0;
      this.headBobTime += deltaTime * bobSpeed;
      this.headBob = Math.sin(this.headBobTime) * (this.input.isRunning() ? 0.05 : 0.02);
    } else {
      // 정지 시 미세 호흡
      this.breathing = Math.sin(Date.now() * 0.001) * 0.01;
      this.headBob = this.breathing;
    }

    // 마찰 (감속)
    this.velocity[0] *= 0.9;
    this.velocity[2] *= 0.9;
  }

  getCameraPosition(): [number, number, number] {
    return [
      this.position[0],
      this.position[1] + this.headBob,
      this.position[2]
    ];
  }

  getCameraRotation(): [number, number] {
    return this.rotation;
  }
}
