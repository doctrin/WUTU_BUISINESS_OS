import React, { useState, useEffect } from 'react'

const ENGINES = [
  { k: '자(子)', c: '#00d4ff', label: '수(水)엔진' },
  { k: '오(午)', c: '#ff2d78', label: '화(火)엔진' },
  { k: '묘(卯)', c: '#00ff88', label: '목(木)엔진' },
  { k: '유(酉)', c: '#ffd700', label: '금(金)엔진' },
]

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

function fmtTime(d) {
  return d.toTimeString().slice(0, 8)
}

function fmtDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day} (${DAYS[d.getDay()]}요일)`
}

export default function Header() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #0d0d2b, #09091e)',
        border: '1px solid #1e1e48',
        borderRadius: 10,
        padding: '11px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 0 30px rgba(255,215,0,0.07)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        height: 72,
      }}
    >
      {/* Scanline */}
      <div className="scanline" />

      {/* Subtle radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 50% -80%, rgba(255,215,0,0.07), transparent 65%)',
        }}
      />

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 10,
            flexShrink: 0,
            background: 'linear-gradient(135deg, #1a1000, #1a0800)',
            border: '2px solid #ffd70066',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            boxShadow: '0 0 18px rgba(255,215,0,0.45)',
          }}
        >
          👑
        </div>
        <div>
          <div
            className="orbitron grad-text"
            style={{
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: '0.06em',
              lineHeight: 1,
            }}
          >
            WUTU BUSINESS OS
          </div>
          <div
            className="orbitron"
            style={{
              fontSize: 10,
              color: '#444466',
              letterSpacing: '0.22em',
              marginTop: 4,
            }}
          >
            황제의 관제탑 · EMPEROR'S CONTROL TOWER
          </div>
        </div>
      </div>

      {/* 4 Engine indicators */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          position: 'relative',
          background: 'rgba(5,5,18,0.5)',
          border: '1px solid #1a1a40',
          borderRadius: 8,
          padding: '8px 20px',
        }}
      >
        {ENGINES.map((item, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: item.c,
                boxShadow: `0 0 10px ${item.c}`,
                margin: '0 auto 5px',
                animation: `statusPulse ${1.6 + i * 0.3}s ease-in-out infinite`,
              }}
            />
            <div
              className="orbitron"
              style={{ fontSize: 11, color: item.c, letterSpacing: '0.04em' }}
            >
              {item.k}
            </div>
            <div style={{ fontSize: 9, color: '#444466', marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Clock */}
      <div style={{ textAlign: 'right', position: 'relative' }}>
        <div
          className="orbitron"
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#ffd700',
            lineHeight: 1,
            textShadow: '0 0 24px rgba(255,215,0,0.55)',
          }}
        >
          {fmtTime(now)}
        </div>
        <div style={{ fontSize: 12, color: '#555577', marginTop: 5, letterSpacing: '0.05em' }}>
          {fmtDate(now)}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            justifyContent: 'flex-end',
            marginTop: 3,
          }}
        >
          <div
            className="blink"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#00ff88',
              boxShadow: '0 0 7px #00ff88',
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: '#00ff88',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}
          >
            LIVE
          </span>
        </div>
      </div>
    </header>
  )
}
