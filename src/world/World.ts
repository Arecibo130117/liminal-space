import { Renderer } from '../renderer/Renderer';

/**
 * 백화점 월드 구조
 * 
 * 요구사항:
 * - 다층 구조 (B1 ~ 옥상)
 * - 각 층마다 다른 성격
 * - 반복 방지
 * - 중앙 수직 허브
 */
export enum Floor {
  B1 = -1,      // 지하 식품관
  F1 = 1,       // 캐주얼/생활층
  F2 = 2,
  F3 = 3,       // 고급 패션층
  F4 = 4,
  F5 = 5,       // 식당가/문화공간
  F6 = 6,
  Roof = 7      // 옥상/기계실
}

export class World {
  private floors: Map<Floor, FloorData> = new Map();
  private currentFloor: Floor = Floor.F1;

  async init(renderer: Renderer) {
    // 각 층 초기화
    await this.initializeFloors(renderer);
  }

  private async initializeFloors(renderer: Renderer) {
    // B1 - 지하 식품관
    this.floors.set(Floor.B1, {
      floor: Floor.B1,
      name: '지하 식품관',
      description: '좁고 복잡한 미로같은 공간',
      structures: []
    });

    // F1-F2 - 캐주얼/생활층
    this.floors.set(Floor.F1, {
      floor: Floor.F1,
      name: '캐주얼/생활층',
      description: '밝고 넓은 정상적인 백화점',
      structures: []
    });

    // F3-F4 - 고급 패션층
    this.floors.set(Floor.F3, {
      floor: Floor.F3,
      name: '고급 패션층',
      description: '너무 넓고 조용한 리미널 공간',
      structures: []
    });

    // F5-F6 - 식당가/문화공간
    this.floors.set(Floor.F5, {
      floor: Floor.F5,
      name: '식당가/문화공간',
      description: '백화점 같지 않은 이질적 공간',
      structures: []
    });

    // Roof - 옥상/기계실
    this.floors.set(Floor.Roof, {
      floor: Floor.Roof,
      name: '옥상/기계실',
      description: '비공개 영역',
      structures: []
    });

    // TODO: 실제 지오메트리 로드
  }

  update(deltaTime: number) {
    // 월드 업데이트 (상호작용 등)
  }

  render(renderer: Renderer) {
    // 현재 층 렌더링
    const floorData = this.floors.get(this.currentFloor);
    if (floorData) {
      // TODO: 실제 지오메트리 렌더링
    }
  }

  getCurrentFloor(): Floor {
    return this.currentFloor;
  }

  setCurrentFloor(floor: Floor) {
    this.currentFloor = floor;
  }
}

interface FloorData {
  floor: Floor;
  name: string;
  description: string;
  structures: any[];
}
