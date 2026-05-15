# WUTU BUSINESS OS — 황제의 관제탑

> 유튜브/사주 자동화 비즈니스 운영 대시보드

---

## 시작하기 (다른 PC에서 클론 후)

### 사전 요구사항
- [Node.js](https://nodejs.org/) v18 이상
- [Git for Windows](https://git-scm.com/) (Git Bash 포함) — pre-commit 훅 실행에 필요

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/doctrin/WUTU_BUISINESS_OS.git
cd WUTU_BUISINESS_OS

# 2. 의존성 설치 (pre-commit 훅 자동 설치 포함)
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 **http://localhost:5173** 접속

### 간편 실행 (Windows)
`WUTU_실행.bat` 더블클릭 → 서버 실행 + 브라우저 자동 오픈

---

## 탭 구성

| 탭 | 기능 |
|---|---|
| 🏠 대시보드 | 전체 현황 요약 |
| ◈ 만다라트 | 기획 매트릭스 — 드릴다운, 인라인 편집, 진행률 바 |
| ⏱ 타임블로킹 | 하루 일정 블록 — 드래그 재배치, 현재시각 인디케이터 |
| 📋 칸반보드 | 태스크 관리 — 추가/이동/삭제/편집, 자동제거 설정 |
| 📊 실적대시보드 | YouTube API 연동 예정 |

---

## 기술 스택

```
React 18 + Vite 5     — UI 및 빌드
Recharts 2            — 차트
localStorage          — 데이터 영속화 (새로고침 후에도 유지)
Inline Styles         — 다크 모드 스타일링 (Tailwind 미사용)
```

---

## Git 워크플로우

```bash
# 작업 후 커밋하면 PROGRESS.md 자동 업데이트됨 (pre-commit 훅)
git add .
git commit -m "feat: 기능 설명"
git push
```

> **주의:** `git commit` 시 pre-commit 훅이 `PROGRESS.md`를 자동으로 업데이트하여 같은 커밋에 포함시킵니다.

---

## 프로젝트 구조

```
WUTU_BUSINESS_OS/
├── index.html
├── package.json
├── vite.config.js
├── WUTU_실행.bat          ← Windows 간편 실행
├── PROGRESS.md            ← 개발 진행 기록 (커밋 시 자동 업데이트)
├── scripts/
│   ├── pre-commit         ← Git 훅 원본
│   └── install-hooks.js   ← npm install 시 훅 자동 설치
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
        ├── Mandalart.jsx
        ├── TimeBlocker.jsx
        ├── Kanban.jsx
        └── Performance.jsx
```
