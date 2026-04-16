import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import api from '../utils/api'
import { MOODS, TAGS } from '../utils/moodConfig'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Tag, Search } from 'lucide-react'

function JournalModal({ entry, onClose, onSaved }) {
  const isEdit = !!entry?.id
  const [form, setForm] = useState({
    title: entry?.title || '',
    content: entry?.content || '',
    tags: entry?.tags || [],
    mood: entry?.mood || '',
  })
  const [loading, setLoading] = useState(false)

  const toggleTag = tag => setForm(f => ({
    ...f,
    tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
  }))

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.content.trim()) { toast.error('Content is required'); return }
    setLoading(true)
    try {
      const payload = { ...form, mood: form.mood || undefined }
      if (isEdit) {
        await api.put(`/journal/${entry.id}`, payload)
        toast.success('Entry updated!')
      } else {
        await api.post('/journal/', payload)
        toast.success('Entry saved! ✍️')
      }
      onSaved()
      onClose()
    } catch {
      toast.error('Could not save entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="card w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit Entry' : 'New Journal Entry'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-60" style={{ color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <input type="text" placeholder="Entry title..." className="input-field font-medium"
          value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />

        <textarea placeholder="Write your thoughts..." rows={5} className="input-field resize-none font-body text-sm"
          value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />

        {/* Mood selector */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Mood (optional)</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(MOODS).map(([key, m]) => (
              <button key={key} onClick={() => setForm(f => ({ ...f, mood: f.mood === key ? '' : key }))}
                className="px-3 py-1.5 rounded-xl text-sm border-2 transition-all"
                style={{
                  borderColor: form.mood === key ? m.color : 'var(--border)',
                  background: form.mood === key ? m.bgLight : 'transparent',
                  color: form.mood === key ? m.color : 'var(--text-secondary)',
                }}>
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Tags</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)}
                className="px-3 py-1 rounded-xl text-xs border transition-all capitalize"
                style={{
                  borderColor: form.tags.includes(tag) ? '#d946ef' : 'var(--border)',
                  background: form.tags.includes(tag) ? '#fae8ff' : 'transparent',
                  color: form.tags.includes(tag) ? '#d946ef' : 'var(--text-secondary)',
                }}>
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? 'Saving...' : isEdit ? 'Update Entry' : 'Save Entry'}
        </button>
      </motion.div>
    </motion.div>
  )
}

function EntryCard({ entry, onEdit, onDelete }) {
  const cfg = entry.mood ? MOODS[entry.mood] : null
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }} className="card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{entry.title}</h3>
            {cfg && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: cfg.bgLight, color: cfg.color }}>
                {cfg.emoji} {cfg.label}
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {format(new Date(entry.created_at), 'MMMM d, yyyy · h:mm a')}
          </p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(entry)} className="p-1.5 rounded-lg hover:bg-bloom-50 dark:hover:bg-bloom-900/20 transition-colors"
            style={{ color: 'var(--text-secondary)' }}>
            <Pencil size={15} />
          </button>
          <button onClick={() => onDelete(entry.id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-rose-400">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
        {entry.content}
      </p>

      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs capitalize"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function JournalPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('')

  const fetchEntries = async () => {
    try {
      const params = filterTag ? `?tag=${filterTag}` : ''
      const res = await api.get(`/journal/${params}`)
      setEntries(res.data)
    } catch { toast.error('Could not load journal') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchEntries() }, [filterTag])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return
    try {
      await api.delete(`/journal/${id}`)
      setEntries(e => e.filter(x => x.id !== id))
      toast.success('Entry deleted')
    } catch { toast.error('Could not delete entry') }
  }

  const handleEdit = (entry) => { setEditEntry(entry); setModalOpen(true) }
  const handleNew = () => { setEditEntry(null); setModalOpen(true) }

  const filtered = entries.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            My <span className="gradient-text italic">Journal</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
        <button onClick={handleNew} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Entry
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input placeholder="Search entries..." className="input-field pl-9"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
          className="input-field w-full sm:w-40 capitalize cursor-pointer">
          <option value="">All tags</option>
          {TAGS.map(t => <option key={t} value={t}>#{t}</option>)}
        </select>
      </div>

      {/* Entries */}
      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}</div>
      ) : filtered.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {filtered.map(e => (
              <EntryCard key={e.id} entry={e} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📓</p>
          <p className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>No entries yet</p>
          <p className="text-sm mt-2 mb-6" style={{ color: 'var(--text-secondary)' }}>Start writing your thoughts</p>
          <button onClick={handleNew} className="btn-primary">Write First Entry</button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <JournalModal entry={editEntry} onClose={() => setModalOpen(false)} onSaved={fetchEntries} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}