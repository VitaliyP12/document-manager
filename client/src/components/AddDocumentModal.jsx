import { useState } from 'react'
import { useDocStore } from '../store/docStore'

export default function AddDocumentModal({ onClose }) {
  const { createDocument, tags } = useDocStore()
  const [form, setForm] = useState({ title: '', description: '' })
  const [file, setFile] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Введіть назву документу')

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      if (file) formData.append('file', file)
      if (selectedTags.length > 0)
        formData.append('tags', JSON.stringify(selectedTags))

      await createDocument(formData)
      onClose()
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Фон */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Модалка */}
      <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 z-10">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Новий документ</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Назва <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Введіть назву документу"
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Опис
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Короткий опис документу..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Файл
            </label>
            <label className="flex items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-slate-600 hover:border-indigo-500 cursor-pointer transition bg-slate-900">
              <div className="text-center">
                {file ? (
                  <p className="text-indigo-400 text-sm font-medium">{file.name}</p>
                ) : (
                  <>
                    <p className="text-slate-400 text-sm">Клікніть щоб обрати файл</p>
                    <p className="text-slate-500 text-xs mt-1">PDF, DOC, DOCX, JPG, PNG до 10MB</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Теги
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      selectedTags.includes(tag.id)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition text-sm font-medium"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition text-sm font-medium"
            >
              {loading ? 'Збереження...' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}