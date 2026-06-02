import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-60">
        <Header onMenu={() => setOpen(true)} />
        <main className="min-h-[calc(100vh-64px)] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
