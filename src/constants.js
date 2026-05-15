export const COLORS = {
  pink:   '#ff2d78',
  blue:   '#00d4ff',
  green:  '#00ff88',
  gold:   '#ffd700',
  purple: '#bf5fff',
  orange: '#ff7b00',
  teal:   '#00ffd5',
}

export const BG = {
  bg0: '#050512',
  bg1: '#09091e',
  bg2: '#0d0d2b',
  bg3: '#111133',
  border: '#1a1a40',
}

export const BLOCK_COLORS = [
  '#ff2d78',
  '#00d4ff',
  '#00ff88',
  '#ffd700',
  '#bf5fff',
  '#ff7b00',
  '#00ffd5',
  '#555577',
]

export const MIN_HOUR   = 5
export const MAX_HOUR   = 24
export const TOTAL_HOURS = 19

function makeTodos(parentId, childIdx) {
  return Array.from({ length: 3 }, (_, ti) => ({
    id: `${parentId}_c${childIdx}_t${ti}`,
    text: `할 일 ${ti + 1}`,
    done: false,
  }))
}

function makeChildren(parentId, titles) {
  return titles.map((title, i) => ({
    id: `${parentId}_c${i}`,
    title,
    todos: makeTodos(parentId, i),
  }))
}

export const INITIAL_MANDALA = [
  {
    id: 0, icon: '🎯', title: '콘텐츠 전략', sub: 'Strategy', color: '#00d4ff',
    children: makeChildren(0, ['트렌드 분석', '키워드 리서치', '타겟 설정', '포맷 기획', '배포 채널 선정', '경쟁사 조사', '콘텐츠 캘린더', '성과 측정 KPI']),
  },
  {
    id: 1, icon: '🎬', title: '영상 제작', sub: 'Production', color: '#ff7b00',
    children: makeChildren(1, ['스크립트 작성', '촬영 세팅', '조명 최적화', '음향 설정', 'B롤 촬영', '편집 워크플로우', '썸네일 제작', '업로드 최적화']),
  },
  {
    id: 2, icon: '🔍', title: 'SEO 최적화', sub: 'Search', color: '#00ff88',
    children: makeChildren(2, ['키워드 발굴', '제목 최적화', '태그 전략', '설명 최적화', '자막 추가', '챕터 마킹', '엔드카드 설정', '채널 최적화']),
  },
  {
    id: 3, icon: '🔮', title: '사주 시스템', sub: 'Saju Core', color: '#bf5fff',
    children: makeChildren(3, ['데이터 수집', '천간 분석', '지지 분석', '신살 연구', '대운 분석', '상담 시스템', 'DB 설계', '리포트 자동화']),
  },
  { id: 4, icon: '⚡', title: '유튜브/사주 자동화', sub: 'CORE ENGINE', color: '#ffd700', isCenter: true },
  {
    id: 5, icon: '💰', title: '수익화', sub: 'Monetize', color: '#ffd700',
    children: makeChildren(5, ['구독 수익', '광고 수익', '강의 판매', '컨설팅', '후원 시스템', '제휴 마케팅', '전자책', '멤버십 운영']),
  },
  {
    id: 6, icon: '🎨', title: '브랜딩', sub: 'Identity', color: '#ff2d78',
    children: makeChildren(6, ['로고 제작', '컬러 팔레트', '폰트 가이드', '인트로 영상', '채널 아트', '음악 브랜딩', 'SNS 통합', '인식도 측정']),
  },
  {
    id: 7, icon: '👥', title: '커뮤니티', sub: 'Community', color: '#00ffd5',
    children: makeChildren(7, ['커뮤니티 탭 운영', '라이브 일정', '시청자 Q&A', '댓글 관리', '멤버십 혜택', '뉴스레터', '오프라인 모임', '팬 콘텐츠']),
  },
  {
    id: 8, icon: '🤖', title: '자동화', sub: 'Automation', color: '#ff2d78',
    children: makeChildren(8, ['스케줄링 봇', '자막 자동화', '썸네일 AI', '분석 대시보드', '업로드 자동화', '댓글 알림', 'CRM 연동', '보고서 자동화']),
  },
]

export const INITIAL_TIME_BLOCKS = [
  { id: 1,  s: 5,  e: 6,  label: '모닝 명상 · 사주 연구',  color: '#bf5fff' },
  { id: 2,  s: 6,  e: 8,  label: '모닝 루틴 · 독서',       color: '#00ff88' },
  { id: 3,  s: 8,  e: 12, label: '🔥 유튜브 기계 가동',    color: '#ff2d78' },
  { id: 4,  s: 12, e: 13, label: '점심 충전',               color: '#555577' },
  { id: 5,  s: 13, e: 15, label: '⚡ 사주 시스템 튜닝',    color: '#00d4ff' },
  { id: 6,  s: 15, e: 17, label: '콘텐츠 배포 · 분석',     color: '#ff7b00' },
  { id: 7,  s: 17, e: 18, label: '💰 수익 검토 · 전략',    color: '#ffd700' },
  { id: 8,  s: 18, e: 20, label: '자유 시간',               color: '#333355' },
  { id: 9,  s: 20, e: 22, label: '🔴 라이브 · 커뮤니티',   color: '#ff2d78' },
  { id: 10, s: 22, e: 24, label: '정산 · 내일 준비',        color: '#00ffd5' },
]

export const INITIAL_KANBAN = {
  scripting: [
    { id: 1, title: 'EP.12 자오묘유 사주 완전분석', priority: 'high', time: '3h' },
    { id: 2, title: '무토 황제 완전 가이드',          priority: 'high', time: '4h' },
    { id: 3, title: '2025 운세 예측 특집편',          priority: 'med',  time: '2h' },
  ],
  editing: [
    { id: 4, title: 'EP.10 일주론 완전정복',          priority: 'high', time: '5h' },
    { id: 5, title: '사주 vs 타로 대결편',            priority: 'med',  time: '3h' },
  ],
  done: [
    { id: 6, title: 'EP.8 무토일주 특성',             priority: 'done', time: '완료' },
    { id: 7, title: 'EP.9 재성 발동 시점',            priority: 'done', time: '완료' },
  ],
}

export const KANBAN_COLS = [
  { key: 'scripting', label: '대본 작성',  icon: '✍️', color: '#00d4ff', next: 'editing' },
  { key: 'editing',   label: '영상 편집',  icon: '🎬', color: '#ff2d78', next: 'done'    },
  { key: 'done',      label: '업로드 완료',icon: '✅', color: '#00ff88', next: null       },
]

export const PRIORITY_COLORS = {
  high: '#ff2d78',
  med:  '#ffd700',
  done: '#00ff8866',
  low:  '#555577',
}

export const TABS = [
  { id: 'dashboard',    label: '대시보드',     icon: '🏠' },
  { id: 'mandalart',    label: '만다라트',     icon: '◈'  },
  { id: 'timeblocker',  label: '타임블로킹',   icon: '⏱'  },
  { id: 'kanban',       label: '칸반보드',     icon: '📋' },
  { id: 'performance',  label: '실적대시보드', icon: '📊' },
]
