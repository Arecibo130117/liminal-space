# 배포 가이드

## Vercel 배포

이 프로젝트는 Vercel에 즉시 배포 가능하도록 구성되어 있습니다.

### 배포 방법

1. **GitHub에 저장소 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Vercel 연결**
   - [Vercel Dashboard](https://vercel.com/dashboard) 접속
   - "New Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정:
     - Framework Preset: `Other`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **환경 변수 설정**
   - 현재는 환경 변수 불필요

4. **배포 완료**
   - Vercel이 자동으로 빌드 및 배포 수행
   - 배포된 URL 제공

### 로컬 테스트

```bash
npm install
npm run dev
```

### 빌드 테스트

```bash
npm run build
npm run preview
```

## 주의사항

- WebGPU는 **HTTPS 또는 localhost**에서만 작동합니다.
- Vercel은 자동으로 HTTPS를 제공하므로 배포 후 정상 작동합니다.
- 로컬 개발 시 `npm run dev`는 자동으로 HTTPS를 지원합니다.

## WASM 빌드 (선택사항)

WASM 모듈을 빌드하려면 Rust가 설치되어 있어야 합니다:

```bash
# Rust 설치 확인
rustc --version

# WASM 빌드
cd wasm
wasm-pack build --target web --out-dir ../src/wasm
```

현재 WASM 모듈은 기본 구조만 포함되어 있으며, 실제 물리 엔진 구현은 향후 추가 예정입니다.
