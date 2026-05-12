import { useState } from 'react'
import { useDocStore } from '../store/docStore'
import FileIcon from './FileIcon'

export default function AddDocumentModal({ onClose }) {
  const { createDocument, tags } = useDocStore()
  const [form, setForm] = useState({ title: '', description: '' })
  const [file, setFile] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)

  const acceptedExt = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.json,.html,.zip,.rar,.7z,.jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.webm,.mov,.avi,.mkv,.mp3,.wav,.ogg,.m4a'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const pickFile = (f) => {
    if (!f) return
    setFile(f)
    if (!form.title.trim()) {
      const nameWithoutExt = f.name.replace(/\.[^/.]+$/, '')
      setForm((prev) => ({ ...prev, title: nameWithoutExt }))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    pickFile(e.dataTransfer.files[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Введіть назву документу')
    if (!file) return setError('Прикріпіть файл')

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('file', file)
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Новий документ</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

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
              Файл <span className="text-red-400">*</span>
            </label>
            <label
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex items-center justify-center w-full min-h-[130px] rounded-xl border-2 border-dashed cursor-pointer transition ${
                dragging
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-600 hover:border-indigo-500 bg-slate-900'
              }`}
            >
              <div className="text-center px-4 py-3">
                {file ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <FileIcon fileName={file.name} fileType={file.type} className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-indigo-400 text-sm font-medium break-all">{file.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : dragging ? (
                  <p className="text-indigo-400 text-sm font-medium">Відпустіть файл сюди</p>
                ) : (
                  <>
                    <svg className="w-8 h-8 mx-auto mb-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-slate-400 text-sm">Перетягніть файл сюди або клікніть</p>
                    <p className="text-slate-500 text-xs mt-1">
                      Документи, таблиці, зображення, відео, аудіо, архіви — до 500MB
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept={acceptedExt}
                onChange={(e) => pickFile(e.target.files[0])}
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