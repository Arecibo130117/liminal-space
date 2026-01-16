/**
 * 물리 기반 렌더링(PBR) 머티리얼 시스템
 * 
 * 요구사항:
 * - 유리(반사+굴절+두께감)
 * - 대리석/석재(미세 거칠기)
 * - 금속(애너이소트로픽)
 * - 플라스틱(서브서피스)
 * - 패브릭(섬유 느낌)
 */
export enum MaterialType {
  Glass,
  Marble,
  Metal,
  Plastic,
  Fabric
}

export interface PBRMaterialProps {
  type: MaterialType;
  baseColor: [number, number, number, number];
  metallic: number;
  roughness: number;
  // 유리용
  ior?: number; // 굴절률
  thickness?: number; // 두께
  // 금속용
  anisotropic?: number; // 애너이소트로픽
  // 플라스틱용
  subsurface?: number; // 서브서피스 스캐터링
  // 패브릭용
  sheen?: number; // 시어링
  sheenRoughness?: number;
}

export class PBRMaterial {
  constructor(public props: PBRMaterialProps) {}

  static createGlass(): PBRMaterial {
    return new PBRMaterial({
      type: MaterialType.Glass,
      baseColor: [0.9, 0.95, 1.0, 0.1],
      metallic: 0.0,
      roughness: 0.02,
      ior: 1.5,
      thickness: 0.01
    });
  }

  static createMarble(): PBRMaterial {
    return new PBRMaterial({
      type: MaterialType.Marble,
      baseColor: [0.85, 0.85, 0.9, 1.0],
      metallic: 0.0,
      roughness: 0.3
    });
  }

  static createMetal(): PBRMaterial {
    return new PBRMaterial({
      type: MaterialType.Metal,
      baseColor: [0.7, 0.7, 0.75, 1.0],
      metallic: 1.0,
      roughness: 0.2,
      anisotropic: 0.5
    });
  }

  static createPlastic(): PBRMaterial {
    return new PBRMaterial({
      type: MaterialType.Plastic,
      baseColor: [0.8, 0.8, 0.8, 1.0],
      metallic: 0.0,
      roughness: 0.4,
      subsurface: 0.1
    });
  }

  static createFabric(): PBRMaterial {
    return new PBRMaterial({
      type: MaterialType.Fabric,
      baseColor: [0.7, 0.6, 0.5, 1.0],
      metallic: 0.0,
      roughness: 0.8,
      sheen: 0.3,
      sheenRoughness: 0.6
    });
  }
}
