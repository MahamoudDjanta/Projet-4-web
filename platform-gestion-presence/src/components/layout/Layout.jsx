import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-60">
        <Header onMenu={() => setOpen(true)} />
        <main className="min-h-[calc(100vh-64px)] p-4 lg:p-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[var(--shadow)] backdrop-blur-xl lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
