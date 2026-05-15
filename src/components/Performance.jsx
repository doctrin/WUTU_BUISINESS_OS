import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

const GHOST_REVENUE = [
  { w: 'W1', r: 85, t: 100 },
  { w: 'W2', r: 92, t: 105 },
  { w: 'W3', r: 105, t: 110 },
  { w: 'W4', r: 118, t: 115 },
  { w: 'W5', r: 125, t: 120 },
  { w: 'W6', r: 140, t: 130 },
  { w: 'W7', r: 132, t: 135 },
  { w: 'W8', r: 158, t: 145 },
]

const GHOST_PIE = [
  { name: '유튜브',      value: 42, color: '#ff2d7855' },
  { name: '사주 블로그', value: 28, color: '#00d4ff55' },
  { name: '인스타그램',  value: 15, color: '#bf5fff55' },
  { name: '카카오채널',  value: 10, color: '#ffd70055' },
  { name: '기타',        value: 5,  color: '#44446655' },
]

const FEATURES = [
  '채널 구독자 수 실시간 조회',
  '영상별 조회수 및 수익 분석',
  '트래픽 유입 경로 파이 차트',
  '주별 수익 추이 그래프',
  '최적 업로드 시간대 분석',
]

export default function Performance() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px',
        gap: 20,
        overflowY: 'auto',
      }}
    >
      {/* Section title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 3,
            height: 20,
            borderRadius: 2,
            background: '#00ff88',
            boxShadow: '0 0 8px #00ff88',
          }}
        />
        <span
          className="orbitron"
          style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#00ff88' }}
        >
          📊 실적 &amp; 자산 대시보드
        </span>
        <span style={{ fontSize: 11, color: '#555577', letterSpacing: '0.04em' }}>
          / PERFORMANCE
        </span>
      </div>

      {/* Main placeholder card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #09091e, #070712)',
          border: '1px solid #1a1a40',
          borderRadius: 14,
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 4 }}>📊</div>
        <h2
          className="orbitron"
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: '#e0e0f0',
            letterSpacing: '0.06em',
            textAlign: 'center',
          }}
        >
          YouTube API 연동 준비 중
        </h2>
        <p style={{ fontSize: 13, color: '#555577', textAlign: 'center', maxWidth: 480, lineHeight: 1.7 }}>
          유튜브 채널 통계, 수익 데이터, 구독자 분석이 이곳에 표시됩니다.
        </p>
        <div
          style={{
            background: '#00d4ff18',
            border: '1px solid #00d4ff44',
            borderRadius: 20,
            padding: '5px 16px',
            fontSize: 11,
            color: '#00d4ff',
            fontWeight: 700,
            letterSpacing: '0.08em',
            fontFamily: 'Orbitron, monospace',
            marginTop: 4,
          }}
        >
          개발 예정
        </div>
      </div>

      {/* Ghost charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 280px',
          gap: 14,
          opacity: 0.22,
          pointerEvents: 'none',
          flexShrink: 0,
        }}
      >
        {/* Ghost area chart */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0d0d2b, #09091e)',
            border: '1px solid #1a1a40',
            borderRadius: 10,
            padding: '14px',
            height: 200,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            className="orbitron"
            style={{ fontSize: 11, color: '#00ff88', letterSpacing: '0.09em', marginBottom: 10 }}
          >
            주별 매출 추이 (만원)
          </div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GHOST_REVENUE} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="ghostGR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a40" />
                <XAxis dataKey="w" tick={{ fill: '#555577', fontSize: 10 }} axisLine={{ stroke: '#1a1a40' }} tickLine={false} />
                <YAxis tick={{ fill: '#555577', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="r" stroke="#00ff88" strokeWidth={2} fill="url(#ghostGR)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ghost pie */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0d0d2b, #09091e)',
            border: '1px solid #1a1a40',
            borderRadius: 10,
            padding: '14px',
            height: 200,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            className="orbitron"
            style={{ fontSize: 11, color: '#ff2d78', letterSpacing: '0.09em', marginBottom: 10 }}
          >
            트래픽 유입 경로
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 120, height: 120, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={GHOST_PIE}
                    cx="50%"
                    cy="50%"
                    innerRadius="38%"
                    outerRadius="62%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {GHOST_PIE.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {GHOST_PIE.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: '#555577', flex: 1 }}>{item.name}</span>
                  <span className="orbitron" style={{ fontSize: 11, color: item.color }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature list */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d0d2b, #09091e)',
          border: '1px solid #1a1a40',
          borderRadius: 12,
          padding: '20px 22px',
          flexShrink: 0,
        }}
      >
        <div
          className="orbitron"
          style={{ fontSize: 12, color: '#555577', letterSpacing: '0.1em', marginBottom: 14 }}
        >
          현재 지원 예정 기능
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FEATURES.map((feat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#00d4ff',
                  boxShadow: '0 0 6px #00d4ff',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: '#8888bb' }}>{feat}</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 10,
                  color: '#333355',
                  fontFamily: 'Orbitron, monospace',
                  letterSpacing: '0.06em',
                }}
              >
                COMING SOON
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
