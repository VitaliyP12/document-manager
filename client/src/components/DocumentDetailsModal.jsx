import { useState } from 'react'
import { useDocStore } from '../store/docStore'

export default function DocumentDetailsModal({ document, onClose }) {
  const { tags, deleteDocument, addTagToDocument, removeTagFromDocument } = useDocStore()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading, setLoading] = useState(false)

  const docTagIds = document.Tags?.map((t) => t.id) || []
  const availableTags = tags.filter((t) => !docTagIds.includes(t.id))

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteDocument(document.id)
      onClose()
    } catch {
      setLoading(false)
    }
  }

  const handleView = () => {
    if (!document.file_path) return
    window.open(`http://localhost:5000/uploads/${document.file_path}`, '_blank')
  }

  const handleDownload = async () => {
  try {
    const { downloadDocument } = await import('../api/documents')
    const response = await downloadDocument(document.id)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = window.document.createElement('a')
    link.href = url
    link.download = document.original_name || 'file'
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Помилка завантаження:', err)
  }
}

  const handleAddTag = async (tagId) => {
    await addTagToDocument(document.id, tagId)
  }

  const handleRemoveTag = async (tagId) => {
    await removeTagFromDocument(document.id, tagId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 z-10 max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-start justify-between p-6 border-b border-slate-700">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{document.title}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Створено {new Date(document.createdAt).toLocaleDateString('uk-UA')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Контент */}
        <div className="p-6 space-y-5">
          {/* Опис */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Опис
            </h3>
            <p className="text-slate-200 text-sm">
              {document.description || <span className="text-slate-500 italic">Без опису</span>}
            </p>
          </div>

          {/* Файл */}
          {document.file_path && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Файл
              </h3>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {document.original_name || 'Файл'}
                    </p>
                    {document.file_size && (
                      <p className="text-xs text-slate-500">
                        {(document.file_size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleView}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Переглянути
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                    </svg>
                    Завантажити
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Поточні теги */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Теги
            </h3>
            {document.Tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {document.Tags.map((tag) => (
                  <span key={tag.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300 text-xs">
                    {tag.name}
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="hover:text-white transition"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs italic mb-3">Тегів немає</p>
            )}

            {availableTags.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Додати тег:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleAddTag(tag.id)}
                      className="px-3 py-1 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition"
                    >
                      + {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Дії */}
        <div className="p-6 border-t border-slate-700">
          {confirmDelete ? (
            <div className="space-y-3">
              <p className="text-sm text-red-400">Точно видалити цей документ?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 text-sm transition"
                >
                  Ні
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium transition"
                >
                  {loading ? 'Видалення...' : 'Так, видалити'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-sm font-medium transition"
            >
              Видалити документ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}