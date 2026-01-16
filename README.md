# Liminal Space - 리미널 스페이스

AAA급 심리 공포 게임. 실제 백화점 구조를 완벽히 재현한 리미널 공간에서 느리지만 불가피한 괴물이 플레이어를 추격하는 체험형 오픈월드 공포 게임.

## 기술 스택

- **렌더링**: WebGPU 기반 커스텀 렌더러
- **성능**: WASM (Rust) - C++급 성능
- **빌드**: Vite + TypeScript
- **배포**: Vercel

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# WASM 빌드 (Rust 설치 필요)
npm run build:wasm

# 프로덕션 빌드
npm run build
```

## 배포

```bash
# Vercel에 배포
vercel
```

## 요구사항

- Chrome/Edge (WebGPU 지원 필요)
- Windows 10/11 권장
- 최소 1440p 해상도 권장
