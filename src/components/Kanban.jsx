import React, { useState, useRef, useEffect } from 'react'
import Modal from './ui/Modal.jsx'
import { KANBAN_COLS, PRIORITY_COLORS } from '../constants.js'

const DELAY_OPTIONS = [
  { value: 5,   label: '5초' },
  { value: 30,  label: '30초' },
  { value: 60,  label: '1분' },
  { value: 300, label: '5분' },
  { value: 600, label: '10분' },
]

export default function Kanban({ cards, setCards, settings, setSettings }) {
  const [input, setInput] = useState('')
  const [editModal, setEditModal] = useState({ open: false, card: null, colKey: null })
  const [adminModal, setAdminModal] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', time: '', priority: 'med' })
  const [adminForm, setAdminForm] = useState({ autoRemove: false, autoRemoveDelay: 30 })
  const timeoutIds = useRef({})

  useEffect(() => {
    return () => {
      Object.values(timeoutIds.current).forEach(clearTimeout)
    }
  }, [])

  const addCard = () => {
    if (!input.trim()) return
    const newCard = { id: Date.now(), title: input.trim(), priority: 'med', time: '2h' }
    setCards((prev) => ({ ...prev, scripting: [newCard, ...prev.scripting] }))
    setInput('')
  }

  const moveCard = (cardId, fromKey) => {
    const col = KANBAN_COLS.find((c) => c.key === fromKey)
    if (!col || !col.next) return
    const card = cards[fromKey].find((c) => c.id === cardId)
    if (!card) return

    const updatedCard = {
      ...card,
      priority: col.next === 'done' ? 'done' : card.priority,
    }

    setCards((prev) => ({
      ...prev,
      [fromKey]: prev[fromKey].filter((c) => c.id !== cardId),
      [col.next]: [...prev[col.next], updatedCard],
    }))

    // Auto-remove from done
    if (col.next === 'done' && settings.autoRemove) {
      const tid = setTimeout(() => {
        setCards((prev) => ({ ...prev, done: prev.done.filter((c) => c.id !== cardId) }))
        delete timeoutIds.current[cardId]
      }, settings.autoRemoveDelay * 1000)
      timeoutIds.current[cardId] = tid
    }
  }

  const deleteCard = (cardId, colKey) => {
    if (timeoutIds.current[cardId]) {
      clearTimeout(timeoutIds.current[cardId])
      delete timeoutIds.current[cardId]
    }
    setCards((prev) => ({ ...prev, [colKey]: prev[colKey].filter((c) => c.id !== cardId) }))
  }

  const openEdit = (card, colKey) => {
    setEditForm({ title: card.title, time: card.time, priority: card.priority })
    setEditModal({ open: true, card, colKey })
  }

  const saveEdit = () => {
    const { card, colKey } = editModal
    setCards((prev) => ({
      ...prev,
      [colKey]: prev[colKey].map((c) =>
        c.id === card.id ? { ...c, ...editForm } : c
      ),
    }))
    setEditModal({ open: false, card: null, colKey: null })
  }

  const openAdmin = () => {
    setAdminForm({ autoRemove: settings.autoRemove, autoRemoveDelay: settings.autoRemoveDelay })
    setAdminModal(true)
  }

  const saveAdmin = () => {
    setSettings(adminForm)
    setAdminModal(false)
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px',
        gap: 12,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 3,
            height: 20,
            borderRadius: 2,
            background: '#00d4ff',
            boxShadow: '0 0 8px #00d4ff',
          }}
        />
        <span
          className="orbitron"
          style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#00d4ff' }}
        >
          📋 칸반 보드
        </span>
        <span style={{ fontSize: 11, color: '#555577', letterSpacing: '0.04em' }}>
          / KANBAN BOARD
        </span>
        <button
          onClick={openAdmin}
          style={{
            marginLeft: 'auto',
            background: 'transparent',
            border: '1px solid #1a1a40',
            borderRadius: 6,
            color: '#555577',
            padding: '4px 12px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          ⚙️ 설정
        </button>
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCard()}
          placeholder="새 태스크 입력… (Enter로 추가)"
          style={{
            flex: 1,
            background: '#09091e',
            border: '1px solid #1a1a40',
            borderRadius: 6,
            padding: '7px 12px',
            color: '#ccccee',
            fontSize: 12,
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={addCard}
          style={{
            background: 'linear-gradient(135deg, #00d4ff18, #09091e)',
            border: '1px solid #00d4ff44',
            borderRadius: 6,
            padding: '7px 18px',
            color: '#00d4ff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + 추가
        </button>
      </div>

      {/* Columns */}
      <div style={{ display: 'flex', gap: 10, flex: 1, minHeight: 0 }}>
        {KANBAN_COLS.map((col) => {
          const colCards = cards[col.key] || []
          return (
            <div
              key={col.key}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
            >
              {/* Column header */}
              <div
                style={{
                  background: `${col.color}14`,
                  border: `1px solid ${col.color}30`,
                  borderBottom: `2px solid ${col.color}`,
                  borderRadius: '8px 8px 0 0',
                  padding: '9px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 14 }}>{col.icon}</span>
                <span
                  className="orbitron"
                  style={{ fontSize: 11, fontWeight: 700, color: col.color, letterSpacing: '0.06em' }}
                >
                  {col.label}
                </span>
                <div
                  style={{
                    marginLeft: 'auto',
                    background: `${col.color}28`,
                    color: col.color,
                    borderRadius: 10,
                    padding: '2px 9px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {colCards.length}
                </div>
              </div>

              {/* Card list */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  background: '#07071a',
                  border: `1px solid ${col.color}20`,
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  padding: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                }}
              >
                {colCards.map((card) => (
                  <KanbanCard
                    key={card.id}
                    card={card}
                    col={col}
                    onEdit={() => openEdit(card, col.key)}
                    onMove={() => moveCard(card.id, col.key)}
                    onDelete={() => deleteCard(card.id, col.key)}
                  />
                ))}
                {colCards.length === 0 && (
                  <div style={{ color: '#222244', textAlign: 'center', fontSize: 11, paddingTop: 20 }}>
                    — 비어있음 —
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, card: null, colKey: null })}
        title="태스크 편집"
        width={400}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>제목</label>
            <input
              autoFocus
              value={editForm.title}
              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>예상 시간</label>
            <input
              value={editForm.time}
              onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
              placeholder="예: 3h"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>우선순위</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { value: 'high', label: '높음', color: '#ff2d78' },
                { value: 'med',  label: '보통', color: '#ffd700' },
                { value: 'low',  label: '낮음', color: '#555577' },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setEditForm((f) => ({ ...f, priority: p.value }))}
                  style={{
                    flex: 1,
                    padding: '7px 0',
                    borderRadius: 6,
                    border: `1px solid ${editForm.priority === p.value ? p.color : '#1a1a40'}`,
                    background: editForm.priority === p.value ? `${p.color}20` : 'transparent',
                    color: editForm.priority === p.value ? p.color : '#555577',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button
              onClick={() => setEditModal({ open: false, card: null, colKey: null })}
              style={cancelBtnStyle}
            >
              취소
            </button>
            <button onClick={saveEdit} style={saveBtnStyle('#00d4ff')}>
              저장
            </button>
          </div>
        </div>
      </Modal>

      {/* Admin Settings Modal */}
      <Modal isOpen={adminModal} onClose={() => setAdminModal(false)} title="⚙️ 칸반 설정" width={400}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#c0c0e0', fontWeight: 500 }}>
              완료 카드 자동 제거
            </span>
            <Toggle
              value={adminForm.autoRemove}
              onChange={(v) => setAdminForm((f) => ({ ...f, autoRemove: v }))}
            />
          </div>

          {/* Delay selector */}
          {adminForm.autoRemove && (
            <div>
              <label style={labelStyle}>제거 지연 시간</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DELAY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAdminForm((f) => ({ ...f, autoRemoveDelay: opt.value }))}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: `1px solid ${adminForm.autoRemoveDelay === opt.value ? '#00ff88' : '#1a1a40'}`,
                      background: adminForm.autoRemoveDelay === opt.value ? '#00ff8820' : 'transparent',
                      color: adminForm.autoRemoveDelay === opt.value ? '#00ff88' : '#555577',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <button onClick={() => setAdminModal(false)} style={cancelBtnStyle}>
              취소
            </button>
            <button onClick={saveAdmin} style={saveBtnStyle('#00d4ff')}>
              저장
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function KanbanCard({ card, col, onEdit, onMove, onDelete }) {
  const pColor = PRIORITY_COLORS[card.priority] || '#555577'
  const isDone = col.key === 'done'

  return (
    <div
      className="k-card"
      style={{
        background: isDone ? '#070f07' : '#0d0d2b',
        border: `1px solid ${col.color}28`,
        borderRadius: 8,
        padding: '9px 11px',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={onEdit}
    >
      {/* Priority dot */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 34,
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: pColor,
          boxShadow: `0 0 6px ${pColor}`,
        }}
      />

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 22,
          height: 22,
          borderRadius: 4,
          background: 'transparent',
          border: '1px solid transparent',
          color: '#333355',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#1a0000'
          e.currentTarget.style.borderColor = '#ff444444'
          e.currentTarget.style.color = '#ff4444'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
          e.currentTarget.style.color = '#333355'
        }}
      >
        ×
      </button>

      {/* Title */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.45,
          color: isDone ? '#3a5a3a' : '#d0d0ee',
          textDecoration: isDone ? 'line-through' : 'none',
          paddingRight: 52,
          marginBottom: 7,
        }}
      >
        {card.title}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            fontSize: 10,
            color: '#555577',
            background: '#111133',
            padding: '2px 7px',
            borderRadius: 4,
          }}
        >
          ⏱ {card.time}
        </span>

        {col.next && (
          <button
            onClick={(e) => { e.stopPropagation(); onMove() }}
            style={{
              marginLeft: 'auto',
              background: `${col.color}20`,
              border: `1px solid ${col.color}50`,
              borderRadius: 4,
              padding: '3px 10px',
              color: col.color,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            → 이동
          </button>
        )}
      </div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: value ? '#00ff88' : '#1a1a40',
        border: `1px solid ${value ? '#00ff88' : '#2a2a55'}`,
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.25s, border-color 0.25s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: value ? 20 : 2,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.25s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      />
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  color: '#555577',
  marginBottom: 5,
  fontWeight: 500,
}

const inputStyle = {
  width: '100%',
  background: '#09091e',
  border: '1px solid #1a1a40',
  borderRadius: 6,
  padding: '8px 10px',
  color: '#e0e0f0',
  fontSize: 13,
  fontFamily: 'inherit',
}

const cancelBtnStyle = {
  background: '#111133',
  border: '1px solid #1a1a40',
  borderRadius: 6,
  color: '#555577',
  padding: '7px 16px',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
}

function saveBtnStyle(color) {
  return {
    background: `${color}20`,
    border: `1px solid ${color}55`,
    borderRadius: 6,
    color,
    padding: '7px 20px',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
  }
}
