import React, { useState, useEffect, useRef, useCallback } from 'react'
import Modal from './ui/Modal.jsx'
import { MIN_HOUR, MAX_HOUR, TOTAL_HOURS, BLOCK_COLORS } from '../constants.js'

function generateTimeOptions(from = MIN_HOUR, to = MAX_HOUR) {
  const options = []
  for (let h = from; h <= to; h += 0.5) {
    const hours = Math.floor(h)
    const mins = h % 1 === 0 ? '00' : '30'
    options.push({
      value: h,
      label: `${String(hours).padStart(2, '0')}:${mins}`,
    })
  }
  return options
}

const START_OPTIONS = generateTimeOptions(MIN_HOUR, MAX_HOUR - 0.5)
const END_OPTIONS   = generateTimeOptions(MIN_HOUR + 0.5, MAX_HOUR)

function formatHour(h) {
  const hours = Math.floor(h)
  const mins = h % 1 === 0 ? '00' : '30'
  return `${String(hours).padStart(2, '0')}:${mins}`
}

export default function TimeBlocker({ blocks, setBlocks }) {
  const containerRef = useRef(null)
  const [dragging, setDragging] = useState(null)
  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date()
    return d.getHours() + d.getMinutes() / 60
  })

  // Edit/add modal state
  const [modal, setModal] = useState({ open: false, mode: 'add', block: null })
  const [form, setForm] = useState({ label: '', s: 8, e: 9, color: BLOCK_COLORS[0] })
  const [formError, setFormError] = useState('')
  const clickStartRef = useRef(null)

  // Update current time every minute
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date()
      setCurrentTime(d.getHours() + d.getMinutes() / 60)
    }, 60000)
    return () => clearInterval(t)
  }, [])

  // Drag logic
  const handleBlockMouseDown = useCallback(
    (e, block) => {
      e.preventDefault()
      e.stopPropagation()
      clickStartRef.current = Date.now()
      const rect = containerRef.current.getBoundingClientRect()
      const blockTopPx = ((block.s - MIN_HOUR) / TOTAL_HOURS) * rect.height
      const offsetPx = e.clientY - rect.top - blockTopPx
      setDragging({ id: block.id, duration: block.e - block.s, offsetPx })
    },
    []
  )

  useEffect(() => {
    if (!dragging) return

    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const relY = e.clientY - rect.top - dragging.offsetPx
      const pct = Math.max(0, Math.min(1, relY / rect.height))
      const rawHour = MIN_HOUR + pct * TOTAL_HOURS
      const newStart = Math.round(rawHour * 2) / 2
      const newEnd = newStart + dragging.duration
      if (newStart >= MIN_HOUR && newEnd <= MAX_HOUR) {
        setBlocks((prev) =>
          prev.map((b) => (b.id === dragging.id ? { ...b, s: newStart, e: newEnd } : b))
        )
      }
    }

    const handleMouseUp = () => {
      setDragging(null)
      document.body.style.cursor = ''
    }

    document.body.style.cursor = 'grabbing'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [dragging, setBlocks])

  const openAdd = (clickedHour) => {
    const s = Math.max(MIN_HOUR, Math.min(MAX_HOUR - 1, Math.round(clickedHour * 2) / 2))
    const e = Math.min(MAX_HOUR, s + 1)
    setForm({ label: '', s, e, color: BLOCK_COLORS[0] })
    setFormError('')
    setModal({ open: true, mode: 'add', block: null })
  }

  const openEdit = (block) => {
    setForm({ label: block.label, s: block.s, e: block.e, color: block.color })
    setFormError('')
    setModal({ open: true, mode: 'edit', block })
  }

  const closeModal = () => setModal((m) => ({ ...m, open: false }))

  const checkOverlap = (s, e, excludeId = null) => {
    return blocks.some((b) => {
      if (b.id === excludeId) return false
      return s < b.e && e > b.s
    })
  }

  const handleSave = () => {
    if (!form.label.trim()) { setFormError('레이블을 입력하세요.'); return }
    if (form.s >= form.e) { setFormError('종료 시간이 시작 시간보다 늦어야 합니다.'); return }
    const excludeId = modal.mode === 'edit' ? modal.block.id : null
    if (checkOverlap(form.s, form.e, excludeId)) { setFormError('다른 블록과 시간이 겹칩니다.'); return }

    if (modal.mode === 'add') {
      setBlocks((prev) => [...prev, { id: Date.now(), ...form }])
    } else {
      setBlocks((prev) => prev.map((b) => (b.id === modal.block.id ? { ...b, ...form } : b)))
    }
    closeModal()
  }

  const handleDelete = () => {
    setBlocks((prev) => prev.filter((b) => b.id !== modal.block.id))
    closeModal()
  }

  const handleContainerClick = (e) => {
    if (e.target !== containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relY = e.clientY - rect.top
    const clickedHour = MIN_HOUR + (relY / rect.height) * TOTAL_HOURS
    openAdd(clickedHour)
  }

  const handleBlockClick = (e, block) => {
    e.stopPropagation()
    const elapsed = Date.now() - (clickStartRef.current || 0)
    if (elapsed < 200) {
      openEdit(block)
    }
  }

  const showCurrentTime = currentTime >= MIN_HOUR && currentTime <= MAX_HOUR
  const currentTimePct = ((currentTime - MIN_HOUR) / TOTAL_HOURS) * 100

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 20px',
        gap: 12,
        overflowY: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 3,
            height: 20,
            borderRadius: 2,
            background: '#ff2d78',
            boxShadow: '0 0 8px #ff2d78',
          }}
        />
        <span
          className="orbitron"
          style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#ff2d78' }}
        >
          ⏱ 타임 블로킹
        </span>
        <span style={{ fontSize: 11, color: '#555577', letterSpacing: '0.04em' }}>
          / TIME BLOCKING
        </span>
        <button
          onClick={() => openAdd(8)}
          style={{
            marginLeft: 'auto',
            background: 'linear-gradient(135deg, #ff2d7820, #09091e)',
            border: '1px solid #ff2d7844',
            borderRadius: 6,
            padding: '5px 14px',
            color: '#ff2d78',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + 블록 추가
        </button>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, display: 'flex', gap: 8, minHeight: 0 }}>
        {/* Hour axis */}
        <div style={{ width: 40, flexShrink: 0, position: 'relative' }}>
          {Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => i + MIN_HOUR).map((h) => (
            <div
              key={h}
              style={{
                position: 'absolute',
                top: `${((h - MIN_HOUR) / TOTAL_HOURS) * 100}%`,
                right: 0,
                fontSize: 11,
                color: '#444466',
                fontFamily: 'Orbitron, monospace',
                transform: 'translateY(-50%)',
                paddingRight: 6,
                whiteSpace: 'nowrap',
              }}
            >
              {String(h).padStart(2, '0')}
            </div>
          ))}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: 1,
              background: '#1a1a40',
            }}
          />
        </div>

        {/* Block container */}
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          style={{
            flex: 1,
            position: 'relative',
            cursor: dragging ? 'grabbing' : 'default',
            minHeight: 600,
          }}
        >
          {/* Hour grid lines */}
          {Array.from({ length: TOTAL_HOURS }, (_, i) => i + 1).map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${(i / TOTAL_HOURS) * 100}%`,
                height: 1,
                background: 'rgba(26,26,64,0.6)',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Half-hour grid lines */}
          {Array.from({ length: TOTAL_HOURS }, (_, i) => i).map((i) => (
            <div
              key={`h${i}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${((i + 0.5) / TOTAL_HOURS) * 100}%`,
                height: 1,
                background: 'rgba(26,26,64,0.3)',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Time blocks */}
          {blocks.map((block) => {
            const topPct = ((block.s - MIN_HOUR) / TOTAL_HOURS) * 100
            const htPct = ((block.e - block.s) / TOTAL_HOURS) * 100
            const isHi = block.e - block.s >= 2
            const isDraggingThis = dragging?.id === block.id

            return (
              <div
                key={block.id}
                className="t-block"
                onMouseDown={(e) => handleBlockMouseDown(e, block)}
                onClick={(e) => handleBlockClick(e, block)}
                style={{
                  position: 'absolute',
                  top: `${topPct}%`,
                  height: `${htPct}%`,
                  left: 0,
                  right: 0,
                  background: block.color + '28',
                  border: `1px solid ${block.color}44`,
                  borderLeft: `4px solid ${block.color}`,
                  borderRadius: 6,
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: isDraggingThis ? 'grabbing' : 'grab',
                  overflow: 'hidden',
                  boxShadow: isHi ? `0 0 14px ${block.color}30` : 'none',
                  opacity: isDraggingThis ? 0.85 : 1,
                  transition: isDraggingThis ? 'none' : 'opacity 0.2s',
                  userSelect: 'none',
                  zIndex: isDraggingThis ? 10 : 1,
                }}
              >
                <span
                  style={{
                    fontSize: isHi ? 12 : 11,
                    fontWeight: isHi ? 700 : 500,
                    color: block.color,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    pointerEvents: 'none',
                  }}
                >
                  {block.label}
                </span>
                <span
                  className="orbitron"
                  style={{
                    fontSize: 10,
                    color: block.color + '99',
                    flexShrink: 0,
                    pointerEvents: 'none',
                  }}
                >
                  {block.e - block.s}h
                </span>
              </div>
            )
          })}

          {/* Current time indicator */}
          {showCurrentTime && (
            <div
              style={{
                position: 'absolute',
                top: `${currentTimePct}%`,
                left: 0,
                right: 0,
                pointerEvents: 'none',
                zIndex: 20,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: 2,
                  background: '#ff4444',
                  boxShadow: '0 0 8px #ff4444',
                  transform: 'translateY(-50%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: -4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#ff4444',
                  boxShadow: '0 0 10px #ff4444',
                }}
              />
              <div
                className="orbitron"
                style={{
                  position: 'absolute',
                  right: 4,
                  top: '50%',
                  transform: 'translateY(-100%)',
                  fontSize: 10,
                  color: '#ff4444',
                  background: '#050512',
                  padding: '1px 5px',
                  borderRadius: 3,
                }}
              >
                {formatHour(currentTime)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit / Add Modal */}
      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.mode === 'add' ? '+ 블록 추가' : '블록 편집'}
        width={420}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Label */}
          <div>
            <label style={labelStyle}>레이블</label>
            <input
              autoFocus
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="예: 유튜브 촬영"
              style={inputStyle}
            />
          </div>

          {/* Time row */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>시작 시간</label>
              <select
                value={form.s}
                onChange={(e) => {
                  const newS = parseFloat(e.target.value)
                  setForm((f) => ({ ...f, s: newS, e: Math.min(MAX_HOUR, Math.max(newS + 0.5, f.e)) }))
                }}
                style={selectStyle}
              >
                {START_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>종료 시간</label>
              <select
                value={form.e}
                onChange={(e) => setForm((f) => ({ ...f, e: parseFloat(e.target.value) }))}
                style={selectStyle}
              >
                {END_OPTIONS.filter((o) => o.value > form.s).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Color */}
          <div>
            <label style={labelStyle}>색상</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {BLOCK_COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: c,
                    cursor: 'pointer',
                    border: form.color === c ? '2.5px solid #fff' : '2.5px solid transparent',
                    boxShadow: form.color === c ? `0 0 10px ${c}` : 'none',
                    transition: 'box-shadow 0.15s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {formError && (
            <div style={{ fontSize: 12, color: '#ff4444', background: '#1a0000', border: '1px solid #ff444433', borderRadius: 5, padding: '6px 10px' }}>
              {formError}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            {modal.mode === 'edit' && (
              <button
                onClick={handleDelete}
                style={{
                  marginRight: 'auto',
                  background: '#1a0000',
                  border: '1px solid #ff444444',
                  borderRadius: 6,
                  color: '#ff4444',
                  padding: '7px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🗑 삭제
              </button>
            )}
            <button
              onClick={closeModal}
              style={{
                background: '#111133',
                border: '1px solid #1a1a40',
                borderRadius: 6,
                color: '#555577',
                padding: '7px 16px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #ff2d7820, #09091e)',
                border: '1px solid #ff2d7855',
                borderRadius: 6,
                color: '#ff2d78',
                padding: '7px 20px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              저장
            </button>
          </div>
        </div>
      </Modal>
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

const selectStyle = {
  width: '100%',
  background: '#09091e',
  border: '1px solid #1a1a40',
  borderRadius: 6,
  padding: '8px 10px',
  color: '#e0e0f0',
  fontSize: 13,
  fontFamily: 'Orbitron, monospace',
  cursor: 'pointer',
}
