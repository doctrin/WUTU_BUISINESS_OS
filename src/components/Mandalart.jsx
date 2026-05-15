import React, { useState, useRef, useCallback, useEffect } from 'react'

/* ─── 외부 헬퍼 ─────────────────────────────────────────────────────────────── */

function makeTodos(parentId, childIdx) {
  return Array.from({ length: 3 }, (_, ti) => ({
    id: `${parentId}_c${childIdx}_t${ti}`,
    text: `할 일 ${ti + 1}`,
    done: false,
  }))
}

function makeChildren(parentId) {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${parentId}_c${i}`,
    title: `세부 계획 ${i + 1}`,
    todos: makeTodos(parentId, i),
  }))
}

function getProgress(cell) {
  if (!cell.children?.length) return 0
  const total = cell.children.length * 3
  const done  = cell.children.reduce(
    (acc, ch) => acc + (ch.todos?.filter(t => t.done).length ?? 0), 0
  )
  return total ? Math.round((done / total) * 100) : 0
}

/* ─── 서브 컴포넌트: 공유 인라인 인풋 ──────────────────────────────────────── */

const InlineInput = React.forwardRef(function InlineInput(
  { value, onChange, onKeyDown, onBlur, placeholder, style },
  ref
) {
  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      placeholder={placeholder ?? '입력…'}
      onClick={e => e.stopPropagation()}
      autoComplete="off"
      style={{
        width: '100%',
        background: 'rgba(0,0,0,0.55)',
        border: '1px solid rgba(255,255,255,0.22)',
        borderRadius: 4,
        padding: '4px 7px',
        color: '#fff',
        fontSize: 12,
        fontFamily: 'inherit',
        outline: 'none',
        ...style,
      }}
    />
  )
})

/* ─── 서브 컴포넌트: 프로그레스 바 ─────────────────────────────────────────── */

function ProgressBar({ pct, color, showLabel = false }) {
  return (
    <div style={{ position: 'relative' }}>
      {showLabel && pct > 0 && (
        <div style={{
          textAlign: 'right',
          fontSize: 8,
          fontFamily: 'Orbitron, monospace',
          color,
          marginBottom: 2,
          opacity: 0.9,
        }}>
          {pct}%
        </div>
      )}
      <div style={{ height: 4, background: '#111133', borderRadius: 2 }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 2,
          background: pct === 100
            ? '#00ff88'
            : pct > 50
            ? `linear-gradient(90deg, ${color}, #00ff88)`
            : color,
          boxShadow: `0 0 6px ${color}88`,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

/* ─── 서브 컴포넌트: 체크박스 ───────────────────────────────────────────────── */

function Checkbox({ checked, color, onChange }) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange() }}
      style={{
        width: 14, height: 14, borderRadius: 3, flexShrink: 0,
        border: `1.5px solid ${checked ? color : '#2a2a55'}`,
        background: checked ? color + '33' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', marginTop: 1,
        transition: 'all 0.15s',
      }}
    >
      {checked && <span style={{ fontSize: 9, color, fontWeight: 900, lineHeight: 1 }}>✓</span>}
    </div>
  )
}

/* ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────── */

export default function Mandalart({ cells, setCells }) {
  // ── 뷰 상태 ────────────────────────────────────────────────────────────────
  const [currentParentId, setCurrentParentId] = useState(null)
  const [fading,          setFading]          = useState(false)

  // ── 인라인 편집 ────────────────────────────────────────────────────────────
  // key 형식: 'main_{id}' | 'child_{pid}_{cidx}' | 'todo_{pid}_{cidx}_{tidx}'
  const [editingKey, setEditingKey] = useState(null)
  const [editDraft,  setEditDraft]  = useState('')
  const inputRef = useRef(null)

  // ── hover ──────────────────────────────────────────────────────────────────
  const [hoveredId, setHoveredId] = useState(null)

  // ── children 마이그레이션 (기존 localStorage 데이터 대응) ─────────────────
  useEffect(() => {
    if (cells.some(c => !c.isCenter && !c.children)) {
      setCells(prev => prev.map(c =>
        c.isCenter || c.children ? c : { ...c, children: makeChildren(c.id) }
      ))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 네비게이션 ─────────────────────────────────────────────────────────────
  const navigate = useCallback((parentId) => {
    setEditingKey(null)
    setFading(true)
    setTimeout(() => { setCurrentParentId(parentId); setFading(false) }, 220)
  }, [])

  // ── 인라인 편집 커밋 ────────────────────────────────────────────────────────
  const commitEdit = useCallback(() => {
    if (!editingKey) return
    const text = editDraft.trim()
    if (!text) { setEditingKey(null); return }

    const parts = editingKey.split('_')
    const type  = parts[0]

    setCells(prev => prev.map(cell => {
      if (type === 'main') {
        return cell.id === parseInt(parts[1]) ? { ...cell, title: text } : cell
      }
      if (type === 'child') {
        if (cell.id !== parseInt(parts[1])) return cell
        const ci = parseInt(parts[2])
        return {
          ...cell,
          children: cell.children.map((ch, i) => i === ci ? { ...ch, title: text } : ch),
        }
      }
      if (type === 'todo') {
        if (cell.id !== parseInt(parts[1])) return cell
        const ci = parseInt(parts[2])
        const ti = parseInt(parts[3])
        return {
          ...cell,
          children: cell.children.map((ch, i) => {
            if (i !== ci) return ch
            return { ...ch, todos: ch.todos.map((t, j) => j === ti ? { ...t, text } : t) }
          }),
        }
      }
      return cell
    }))
    setEditingKey(null)
  }, [editingKey, editDraft, setCells])

  const startEdit = useCallback((key, value, e) => {
    e?.stopPropagation()
    setEditingKey(key)
    setEditDraft(value)
    requestAnimationFrame(() => { inputRef.current?.focus(); inputRef.current?.select() })
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter')  { e.preventDefault(); commitEdit() }
    if (e.key === 'Escape') { e.stopPropagation(); setEditingKey(null) }
  }, [commitEdit])

  // ── 할일 토글 ──────────────────────────────────────────────────────────────
  const toggleTodo = useCallback((parentId, ci, ti) => {
    setCells(prev => prev.map(cell => {
      if (cell.id !== parentId) return cell
      return {
        ...cell,
        children: cell.children.map((ch, i) => {
          if (i !== ci) return ch
          return { ...ch, todos: ch.todos.map((t, j) => j === ti ? { ...t, done: !t.done } : t) }
        }),
      }
    }))
  }, [setCells])

  // ── 파생 데이터 ────────────────────────────────────────────────────────────
  const parentCell = cells.find(c => c.id === currentParentId) ?? null

  // 서브 매트릭스 9칸 배열 (인덱스4 = 부모)
  const subItems = parentCell?.children
    ? [
        parentCell.children[0], parentCell.children[1], parentCell.children[2],
        parentCell.children[3], parentCell,              parentCell.children[4],
        parentCell.children[5], parentCell.children[6], parentCell.children[7],
      ]
    : []

  // 그리드 인덱스 → children 배열 인덱스
  const gridToChildIdx = (gi) => (gi < 4 ? gi : gi - 1)

  /* ── 렌더 ──────────────────────────────────────────────────────────────── */
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '14px 18px',
        gap: 10,
        overflow: 'hidden',
      }}
      onClick={() => { if (editingKey) commitEdit() }}
    >

      {/* ── 헤더 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {/* 뒤로가기 버튼 */}
        {currentParentId !== null && (
          <button
            onClick={e => { e.stopPropagation(); navigate(null) }}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: 'linear-gradient(135deg, rgba(255,215,0,0.12), #09091e)',
              border: '1px solid #ffd70060',
              borderRadius: 8, padding: '7px 16px',
              color: '#ffd700', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 0 12px rgba(255,215,0,0.15)',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(255,215,0,0.35)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(255,215,0,0.15)'}
          >
            ← 메인 관제탑으로
          </button>
        )}

        <div style={{
          width: 3, height: 20, borderRadius: 2,
          background: '#ffd700', boxShadow: '0 0 8px #ffd700', flexShrink: 0,
        }} />
        <span className="orbitron" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: '#ffd700' }}>
          {currentParentId !== null
            ? `◈ ${parentCell?.icon} ${parentCell?.title} — 하위 매트릭스`
            : '◈ 만다라트 기획 매트릭스'
          }
        </span>
        <span style={{ fontSize: 11, color: '#555577' }}>
          / {currentParentId !== null ? 'DRILL-DOWN' : 'MANDALART MATRIX'}
        </span>

        {currentParentId === null && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#333355' }}>
            주변 셀 클릭 → 드릴다운 │ 제목 클릭 → 인라인 편집
          </span>
        )}
      </div>

      {/* ── 브레드크럼 (드릴다운 시) ── */}
      {currentParentId !== null && parentCell && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
          fontSize: 11, padding: '6px 10px',
          background: '#0a0a22', borderRadius: 6,
          border: `1px solid ${parentCell.color}33`,
        }}>
          <span
            onClick={e => { e.stopPropagation(); navigate(null) }}
            style={{ color: '#ffd70099', cursor: 'pointer' }}
          >
            메인
          </span>
          <span style={{ color: '#333355' }}>›</span>
          <span style={{ color: parentCell.color, fontWeight: 600 }}>
            {parentCell.icon} {parentCell.title}
          </span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#444466' }}>전체 진행률</span>
            <span className="orbitron" style={{
              fontSize: 12, fontWeight: 700,
              color: getProgress(parentCell) === 100 ? '#00ff88' : parentCell.color,
            }}>
              {getProgress(parentCell)}%
            </span>
          </span>
        </div>
      )}

      {/* ── 3×3 그리드 ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows:    'repeat(3, 1fr)',
          gap: 8,
          flex: 1,
          minHeight: 0,
          opacity:   fading ? 0 : 1,
          transform: fading ? 'scale(0.96)' : 'scale(1)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
        }}
      >
        {currentParentId === null
          ? cells.map(cell => (
              <MainCell
                key={cell.id}
                cell={cell}
                editingKey={editingKey}
                editDraft={editDraft}
                inputRef={inputRef}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onStartEdit={startEdit}
                onDraftChange={setEditDraft}
                onKeyDown={handleKeyDown}
                onCommit={commitEdit}
                onDrillDown={navigate}
              />
            ))
          : subItems.map((item, gi) => (
              <SubCell
                key={item?.id ?? `g${gi}`}
                item={item}
                isCenter={gi === 4}
                childIdx={gridToChildIdx(gi)}
                parentCell={parentCell}
                editingKey={editingKey}
                editDraft={editDraft}
                inputRef={inputRef}
                onStartEdit={startEdit}
                onDraftChange={setEditDraft}
                onKeyDown={handleKeyDown}
                onCommit={commitEdit}
                onToggleTodo={toggleTodo}
              />
            ))
        }
      </div>
    </div>
  )
}

/* ─── MainCell 컴포넌트 ─────────────────────────────────────────────────────── */

function MainCell({
  cell, editingKey, editDraft, inputRef,
  hoveredId, setHoveredId,
  onStartEdit, onDraftChange, onKeyDown, onCommit, onDrillDown,
}) {
  const key        = `main_${cell.id}`
  const isEditing  = editingKey === key
  const isHovered  = hoveredId === key
  const progress   = cell.isCenter ? null : getProgress(cell)

  const borderColor = cell.isCenter
    ? '#ffd700'
    : isHovered ? cell.color : '#1a1a40'

  return (
    <div
      onMouseEnter={() => setHoveredId(key)}
      onMouseLeave={() => setHoveredId(null)}
      onClick={e => {
        if (!cell.isCenter && !isEditing) {
          e.stopPropagation()
          onDrillDown(cell.id)
        }
      }}
      style={{
        background: cell.isCenter
          ? 'linear-gradient(135deg, #1a0d00, #100d00, #0a1000)'
          : '#0a0a22',
        border: `${cell.isCenter ? 2 : 1.5}px solid ${borderColor}`,
        borderRadius: 8,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '8px 6px 14px',
        position: 'relative',
        overflow: 'hidden',
        cursor: cell.isCenter ? 'default' : 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        boxShadow: cell.isCenter
          ? '0 0 24px rgba(255,215,0,0.28), inset 0 0 18px rgba(255,215,0,0.06)'
          : isHovered ? `0 0 18px ${cell.color}44` : 'none',
        transform: isHovered && !cell.isCenter ? 'scale(1.03)' : 'scale(1)',
        zIndex: isHovered ? 5 : 1,
      }}
    >
      {/* 중앙 펄스링 */}
      {cell.isCenter && (
        <div className="pulse-ring" style={{
          position: 'absolute', inset: 3, borderRadius: 6,
          border: '1px solid rgba(255,215,0,0.28)', pointerEvents: 'none',
        }} />
      )}

      {/* 아이콘 */}
      <div style={{ fontSize: cell.isCenter ? 26 : 20, lineHeight: 1, marginBottom: 6, userSelect: 'none' }}>
        {cell.icon}
      </div>

      {/* 제목 (인라인 편집) */}
      {isEditing ? (
        <InlineInput
          ref={inputRef}
          value={editDraft}
          onChange={e => onDraftChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onCommit}
          placeholder="제목 입력…"
          style={{ textAlign: 'center', fontSize: cell.isCenter ? 13 : 11 }}
        />
      ) : (
        <div
          onClick={e => { e.stopPropagation(); onStartEdit(key, cell.title, e) }}
          title="클릭하여 편집"
          style={{
            fontSize: cell.isCenter ? 12 : 11,
            fontWeight: 700,
            color: cell.isCenter ? '#ffd700' : isHovered ? cell.color : '#c0c0e0',
            lineHeight: 1.35,
            textAlign: 'center',
            fontFamily: cell.isCenter ? 'Orbitron, sans-serif' : 'inherit',
            padding: '2px 4px',
            borderRadius: 3,
            cursor: 'text',
            transition: 'color 0.2s',
            whiteSpace: 'pre-line',
            userSelect: 'none',
          }}
        >
          {cell.title}
        </div>
      )}

      {/* 서브 레이블 */}
      {!cell.isCenter && (
        <div style={{ fontSize: 9, color: '#444466', marginTop: 3, userSelect: 'none' }}>
          {cell.sub}
        </div>
      )}

      {/* ─ 하단 프로그레스 바 ─ */}
      {progress !== null && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          {/* % 라벨 */}
          {progress > 0 && (
            <div style={{
              textAlign: 'right',
              paddingRight: 6,
              fontSize: 8,
              fontFamily: 'Orbitron, monospace',
              color: progress === 100 ? '#00ff88' : cell.color,
              lineHeight: 1,
              marginBottom: 2,
            }}>
              {progress}%
            </div>
          )}
          <div style={{ height: 4, background: '#111133' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: progress === 100
                ? '#00ff88'
                : progress > 50
                ? `linear-gradient(90deg, ${cell.color}, #00ff88)`
                : cell.color,
              boxShadow: `0 0 6px ${cell.color}88`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── SubCell 컴포넌트 ──────────────────────────────────────────────────────── */

function SubCell({
  item, isCenter, childIdx, parentCell,
  editingKey, editDraft, inputRef,
  onStartEdit, onDraftChange, onKeyDown, onCommit, onToggleTodo,
}) {
  const color = parentCell.color

  /* 중앙 (부모) 셀 */
  if (isCenter) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a0d00, #100d00, #0a1000)',
        border: `2px solid ${color}`,
        borderRadius: 8,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 8,
        position: 'relative',
        boxShadow: `0 0 24px ${color}44, inset 0 0 18px ${color}11`,
      }}>
        <div className="pulse-ring" style={{
          position: 'absolute', inset: 3, borderRadius: 6,
          border: `1px solid ${color}44`, pointerEvents: 'none',
        }} />
        <div style={{ fontSize: 26, marginBottom: 6, userSelect: 'none' }}>{parentCell.icon}</div>
        <div className="orbitron" style={{
          fontSize: 11, fontWeight: 700, color,
          textAlign: 'center', lineHeight: 1.35,
        }}>
          {parentCell.title}
        </div>
        <div style={{ fontSize: 9, color: '#555577', marginTop: 3 }}>CORE</div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: '#111133' }}>
          <div style={{
            height: '100%',
            width: `${getProgress(parentCell)}%`,
            background: color,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>
    )
  }

  /* 자식 셀 */
  const child   = item
  const titleKey = `child_${parentCell.id}_${childIdx}`
  const isTitleEditing = editingKey === titleKey
  const doneCnt = child.todos?.filter(t => t.done).length ?? 0
  const totalCnt = child.todos?.length ?? 3

  return (
    <div
      style={{
        background: '#0a0a22',
        border: `1px solid ${color}30`,
        borderTop: `2px solid ${color}`,
        borderRadius: 8,
        display: 'flex', flexDirection: 'column',
        padding: '8px 10px',
        gap: 5,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
      onClick={e => e.stopPropagation()}
    >
      {/* 제목 */}
      {isTitleEditing ? (
        <InlineInput
          ref={inputRef}
          value={editDraft}
          onChange={e => onDraftChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onCommit}
          placeholder="세부 계획 입력…"
          style={{ fontSize: 12, fontWeight: 600 }}
        />
      ) : (
        <div
          onClick={e => onStartEdit(titleKey, child.title, e)}
          title="클릭하여 편집"
          style={{
            fontSize: 12, fontWeight: 600,
            color: '#c0c0e0',
            cursor: 'text',
            lineHeight: 1.3,
            padding: '1px 2px',
            borderRadius: 3,
            flexShrink: 0,
          }}
        >
          {child.title}
        </div>
      )}

      {/* 미니 프로그레스 */}
      <div style={{ height: 2, background: '#111133', borderRadius: 1, flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${(doneCnt / totalCnt) * 100}%`,
          background: doneCnt === totalCnt ? '#00ff88' : color,
          borderRadius: 1,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* 할일 체크리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        {child.todos?.map((todo, ti) => {
          const todoKey = `todo_${parentCell.id}_${childIdx}_${ti}`
          const isTodoEditing = editingKey === todoKey
          return (
            <div key={todo.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <Checkbox
                checked={todo.done}
                color={color}
                onChange={() => onToggleTodo(parentCell.id, childIdx, ti)}
              />
              {isTodoEditing ? (
                <InlineInput
                  ref={inputRef}
                  value={editDraft}
                  onChange={e => onDraftChange(e.target.value)}
                  onKeyDown={onKeyDown}
                  onBlur={onCommit}
                  placeholder="할 일 입력…"
                  style={{ fontSize: 10, padding: '2px 5px' }}
                />
              ) : (
                <span
                  onClick={e => onStartEdit(todoKey, todo.text, e)}
                  title="클릭하여 편집"
                  style={{
                    fontSize: 10,
                    color: todo.done ? '#3a553a' : '#777799',
                    textDecoration: todo.done ? 'line-through' : 'none',
                    cursor: 'text',
                    lineHeight: 1.4,
                    flex: 1,
                    transition: 'color 0.15s',
                  }}
                >
                  {todo.text}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* 완료 배지 */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
        gap: 4, flexShrink: 0,
      }}>
        <div style={{
          fontSize: 8,
          fontFamily: 'Orbitron, monospace',
          color: doneCnt === totalCnt ? '#00ff88' : `${color}88`,
        }}>
          {doneCnt}/{totalCnt} 완료
        </div>
        {doneCnt === totalCnt && (
          <span style={{ fontSize: 10 }}>✅</span>
        )}
      </div>
    </div>
  )
}
