import { World } from '../world/World';
import { Player } from '../player/Player';

/**
 * 괴물 AI
 * 
 * 요구사항:
 * - 느리지만 불가피
 * - 빠르지 않음, 순간이동 없음, 점프스케어 없음
 * - 절대 멈추지 않음
 * - 플레이어가 보면 멈추거나 느려짐
 * - 플레이어가 안 보면 조용히 접근
 */
export enum MonsterState {
  Dormant,
  Roam,
  Probe,
  Approach,
  StareLock,
  Pursue,
  Corner,
  Fade
}

export class Monster {
  public position: [number, number, number] = [10, 0, 10];
  private state: MonsterState = MonsterState.Roam;
  private stateTimer: number = 0;
  private speed: number = 1.5; // 느림
  private isVisibleToPlayer: boolean = false;

  init(world: World, player: Player) {
    // 초기 위치 설정
    this.position = [10, 0, 10];
  }

  update(deltaTime: number) {
    this.stateTimer += deltaTime;

    // 플레이어 시야 체크 (간단 버전)
    // TODO: 실제 LOS (Line of Sight) 계산
    this.isVisibleToPlayer = false;

    // 상태 머신 업데이트
    switch (this.state) {
      case MonsterState.Roam:
        this.updateRoam(deltaTime);
        break;
      case MonsterState.Probe:
        this.updateProbe(deltaTime);
        break;
      case MonsterState.Approach:
        this.updateApproach(deltaTime);
        break;
      case MonsterState.Pursue:
        this.updatePursue(deltaTime);
        break;
      default:
        this.updateRoam(deltaTime);
    }
  }

  private updateRoam(deltaTime: number) {
    // 배회 로직
    // TODO: 실제 경로 탐색
  }

  private updateProbe(deltaTime: number) {
    // 탐색 로직
    // 플레이어의 가능한 위치를 탐색
  }

  private updateApproach(deltaTime: number) {
    // 접근 로직
    // 플레이어가 보이지 않을 때 조용히 접근
    if (!this.isVisibleToPlayer) {
      // 이동
    } else {
      // 보이면 멈추거나 느려짐
      this.speed *= 0.1;
    }
  }

  private updatePursue(deltaTime: number) {
    // 추격 로직
    // 느리지만 계속 접근
    if (!this.isVisibleToPlayer) {
      // 안 보이면 더 가까이 접근
    }
  }

  render(renderer: any) {
    // 괴물 렌더링
    // TODO: 실제 모델 렌더링
  }
}
