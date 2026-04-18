import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUOTES } from '../utils/moodConfig'
import { Play, Pause, RotateCcw, RefreshCw } from 'lucide-react'

// ─── Breathing Exercise ────────────────────────────────────────────────────────
const PHASES = [
  { label: 'Inhale', duration: 4, color: '#60a5fa' },
  { label: 'Hold',   duration: 4, color: '#a78bfa' },
  { label: 'Exhale', duration: 6, color: '#34d399' },
  { label: 'Hold',   duration: 2, color: '#fb923c' },
]

function BreathingExercise() {
  const [active, setActive] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [seconds, setSeconds] = useState(PHASES[0].duration)
  const [cycles, setCycles] = useState(0)
  const timerRef = useRef(null)

  const phase = PHASES[phaseIdx]

  useEffect(() => {
    if (!active) return
    timerRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          const next = (phaseIdx + 1) % PHASES.length
          if (next === 0) setCycles(c => c + 1)
          setPhaseIdx(next)
          return PHASES[next].duration
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [active, phaseIdx])

  const reset = () => {
    setActive(false)
    setPhaseIdx(0)
    setSeconds(PHASES[0].duration)
    setCycles(0)
    clearInterval(timerRef.current)
  }

  const scale = phase.label === 'Inhale' ? 1.3 : phase.label === 'Exhale' ? 0.85 : 1.1

  return (
    <div className="card p-6 md:p-8 flex flex-col items-center gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
          Box Breathing
        </h2>
        <p className="text-sm text-center mt-1" style={{ color: 'var(--text-secondary)' }}>
          Reduces stress and calms the nervous system
        </p>
      </div>

      {/* Animated circle */}
      <div className="relative flex items-center justify-center w-48 h-48">
        {/* Outer pulse rings */}
        {active && [1, 2, 3].map(i => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: 180 + i * 20, height: 180 + i * 20, border: `1px solid ${phase.color}20` }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: phase.duration, repeat: Infinity, delay: i * 0.3 }} />
        ))}

        <motion.div className="w-40 h-40 rounded-full flex flex-col items-center justify-center gap-1"
          animate={{ scale: active ? scale : 1 }}
          transition={{ duration: phase.duration, ease: active && phase.label === 'Inhale' ? 'easeIn' : 'easeOut' }}
          style={{ background: `radial-gradient(circle, ${phase.color}40, ${phase.color}15)`,
                   border: `3px solid ${phase.color}60` }}>
          <span className="font-display text-2xl font-semibold" style={{ color: phase.color }}>
            {seconds}
          </span>
          <span className="text-xs font-medium" style={{ color: phase.color }}>{phase.label}</span>
        </motion.div>
      </div>

      {/* Cycles */}
      <div className="flex gap-6 text-center">
        <div>
          <p className="font-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{cycles}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Cycles</p>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold" style={{ color: phase.color }}>{phase.label}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Current Phase</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={() => setActive(a => !a)} className="btn-primary flex items-center gap-2 px-8">
          {active ? <><Pause size={16} /> Pause</> : <><Play size={16} /> {cycles > 0 ? 'Resume' : 'Start'}</>}
        </button>
        <button onClick={reset} className="px-4 py-3 rounded-2xl border transition-colors hover:border-bloom-400"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Phase guide */}
      <div className="flex gap-2 flex-wrap justify-center">
        {PHASES.map((p, i) => (
          <div key={i} className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            phaseIdx === i && active ? 'scale-105' : 'opacity-50'
          }`}
            style={{ background: `${p.color}20`, color: p.color }}>
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.label} ({p.duration}s)
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Meditation Timer ──────────────────────────────────────────────────────────
const DURATIONS = [1, 3, 5, 10, 15, 20]

function MeditationTimer() {
  const [duration, setDuration] = useState(5)
  const [remaining, setRemaining] = useState(5 * 60)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const timerRef = useRef(null)

  const total = duration * 60
  const progress = (remaining / total) * 100

  useEffect(() => {
    if (!running) return
    timerRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(timerRef.current)
          setRunning(false)
          setDone(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [running])

  const reset = (d = duration) => {
    clearInterval(timerRef.current)
    setRunning(false)
    setDone(false)
    setRemaining(d * 60)
  }

  const handleDuration = (d) => { setDuration(d); reset(d) }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <div className="card p-6 md:p-8 flex flex-col items-center gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
          Meditation Timer
        </h2>
        <p className="text-sm text-center mt-1" style={{ color: 'var(--text-secondary)' }}>
          Find stillness in the present moment
        </p>
      </div>

      {/* Duration picker */}
      <div className="flex gap-2 flex-wrap justify-center">
        {DURATIONS.map(d => (
          <button key={d} onClick={() => handleDuration(d)}
            disabled={running}
            className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all disabled:cursor-not-allowed"
            style={{
              background: duration === d ? 'linear-gradient(135deg, #d946ef, #9333ea)' : 'var(--bg-secondary)',
              color: duration === d ? 'white' : 'var(--text-secondary)',
            }}>
            {d}m
          </button>
        ))}
      </div>

      {/* SVG Timer Ring */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="176" height="176">
          <circle cx="88" cy="88" r="54" fill="none" strokeWidth="8" stroke="var(--bg-secondary)" />
          <motion.circle cx="88" cy="88" r="54" fill="none" strokeWidth="8"
            stroke="#d946ef" strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="flex flex-col items-center">
          {done ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
              <p className="text-3xl">🎉</p>
              <p className="text-xs mt-1 font-medium" style={{ color: '#d946ef' }}>Done!</p>
            </motion.div>
          ) : (
            <>
              <span className="font-mono text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {mm}:{ss}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{duration}min session</span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setRunning(r => !r)} disabled={done} className="btn-primary flex items-center gap-2 px-8 disabled:opacity-50">
          {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> {remaining < total && !done ? 'Resume' : 'Start'}</>}
        </button>
        <button onClick={() => reset()} className="px-4 py-3 rounded-2xl border transition-colors hover:border-bloom-400"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── Quote Card ────────────────────────────────────────────────────────────────
function QuoteCard() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length))
  const q = QUOTES[idx]
  const next = () => setIdx(i => (i + 1) % QUOTES.length)

  return (
    <div className="card p-6 md:p-8 flex flex-col items-center gap-6 text-center"
      style={{ background: 'linear-gradient(135deg, rgba(217,70,239,0.06), rgba(124,58,237,0.06))' }}>
      <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
        Daily Wisdom
      </h2>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="space-y-3">
          <p className="text-5xl">✨</p>
          <blockquote className="font-display text-lg md:text-xl italic font-light leading-relaxed"
            style={{ color: 'var(--text-primary)' }}>
            "{q.text}"
          </blockquote>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>— {q.author}</p>
        </motion.div>
      </AnimatePresence>
      <button onClick={next} className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-all hover:border-bloom-400"
        style={{ borderColor: 'var(--border)', color: '#d946ef' }}>
        <RefreshCw size={14} /> Next Quote
      </button>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function RelaxPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Relax & <span className="gradient-text italic">Recharge</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Take a breath. You deserve this moment.
        </p>
      </div>

      <BreathingExercise />
      <MeditationTimer />
      <QuoteCard />
    </motion.div>
  )
}