import React from 'react'

const TAB_COLORS = {
  dashboard:   '#ffd700',
  mandalart:   '#ffd700',
  timeblocker: '#ff2d78',
  kanban:      '#00d4ff',
  performance: '#00ff88',
}

export default function TabNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'stretch',
        borderBottom: '1px solid #1a1a40',
        background: '#09091e',
        flexShrink: 0,
        height: 44,
        paddingLeft: 8,
        gap: 2,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const color = TAB_COLORS[tab.id] || '#e0e0f0'
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '0 18px',
              background: isActive ? `${color}0e` : 'transparent',
              border: 'none',
              borderBottom: isActive ? `2px solid ${color}` : '2px solid transparent',
              cursor: 'pointer',
              color: isActive ? color : '#555577',
              fontSize: 12,
              fontWeight: isActive ? 700 : 500,
              fontFamily: 'inherit',
              letterSpacing: '0.04em',
              transition: 'color 0.2s, background 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#a0a0cc'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = '#555577'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <span style={{ fontSize: 14 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
