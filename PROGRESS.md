# WUTU BUSINESS OS — 개발 진행 기록

> 황제의 관제탑 | 유튜브/사주 자동화 비즈니스 운영 대시보드

---

## 프로젝트 개요

| 항목 | 내용 |
|---|---|
| 프로젝트명 | WUTU BUSINESS OS |
| 부제 | 황제의 관제탑 (Emperor's Control Tower) |
| 기술 스택 | React 18, Vite, Recharts, Lucide React |
| 스타일링 | Inline Styles + CSS Variables (다크 모드) |
| 데이터 저장 | localStorage (새로고침 후에도 유지) |
| 저장소 | https://github.com/doctrin/WUTU_BUISINESS_OS |

---

## 완료된 기능

### Phase 1 — 초기 프로토타입 (단일 HTML 파일)
- [x] 다크 모드 단일 HTML 파일로 초기 대시보드 구현
- [x] React + Recharts CDN 방식으로 동작 확인
- [x] 4개 패널 한 화면 배치 (만다라트 / 타임블로킹 / 칸반 / 차트)
- [x] 실시간 시계 (헤더)
- [x] PropTypes CDN 추가로 Recharts 오류 수정
- [x] Tailwind CDN 제거 (file:// 보안 오류 해결)

### Phase 2 — Vite 프로젝트 전환 + 탭 기반 재설계
- [x] Vite + React 프로젝트로 완전 전환 (`npm run dev`)
- [x] 5개 탭 네비게이션 구현
  - 🏠 대시보드 (전체 현황 요약)
  - ◈ 만다라트 기획 매트릭스
  - ⏱ 타임 블로킹 스케줄러
  - 📋 칸반 보드 태스크 매니저
  - 📊 실적 & 자산 대시보드 (예정)
- [x] `useLocalStorage` 커스텀 훅으로 전체 상태 영속화
- [x] 공유 Modal 컴포넌트 (ESC / 오버레이 클릭 닫기)

### Phase 3 — 기능별 고도화

#### ◈ 만다라트 기획 매트릭스
- [x] 셀 클릭 → 인라인 텍스트 편집 (Enter/Blur 저장, ESC 취소)
- [x] **드릴다운 하위 매트릭스** — 주변 셀 클릭 시 해당 셀이 중앙으로 이동
- [x] 하위 3×3 격자에서 8개 세부 계획 관리
- [x] "← 메인 관제탑으로" 뒤로가기 버튼 + 브레드크럼
- [x] 셀별 3개 할일 체크리스트 (인라인 편집 포함)
- [x] **실시간 진행률 바** — 24개 할일 기준 % 게이지 (메인 카드 하단)
- [x] fade + scale 화면 전환 애니메이션
- [x] 카드별 세부 계획 기본값 자동 생성 (주제별 한국어 텍스트)

#### ⏱ 타임 블로킹 스케줄러
- [x] 05:00 ~ 24:00 수직 타임라인
- [x] **마우스 드래그 & 드롭** 블록 재배치 (30분 단위 스냅)
- [x] 빈 시간대 클릭 → 블록 추가 모달
- [x] 블록 클릭 → 이름 / 시작·종료 시간 / 색상 편집 모달
- [x] 블록 삭제
- [x] **현재 시각 빨간선** 실시간 인디케이터
- [x] 겹침 방지 유효성 검사

#### 📋 칸반 보드
- [x] 3열 구조: 대본 작성 → 영상 편집 → 업로드 완료
- [x] 카드 추가 (Enter 키 지원)
- [x] 카드 클릭 → 제목 / 예상시간 / 우선순위 편집 모달
- [x] 카드 삭제 (× 버튼)
- [x] 카드 단계 이동 (→ 이동 버튼)
- [x] ⚙️ 어드민 설정: 완료 카드 자동 제거 + 지연 시간 선택 (5초~10분)
- [x] 우선순위 색상 도트 (높음/보통/낮음)

#### 📊 실적 & 자산 대시보드
- [x] YouTube API 연동 예정 플레이스홀더 구현
- [ ] YouTube Data API v3 연동 (예정)
- [ ] 채널 구독자 / 조회수 실시간 조회 (예정)
- [ ] 주별 수익 추이 그래프 (예정)

### Phase 4 — 배포 & 운영
- [x] `WUTU_실행.bat` — 더블클릭 서버 실행 파일
- [x] `.gitignore` 설정 (node_modules, dist 제외)
- [x] GitHub 저장소 최초 push

---

## 기술 스택 상세

```
React 18         — UI 컴포넌트 및 상태 관리
Vite 5           — 빌드 도구 및 개발 서버
Recharts 2       — 차트 (Area Chart, Pie Chart)
Lucide React     — 아이콘
localStorage     — 클라이언트 데이터 영속화
Orbitron         — 숫자/헤딩 폰트 (Google Fonts)
Space Grotesk    — 본문 폰트
Noto Sans KR     — 한국어 폰트
```

---

## 파일 구조

```
WUTU_BUSINESS_OS/
├── index.html
├── package.json
├── vite.config.js
├── WUTU_실행.bat          ← 더블클릭으로 서버 실행
├── PROGRESS.md            ← 이 파일
└── src/
    ├── main.jsx
    ├── App.jsx            ← 탭 라우팅 + 전체 상태 관리
    ├── constants.js       ← 초기 데이터, 색상 팔레트
    ├── hooks/
    │   └── useLocalStorage.js
    ├── styles/
    │   └── globals.css
    └── components/
        ├── ui/Modal.jsx
        ├── Header.jsx
        ├── TabNav.jsx
        ├── Dashboard.jsx
        ├── Mandalart.jsx  ← 드릴다운 + 진행률 바 + 인라인 편집
        ├── TimeBlocker.jsx
        ├── Kanban.jsx
        └── Performance.jsx
```

---
<!-- AUTO -->

## 🕐 마지막 업데이트
**2026.05.15 07:16:10 KST** — `main` 브랜치

## 📝 최근 커밋 이력 (최근 7개)
```
4a01b63 chore: ignore only .claude/settings.local.json
2520788 docs: update PROGRESS.md
1927aea test: verify pre-push hook
f425074 docs: update PROGRESS.md
aa1bc66 docs: add PROGRESS.md and pre-push hook
2b8368e first commit
```

## 📂 마지막 커밋 변경 파일
```
 .gitignore | 1 +
 1 file changed, 1 insertion(+)
```
