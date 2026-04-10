import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Shield, BarChart2, BookOpen, Wind, ChevronRight } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

const FEATURES = [
  { icon: '🌸', title: 'Mood Tracking', desc: 'Log how you feel daily with beautiful emoji-based UI' },
  { icon: '📊', title: 'Analytics', desc: 'Visualize your emotional patterns over weeks and months' },
  { icon: '📓', title: 'Journaling', desc: 'Write your thoughts, tag entries, and reflect' },
  { icon: '🌬️', title: 'Relaxation', desc: 'Breathing exercises, meditation timer, and calming quotes' },
]


export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #d946ef, transparent)' }} />
        <div className="absolute bottom-[10%] left-[-5%] w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-[40%] left-[30%] w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
      </div>

      {/* Navbar */}
      
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #d946ef, #9333ea)' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-semibold gradient-text">MindBloom</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm font-medium rounded-xl transition-colors hover:bg-bloom-50 dark:hover:bg-bloom-900/20"
            style={{ color: 'var(--text-secondary)' }}>
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} className="btn-primary text-sm py-2">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-16 pb-24 max-w-4xl mx-auto">

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-7xl font-semibold leading-tight mb-6">
          Your mental wellness,{' '}
          <span className="gradient-text italic">beautifully tracked</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto font-body"
          style={{ color: 'var(--text-secondary)' }}>
          MindBloom helps you understand your emotions, build healthy habits, and find calm — all in one beautiful app.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate('/signup')} className="btn-primary flex items-center gap-2 justify-center text-base">
            Start Your Journey <ChevronRight size={18} />
          </button>
          <button onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-2xl text-base font-medium border transition-all hover:border-bloom-400"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            Sign In
          </button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="card p-6 text-center hover:scale-105 transition-transform duration-200">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-display text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
              <p className="text-sm font-body" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-20 text-center">
        <div className="max-w-xl mx-auto card p-10"
          style={{ background: 'linear-gradient(135deg, rgba(217,70,239,0.08), rgba(124,58,237,0.08))' }}>
          <p className="text-4xl mb-4">🌱</p>
          <h2 className="font-display text-3xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Start growing today
          </h2>
          <p className="font-body text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Free to use. No credit card required. Just your commitment to wellbeing.
          </p>
          <button onClick={() => navigate('/signup')} className="btn-primary">
            Create Free Account
          </button>
        </div>
      </section>
    </div>
  )
}