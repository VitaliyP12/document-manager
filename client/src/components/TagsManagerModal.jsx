import { useState } from 'react'
import { useDocStore } from '../store/docStore'

export default function TagsManagerModal({ onClose }) {
  const { tags, createTag, deleteTag } = useDocStore()
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const colors = [
    'bg-indigo-500', 'bg-pink-500', 'bg-emerald-500',
    'bg-yellow-500', 'bg-blue-500', 'bg-purple-500',
  ]

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTag.trim()) return

    setLoading(true)
    setError(null)
    try {
      await createTag({ name: newTag.trim() })
      setNewTag('')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    await deleteTag(id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 z-10">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Управління тегами</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Створення нового тегу */}
        <div className="p-6 border-b border-slate-700">
          {error && (
            <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Назва нового тегу..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !newTag.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition"
            >
              Додати
            </button>
          </form>
        </div>

        {/* Список тегів */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Всі теги ({tags.length})
          </h3>

          {tags.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">
              Тегів ще немає. Створіть перший!
            </p>
          ) : (
            <div className="space-y-2">
              {tags.map((tag, i) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                    <span className="text-white text-sm">{tag.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="text-slate-500 hover:text-red-400 transition p-1"
                    title="Видалити тег"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}