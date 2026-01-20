# PNG → SVG 변환 서비스 기획서

## 프로젝트 개요
PNG 이미지를 고퀄리티 SVG 벡터 이미지로 변환하는 무료 웹 서비스

## 타겟 사용자
일반 사용자 (비전문가)

---

## 기술 스택

| 항목 | 선택 | 비고 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | |
| 변환 엔진 | vtracer WASM | 브라우저에서 실행 |
| 호스팅 | Vercel 무료 플랜 | |
| 백엔드 | 없음 | 100% 클라이언트 사이드 |

---

## 핵심 기능

- PNG 파일 업로드 → SVG 파일 다운로드
- 한 번에 1개 파일만 처리
- 변환 옵션 없음 (자동으로 최상급 퀄리티 적용)
- 회원가입/로그인 없음

---

## vtracer 권장 설정

최상급 퀄리티를 위한 파라미터:

```javascript
{
  colormode: 'color',
  hierarchical: 'stacked',
  mode: 'spline',
  filter_speckle: 4,
  color_precision: 8,
  layer_difference: 16,
  corner_threshold: 60,
  length_threshold: 4.0,
  max_iterations: 10,
  splice_threshold: 45,
  path_precision: 3
}
```

---

## UI/UX 요구사항

### 디자인
- 다크 모드 기반
- 예쁘고 세련된 디자인 (핵심 차별화 포인트)

### 사용자 플로우
1. 드래그앤드롭 또는 클릭으로 PNG 업로드
2. 자동 변환 (로딩 애니메이션 표시)
3. 변환 결과 미리보기
4. 다운로드 버튼 클릭 → SVG 저장

---

## 차별화 포인트

1. **프라이버시 보장** — 이미지가 서버로 전송되지 않음 (브라우저에서만 처리)
2. **회원가입 없음** — 바로 사용 가능
3. **깔끔한 UI** — 예쁜 다크모드 디자인

---

## 서버 비용

**0원** (Vercel 무료 + 클라이언트 사이드 처리)

---

## 폴더 구조 (권장)

```
/app
  /page.tsx              # 메인 페이지
  /layout.tsx            # 다크모드 레이아웃
/components
  /UploadZone.tsx        # 드래그앤드롭 업로드 영역
  /Preview.tsx           # 변환 결과 미리보기
  /DownloadButton.tsx    # 다운로드 버튼
/lib
  /converter.ts          # vtracer WASM 래퍼
```

---

## 참고사항

- vtracer WASM 패키지 확인 필요 (npm에서 `vtracer` 또는 관련 WASM 패키지 검색)
- 브라우저 WASM 지원 여부 체크 로직 추가 권장
- 큰 이미지의 경우 변환 시간이 길어질 수 있음 → 적절한 로딩 UX 필요

---

## 기획 완료일
2026년 1월 20일
