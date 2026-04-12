import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import { MOODS } from '../utils/moodConfig'
import { format } from 'date-fns'
import { Flame, Plus, TrendingUp, BookOpen, Wind } from 'lucide-react'
import toast from 'react-hot-toast'

const CONTAINER = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const ITEM = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

function StatCard({ icon, label, value, color, sub }) {
  return (
    <motion.div variants={ITEM} className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {color && <div className="w-2 h-2 rounded-full mt-1" style={{ background: color }} />}
      </div>
      <p className="font-display text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
      <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
    </motion.div>
  )
}

function MoodCard({ entry }) {
  const cfg = MOODS[entry.mood] || {}
  const date = new Date(entry.created_at)
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: cfg.bgLight || '#f3f4f6' }}>
        {cfg.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>{cfg.label || entry.mood}</p>
        {entry.note && <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{entry.note}</p>}
      </div>
      <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{format(date, 'MMM d')}</span>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [todayMood, setTodayMood] = useState(null)
  const [recentMoods, setRecentMoods] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [todayRes, moodsRes, analyticsRes] = await Promise.all([
          api.get('/moods/today'),
          api.get('/moods/?limit=5'),
          api.get('/moods/analytics'),
        ])
        setTodayMood(todayRes.data.mood)
        setRecentMoods(moodsRes.data)
        setAnalytics(analyticsRes.data)
      } catch {
        toast.error('Could not load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const todayCfg = todayMood ? MOODS[todayMood.mood] : null
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="h-8 w-48 rounded-xl shimmer" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl shimmer" />)}
        </div>
        <div className="h-48 rounded-2xl shimmer" />
      </div>
    )
  }

  return (
    <motion.div variants={CONTAINER} initial="hidden" animate="show" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={ITEM}>
        <h1 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </motion.div>

{/* Today's mood hero */}
<motion.div variants={ITEM}>
  {todayMood ? (
    <div className="card p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${todayCfg?.color}, transparent 60%)` }} />
      <div className="flex items-center gap-4">
        <motion.span className="text-6xl" animate={{ y: [0,-6,0] }} transition={{ duration: 3, repeat: Infinity }}>
          {todayCfg?.emoji}
        </motion.span>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Today's mood</p>
          <p className="font-display text-3xl font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
            {todayCfg?.label}
          </p>
          {todayMood.note && (
            <p className="text-sm mt-1 italic" style={{ color: 'var(--text-secondary)' }}>"{todayMood.note}"</p>
          )}
        </div>
      </div>
      {todayCfg && (
        <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'var(--bg-secondary)' }}>
          💡 {todayCfg.suggestion} — <span className="font-medium">{todayCfg.activity}</span>
        </div>
      )}
    </div>
  ) : (
    <div className="card p-6 flex flex-col sm:flex-row items-center gap-4">
      <span className="text-5xl">🌅</span>
      <div className="flex-1 text-center sm:text-left">
        <p className="font-display text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
          How are you feeling today?
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          You haven't logged your mood yet.
        </p>
      </div>
      <button onClick={() => navigate('/log')} className="btn-primary flex items-center gap-2">
        <Plus size={16} /> Log Mood
      </button>
    </div>
  )}
</motion.div>
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🔥" label="Day Streak" value={analytics?.streak ?? 0}
          sub={analytics?.streak > 0 ? 'Keep going!' : 'Start today'} color="#fb923c" />
        <StatCard icon="📊" label="Total Entries" value={analytics?.total_entries ?? 0}
          sub="Last 30 days" color="#60a5fa" />
        <StatCard icon="🏆" label="Top Mood" value={analytics?.most_common_mood
          ? MOODS[analytics.most_common_mood]?.emoji + ' ' + MOODS[analytics.most_common_mood]?.label
          : '—'} sub="This month" />
        <StatCard icon="✨" label="Wellness Score"
          value={analytics?.streak > 0 ? Math.min(99, analytics.streak * 7 + analytics.total_entries) : 0}
          sub="Keep logging!" color="#d946ef" />
      </div>

      {/* Recent moods + Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent moods */}
        <motion.div variants={ITEM} className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Recent Moods</h2>
            <button onClick={() => navigate('/analytics')} className="text-xs font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#d946ef' }}>
              View all →
            </button>
          </div>
          {recentMoods.length > 0 ? (
            <div>{recentMoods.map(m => <MoodCard key={m.id} entry={m} />)}</div>
          ) : (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No entries yet</p>
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={ITEM} className="space-y-3">
          {[
            { icon: <Plus size={20} />, label: 'Log Today\'s Mood', sub: 'Track how you feel', path: '/log', gradient: 'linear-gradient(135deg, #d946ef, #9333ea)' },
            { icon: <TrendingUp size={20} />, label: 'View Analytics', sub: 'Explore your patterns', path: '/analytics', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
            { icon: <BookOpen size={20} />, label: 'Write in Journal', sub: 'Capture your thoughts', path: '/journal', gradient: 'linear-gradient(135deg, #22c55e, #10b981)' },
            { icon: <Wind size={20} />, label: 'Relax & Breathe', sub: 'Take a moment to unwind', path: '/relax', gradient: 'linear-gradient(135deg, #fb923c, #f59e0b)' },
          ].map(({ icon, label, sub, path, gradient }) => (
            <button key={path} onClick={() => navigate(path)}
              className="card p-4 w-full flex items-center gap-4 text-left hover:scale-[1.02] transition-transform duration-200">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ background: gradient }}>
                {icon}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{sub}</p>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}