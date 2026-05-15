import React, { useState } from 'react'
import Header from './components/Header.jsx'
import TabNav from './components/TabNav.jsx'
import Dashboard from './components/Dashboard.jsx'
import Mandalart from './components/Mandalart.jsx'
import TimeBlocker from './components/TimeBlocker.jsx'
import Kanban from './components/Kanban.jsx'
import Performance from './components/Performance.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import {
  TABS,
  INITIAL_MANDALA,
  INITIAL_TIME_BLOCKS,
  INITIAL_KANBAN,
} from './constants.js'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const [mandala, setMandala] = useLocalStorage('wutu_mandala', INITIAL_MANDALA)
  const [timeBlocks, setTimeBlocks] = useLocalStorage('wutu_time_blocks', INITIAL_TIME_BLOCKS)
  const [kanban, setKanban] = useLocalStorage('wutu_kanban', INITIAL_KANBAN)
  const [kanbanSettings, setKanbanSettings] = useLocalStorage('wutu_kanban_settings', {
    autoRemove: false,
    autoRemoveDelay: 30,
  })

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            mandala={mandala}
            timeBlocks={timeBlocks}
            kanban={kanban}
          />
        )
      case 'mandalart':
        return <Mandalart cells={mandala} setCells={setMandala} />
      case 'timeblocker':
        return <TimeBlocker blocks={timeBlocks} setBlocks={setTimeBlocks} />
      case 'kanban':
        return (
          <Kanban
            cards={kanban}
            setCards={setKanban}
            settings={kanbanSettings}
            setSettings={setKanbanSettings}
          />
        )
      case 'performance':
        return <Performance />
      default:
        return null
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: '#050512',
        backgroundImage: `
          radial-gradient(ellipse at 15% 40%, rgba(0,212,255,0.04) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 20%, rgba(255,45,120,0.04) 0%, transparent 55%),
          radial-gradient(ellipse at 50% 90%, rgba(191,95,255,0.03) 0%, transparent 55%),
          linear-gradient(rgba(26,26,64,0.35) 1px, transparent 1px),
          linear-gradient(90deg, rgba(26,26,64,0.35) 1px, transparent 1px)
        `,
        backgroundSize: '100%, 100%, 100%, 44px 44px, 44px 44px',
      }}
    >
      {/* Header - fixed height */}
      <div style={{ padding: '10px 14px 0', flexShrink: 0 }}>
        <Header />
      </div>

      {/* Tab navigation */}
      <div style={{ flexShrink: 0 }}>
        <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {renderTab()}
      </div>
    </div>
  )
}
