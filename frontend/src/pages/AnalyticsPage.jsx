import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts'
import api from '../utils/api'
import { MOODS } from '../utils/moodConfig'
import toast from 'react-hot-toast'

const CONTAINER = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const ITEM = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

// Map mood name -> intensity numeric value for line chart
function moodToValue(mood) {
  const map = { happy: 8, excited: 9, grateful: 9, neutral: 5, tired: 3, anxious: 4, sad: 2, angry: 6 }
  return mood ? (map[mood] || 5) : null
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const cfg = d.mood ? MOODS[d.mood] : null
  return (
    <div className="card px-4 py-3 text-sm" style={{ minWidth: 120 }}>
      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{d.date}</p>
      {cfg ? (
        <p className="mt-1">{cfg.emoji} {cfg.label} <span className="opacity-60">({d.intensity})</span></p>
      ) : (
        <p style={{ color: 'var(--text-secondary)' }}>No entry</p>
      )}
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { mood, count, percentage } = payload[0].payload
  const cfg = MOODS[mood] || {}
  return (
    <div className="card px-4 py-3 text-sm">
      <p className="font-medium">{cfg.emoji} {cfg.label || mood}</p>
      <p style={{ color: 'var(--text-secondary)' }}>{count} entries · {percentage}%</p>
    </div>
  )
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/moods/analytics')
      .then(r => setAnalytics(r.data))
      .catch(() => toast.error('Could not load analytics'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-xl shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-64 rounded-2xl shimmer" />)}
        </div>
      </div>
    )
  }

  const weeklyChartData = (analytics?.weekly_data || []).map(d => ({
    ...d,
    value: d.mood ? moodToValue(d.mood) : null,
  }))

  const pieData = (analytics?.mood_distribution || []).map(d => ({
    ...d,
    fill: MOODS[d.mood]?.color || '#94a3b8',
  }))

  return (
    <motion.div variants={CONTAINER} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={ITEM}>
        <h1 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Mood <span className="gradient-text italic">Analytics</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Understand your emotional patterns</p>
      </motion.div>

      {/* Summary cards */}
      <motion.div variants={ITEM} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Current Streak', value: `${analytics?.streak ?? 0} days`, emoji: '🔥' },
          { label: 'Total Entries', value: analytics?.total_entries ?? 0, emoji: '📊' },
          { label: 'Most Common', value: analytics?.most_common_mood
            ? `${MOODS[analytics.most_common_mood]?.emoji} ${MOODS[analytics.most_common_mood]?.label}`
            : '—', emoji: '🏆' },
        ].map(({ label, value, emoji }) => (
          <div key={label} className="card p-5 text-center">
            <p className="text-3xl mb-2">{emoji}</p>
            <p className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Weekly line chart */}
      <motion.div variants={ITEM} className="card p-6">
        <h2 className="font-display text-lg font-medium mb-6" style={{ color: 'var(--text-primary)' }}>
          7-Day Mood Trend
        </h2>
        {weeklyChartData.some(d => d.value !== null) ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyChartData}>
              <defs>
                <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--text-secondary)', fontFamily: 'DM Sans' }}
                axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                axisLine={false} tickLine={false} width={25} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotoneX" dataKey="value" stroke="#d946ef" strokeWidth={2.5}
                fill="url(#moodGrad)" connectNulls dot={{ fill: '#d946ef', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#d946ef' }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-2">📈</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Log moods to see your trend</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Pie chart */}
      <motion.div variants={ITEM} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6">
          <h2 className="font-display text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
            Emotion Distribution
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="count" cx="50%" cy="50%" outerRadius={80}
                  innerRadius={40} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No data yet</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
            Breakdown
          </h2>
          <div className="space-y-3">
            {pieData.length > 0 ? pieData.sort((a, b) => b.count - a.count).map(d => {
              const cfg = MOODS[d.mood] || {}
              return (
                <div key={d.mood} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{cfg.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                        {cfg.label || d.mood}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{d.count}x · {d.percentage}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${d.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full" style={{ background: d.fill }} />
                    </div>
                  </div>
                </div>
              )
            }) : (
              <p className="text-sm text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                Start logging moods to see your breakdown
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}