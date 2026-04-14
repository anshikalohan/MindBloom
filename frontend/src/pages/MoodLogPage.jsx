import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MOODS, MOOD_KEYS } from '../utils/moodConfig'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { CheckCircle } from 'lucide-react'

export default function MoodLogPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async () => {
    if (!selected) { toast.error('Please select a mood first'); return }
    setLoading(true)
    try {
      await api.post('/moods/', { mood: selected, intensity, note: note || undefined })
      setSaved(true)
      toast.success('Mood logged! 🌸')
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch {
      toast.error('Could not save mood')
    } finally {
      setLoading(false)
    }
  }

  const cfg = selected ? MOODS[selected] : null

  if (saved) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}>
            <CheckCircle size={64} className="mx-auto" style={{ color: '#22c55e' }} />
          </motion.div>
          <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>Mood saved!</p>
          <p style={{ color: 'var(--text-secondary)' }}>Redirecting to dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          How are you <span className="gradient-text italic">feeling?</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Take a moment to check in with yourself
        </p>
      </div>

      {/* Mood grid */}
      <div className="grid grid-cols-4 gap-3">
        {MOOD_KEYS.map(key => {
          const m = MOODS[key]
          const isSelected = selected === key
          return (
            <motion.button key={key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(key)}
              className="relative p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all duration-200"
              style={{
                borderColor: isSelected ? m.color : 'var(--border)',
                background: isSelected ? `${m.bgLight}` : 'var(--bg-card)',
                boxShadow: isSelected ? `0 0 20px ${m.color}30` : 'none',
              }}>
              <motion.span className="text-3xl" animate={isSelected ? { y: [0, -4, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}>
                {m.emoji}
              </motion.span>
              <span className="text-xs font-medium" style={{ color: isSelected ? m.color : 'var(--text-secondary)' }}>
                {m.label}
              </span>
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full"
                  style={{ background: m.color }} />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Details (shown after mood selection) */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="space-y-5 overflow-hidden">

            {/* Suggestion card */}
            <div className="card p-4 flex items-start gap-3"
              style={{ background: `${cfg.bgLight}`, borderColor: `${cfg.color}30` }}>
              <span className="text-2xl">{cfg.emoji}</span>
              <div>
                <p className="text-sm font-medium" style={{ color: cfg.color }}>{cfg.suggestion}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{cfg.activity}</p>
              </div>
            </div>

            {/* Intensity slider */}
            <div className="card p-5">
              <label className="block text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
                Intensity: <span className="font-semibold" style={{ color: cfg.color }}>{intensity}/10</span>
              </label>
              <input type="range" min={1} max={10} value={intensity}
                onChange={e => setIntensity(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: cfg.color }} />
              <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                <span>Mild</span><span>Moderate</span><span>Intense</span>
              </div>
            </div>

            {/* Note */}
            <div className="card p-5">
              <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                Add a note <span className="opacity-60">(optional)</span>
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)} maxLength={500}
                placeholder="What's on your mind? What happened today?"
                rows={3}
                className="input-field resize-none font-body text-sm" />
              <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-secondary)' }}>{note.length}/500</p>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full text-base disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : `Save ${cfg.emoji} ${cfg.label} Mood`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}