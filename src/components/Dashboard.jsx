import React from 'react'
import { MIN_HOUR, TOTAL_HOURS, KANBAN_COLS } from '../constants.js'

const MOTIVATIONAL = [
  '황제는 오늘도 전진한다 👑',
  '자동화가 제국을 만든다 ⚡',
  '콘텐츠가 곧 자산이다 🎬',
  '멈추지 않는 기계가 돼라 🔥',
]

export default function Dashboard({ mandala, timeBlocks, kanban }) {
  const today = new Date()
  const dayStr = today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })

  const inProgressCount = (kanban.scripting?.length || 0) + (kanban.editing?.length || 0)
  const scheduledHours = (timeBlocks || []).reduce((sum, b) => sum + (b.e - b.s), 0)
  const mandalaFilled = (mandala || []).filter((c) => c.title && c.title.trim() !== '').length
  const motivational = MOTIVATIONAL[today.getDay() % MOTIVATIONAL.length]

  return (
    <div
      style={{
        height: '100%',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        overflowY: 'auto',
      }}
    >
      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 3, height: 20, borderRadius: 2, background: '#ffd700', boxShadow: '0 0 8px #ffd700' }} />
        <span className="orbitron" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#ffd700' }}>
          🏠 오버뷰 대시보드
        </span>
        <span style={{ fontSize: 11, color: '#555577', letterSpacing: '0.04em' }}>/ OVERVIEW</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#444466' }}>{dayStr}</span>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, flexShrink: 0 }}>
        <StatCard label="진행 중인 태스크" value={inProgressCount} unit="개" color="#ff2d78" icon="⚡" />
        <StatCard label="오늘 스케줄" value={scheduledHours} unit="h" color="#00d4ff" icon="⏱" />
        <StatCard label="만다라트 목표" value={mandalaFilled} unit="/ 9" color="#ffd700" icon="◈" />
        <StatCard label="완료 컨텐츠" value={kanban.done?.length || 0} unit="편" color="#00ff88" icon="✅" />
      </div>

      {/* 2×2 preview grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 14, flex: 1, minHeight: 0 }}>
        {/* Mini Mandalart */}
        <PreviewCard title="만다라트 기획 매트릭스" color="#ffd700" icon="◈">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, flex: 1 }}>
            {(mandala || []).map((cell) => (
              <div
                key={cell.id}
                style={{
                  background: cell.isCenter ? 'linear-gradient(135deg,#1a0d00,#100d00)' : '#0a0a22',
                  border: `1px solid ${cell.isCenter ? '#ffd700' : cell.color + '44'}`,
                  borderRadius: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 3px',
                  textAlign: 'center',
                  minHeight: 0,
                }}
              >
                <div style={{ fontSize: 13 }}>{cell.icon}</div>
                <div
                  style={{
                    fontSize: 9,
                    color: cell.isCenter ? '#ffd700' : cell.color,
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginTop: 2,
                  }}
                >
                  {cell.title.length > 5 ? cell.title.slice(0, 5) + '…' : cell.title}
                </div>
              </div>
            ))}
          </div>
        </PreviewCard>

        {/* Mini TimeBlocker */}
        <PreviewCard title="오늘의 타임블로킹" color="#ff2d78" icon="⏱">
          <div style={{ flex: 1, position: 'relative', display: 'flex', gap: 6, minHeight: 0 }}>
            {/* hour axis */}
            <div style={{ width: 28, flexShrink: 0, position: 'relative' }}>
              {[5, 9, 13, 17, 21, 24].map((h) => (
                <div
                  key={h}
                  style={{
                    position: 'absolute',
                    top: `${((h - MIN_HOUR) / TOTAL_HOURS) * 100}%`,
                    right: 2,
                    fontSize: 9,
                    color: '#333355',
                    fontFamily: 'Orbitron, monospace',
                    transform: 'translateY(-50%)',
                  }}
                >
                  {String(h).padStart(2, '0')}
                </div>
              ))}
              <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 1, background: '#1a1a40' }} />
            </div>
            {/* blocks */}
            <div style={{ flex: 1, position: 'relative' }}>
              {(timeBlocks || []).map((b) => {
                const topPct = ((b.s - MIN_HOUR) / TOTAL_HOURS) * 100
                const htPct = ((b.e - b.s) / TOTAL_HOURS) * 100
                return (
                  <div
                    key={b.id}
                    style={{
                      position: 'absolute',
                      top: `${topPct}%`,
                      height: `${htPct}%`,
                      left: 0,
                      right: 0,
                      background: b.color + '33',
                      borderLeft: `3px solid ${b.color}`,
                      borderRadius: 3,
                      padding: '2px 4px',
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{ fontSize: 9, color: b.color, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {b.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </PreviewCard>

        {/* Mini Kanban */}
        <PreviewCard title="칸반 보드 현황" color="#00d4ff" icon="📋">
          <div style={{ display: 'flex', gap: 8, flex: 1, minHeight: 0 }}>
            {KANBAN_COLS.map((col) => {
              const cards = kanban[col.key] || []
              return (
                <div
                  key={col.key}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      borderBottom: `2px solid ${col.color}`,
                      paddingBottom: 5,
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 11 }}>{col.icon}</span>
                    <span style={{ fontSize: 9, color: col.color, fontWeight: 700, fontFamily: 'Orbitron, monospace' }}>
                      {col.label}
                    </span>
                    <div
                      style={{
                        marginLeft: 'auto',
                        background: col.color + '28',
                        color: col.color,
                        borderRadius: 8,
                        padding: '1px 6px',
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {cards.length}
                    </div>
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {cards.slice(0, 4).map((card) => (
                      <div
                        key={card.id}
                        style={{
                          fontSize: 10,
                          color: col.key === 'done' ? '#3a5a3a' : '#888899',
                          background: '#0a0a22',
                          borderRadius: 4,
                          padding: '3px 6px',
                          borderLeft: `2px solid ${col.color}55`,
                          textDecoration: col.key === 'done' ? 'line-through' : 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {card.title}
                      </div>
                    ))}
                    {cards.length > 4 && (
                      <div style={{ fontSize: 9, color: '#333355', textAlign: 'center' }}>
                        +{cards.length - 4}개 더
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </PreviewCard>

        {/* Stats summary */}
        <PreviewCard title="황제 현황 요약" color="#00ff88" icon="📊">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            <SummaryRow
              label="진행 중인 프로젝트"
              value={`${inProgressCount}개`}
              color="#ff2d78"
            />
            <SummaryRow
              label="오늘 스케줄된 작업"
              value={`${scheduledHours}시간`}
              color="#00d4ff"
            />
            <SummaryRow
              label="만다라트 목표 달성"
              value={`${mandalaFilled} / 9`}
              color="#ffd700"
            />
            <SummaryRow
              label="완료된 콘텐츠"
              value={`${kanban.done?.length || 0}편`}
              color="#00ff88"
            />
            <div
              style={{
                marginTop: 'auto',
                background: 'linear-gradient(135deg, #0d1a0d, #090d09)',
                border: '1px solid #00ff8822',
                borderRadius: 8,
                padding: '10px 12px',
                fontSize: 12,
                color: '#00ff88',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {motivational}
            </div>
          </div>
        </PreviewCard>
      </div>
    </div>
  )
}

function StatCard({ label, value, unit, color, icon }) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}0a, #09091e)`,
        border: `1px solid ${color}30`,
        borderRadius: 10,
        padding: '12px 14px',
        boxShadow: `0 0 14px ${color}14`,
      }}
    >
      <div style={{ fontSize: 11, color: '#555577', marginBottom: 6, fontWeight: 500 }}>
        {icon} {label}
      </div>
      <div
        className="orbitron"
        style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}
      >
        {value}
        <span style={{ fontSize: 13, fontWeight: 500, marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  )
}

function PreviewCard({ title, color, icon, children }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0d0d2b, #09091e)',
        border: `1px solid ${color}22`,
        borderRadius: 10,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div
          style={{
            width: 3,
            height: 16,
            borderRadius: 2,
            background: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
        <span
          className="orbitron"
          style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.08em' }}
        >
          {icon} {title}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

function SummaryRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 12, color: '#555577' }}>{label}</span>
      <span
        className="orbitron"
        style={{ fontSize: 13, fontWeight: 700, color }}
      >
        {value}
      </span>
    </div>
  )
}
