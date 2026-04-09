import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import {
  LayoutDashboard, Smile, BarChart2, BookOpen,
  Wind, Moon, Sun, LogOut, Menu, X, Sparkles
} from 'lucide-react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/log',       icon: Smile,           label: 'Log Mood' },
  { to: '/analytics', icon: BarChart2,        label: 'Analytics' },
  { to: '/journal',   icon: BookOpen,         label: 'Journal' },
  { to: '/relax',     icon: Wind,             label: 'Relax' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #d946ef, #9333ea)' }}>
          <Sparkles size={18} className="text-white" />
        </div>
        <span className="font-display text-xl font-semibold gradient-text">MindBloom</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-glow-purple'
                  : 'hover:bg-bloom-50 dark:hover:bg-bloom-900/20'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, #d946ef, #9333ea)',
            } : { color: 'var(--text-secondary)' }}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="space-y-2 mt-4">
        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #d946ef, #9333ea)' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all hover:bg-bloom-50 dark:hover:bg-bloom-900/20"
          style={{ color: 'var(--text-secondary)' }}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Logout */}
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 fixed inset-y-0 left-0 z-20 border-r"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-40 w-64 lg:hidden"
              style={{ background: 'var(--bg-card)' }}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
            <Menu size={20} />
          </button>
          <span className="font-display text-lg gradient-text">MindBloom</span>
          <button onClick={toggleTheme} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}