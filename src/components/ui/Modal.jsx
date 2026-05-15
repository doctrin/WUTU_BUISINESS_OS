import React, { useEffect, useRef } from 'react'

export default function Modal({ isOpen, onClose, title, children, width = 480 }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.18s ease',
      }}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width,
          maxWidth: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #0d0d2b, #09091e)',
          border: '1px solid #1a1a40',
          borderRadius: 12,
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,215,0,0.06)',
          animation: 'slideIn 0.22s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid #1a1a40',
          }}
        >
          <span
            className="orbitron"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#e0e0f0',
              letterSpacing: '0.06em',
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'transparent',
              border: '1px solid #1a1a40',
              color: '#555577',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a1a40'
              e.currentTarget.style.color = '#e0e0f0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#555577'
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px' }}>{children}</div>
      </div>
    </div>
  )
}
