# WUTU BUSINESS OS — Claude Code 컨텍스트

이 파일은 다른 PC의 Claude Code가 이 프로젝트를 이어서 작업할 수 있도록 작성된 지시사항입니다.

---

## 프로젝트 개요

**WUTU BUSINESS OS**는 유튜브/사주 자동화 비즈니스를 운영하는 사용자(doctrin)의 개인 대시보드입니다.
사주 구조 '자오묘유(4대 엔진)'를 통제하고 '무토(황제의 틀)'의 힘을 극대화하는 컨셉으로 설계됐습니다.

- **저장소:** https://github.com/doctrin/WUTU_BUISINESS_OS
- **실행:** `npm install` → `npm run dev` → http://localhost:5173
- **사용자 이메일:** doctrin999@gmail.com

---

## 기술 스택

- **React 18 + Vite 5** — UI 및 빌드 도구
- **Recharts 2** — 차트 (AreaChart, PieChart)
- **localStorage** — 데이터 영속화 (`useLocalStorage` 커스텀 훅)
- **스타일링** — 인라인 스타일 + CSS 변수 (Tailwind 미사용, CDN 미사용)
- **폰트** — Orbitron (숫자/헤딩), Space Grotesk + Noto Sans KR (본문)

---

## 디자인 시스템

다크 모드. 모든 색상은 `src/constants.js`의 `COLORS`, `BG` 객체를 참조합니다.

```
배경:   #050512 (bg0) / #09091e (bg1) / #0d0d2b (bg2) / #111133 (bg3)
테두리: #1a1a40
강조:   pink=#ff2d78 / blue=#00d4ff / green=#00ff88 / gold=#ffd700
        purple=#bf5fff / orange=#ff7b00 / teal=#00ffd5
```

---

## 구현 완료된 기능

### 전체 구조
- 5개 탭 네비게이션 (대시보드 / 만다라트 / 타임블로킹 / 칸반 / 실적대시보드)
- 모든 상태는 `useLocalStorage` 훅으로 localStorage에 저장됨
- App.jsx에서 전체 상태 관리 후 각 탭에 props로 전달

### ◈ 만다라트 (Mandalart.jsx)
- 3×3 격자, 중앙 = 핵심 목표 (⚡ 유튜브/사주 자동화)
- **드릴다운:** 주변 셀 클릭 → 해당 셀이 중앙으로 이동, 8개 하위 세부 계획 3×3 뷰
- **인라인 편집:** 제목 클릭 → input 전환, Enter/Blur 저장, ESC 취소
  - 편집 키 형식: `main_{id}` / `child_{pid}_{cidx}` / `todo_{pid}_{cidx}_{tidx}`
- **진행률 바:** 각 하위 셀에 체크박스 3개, 메인 카드 하단에 % 게이지
- localStorage 키: `wutu_mandala`

### ⏱ 타임블로킹 (TimeBlocker.jsx)
- 05:00~24:00 수직 타임라인 (MIN_HOUR=5, MAX_HOUR=24, TOTAL_HOURS=19)
- **드래그 앤 드롭:** document 레벨 mousemove/mouseup 이벤트, 30분 단위 스냅
- **현재시각 빨간선:** 1분마다 업데이트
- 블록 클릭 → 편집 모달 (레이블/시간/색상), 빈 칸 클릭 → 추가 모달
- 겹침 방지 유효성 검사
- localStorage 키: `wutu_time_blocks`

### 📋 칸반보드 (Kanban.jsx)
- 3열: 대본 작성 → 영상 편집 → 업로드 완료
- 카드 추가/이동/삭제/편집 (우선순위: high/med/low/done)
- ⚙️ 어드민 설정: 완료 카드 자동 제거 토글 + 지연 시간 (5초~10분)
- 자동 제거 타임아웃은 `useRef`로 관리, 컴포넌트 언마운트 시 정리
- localStorage 키: `wutu_kanban`, `wutu_kanban_settings`

### 📊 실적대시보드 (Performance.jsx)
- **현재 플레이스홀더 상태** — YouTube API 연동 예정
- 사용자가 요청할 때 개발 시작할 것

---

## 개발 규칙 및 주의사항

1. **Tailwind 사용 금지** — 인라인 스타일 또는 globals.css의 CSS 변수 사용
2. **CDN 사용 금지** — 모든 의존성은 npm으로 설치
3. **컴포넌트 내부에 컴포넌트 정의 금지** — React 리렌더링 시 unmount/remount 발생
4. **상태 관리** — 전체 상태는 App.jsx에서 useLocalStorage로 관리, props로 전달
5. **스타일 일관성** — 기존 색상 팔레트(COLORS, BG) 준수, 새 색상 추가 시 constants.js에 정의

---

## Git 워크플로우

```bash
git add .
git commit -m "feat/fix/chore/docs: 설명"
git push
```

- `git commit` 시 pre-commit 훅이 `PROGRESS.md`를 자동 업데이트하여 같은 커밋에 포함
- 훅은 `scripts/pre-commit`에 있으며 `npm install` 시 `.git/hooks/`에 자동 설치

---

## 다음 개발 예정 기능

- [ ] YouTube Data API v3 연동 (실적대시보드)
  - 채널 구독자 수 / 조회수 실시간 조회
  - 주별 수익 추이 그래프
  - 트래픽 유입 경로 파이 차트
  - 사용자가 요청 시 개발 시작

---

## 파일 구조

```
src/
├── main.jsx
├── App.jsx              ← 탭 라우팅 + useLocalStorage 상태 관리
├── constants.js         ← COLORS, BG, TABS, INITIAL_* 데이터
├── hooks/
│   └── useLocalStorage.js
├── styles/
│   └── globals.css      ← CSS 변수, 키프레임 애니메이션
└── components/
    ├── ui/Modal.jsx     ← 공용 모달 (ESC/오버레이 닫기)
    ├── Header.jsx       ← 실시간 시계, 4대 엔진 인디케이터
    ├── TabNav.jsx       ← 5개 탭
    ├── Dashboard.jsx    ← 전체 현황 요약
    ├── Mandalart.jsx    ← 드릴다운 + 인라인 편집 + 진행률 바
    ├── TimeBlocker.jsx  ← D&D 타임라인
    ├── Kanban.jsx       ← 칸반 보드
    └── Performance.jsx  ← YouTube API 예정 플레이스홀더
```
