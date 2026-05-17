import { useState } from 'react'
import { useDocStore } from '../store/docStore'

export default function FoldersList() {
  const { folders, currentFolderId, setCurrentFolder, fetchDocuments, createFolder, deleteFolder } = useDocStore()
  const [showInput, setShowInput] = useState(false)
  const [newName, setNewName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const handleSelectFolder = async (id) => {
    setCurrentFolder(id)
    await fetchDocuments(id)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await createFolder({ name: newName.trim() })
      setNewName('')
      setShowInput(false)
    } catch { /* toast already shown */ }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    await deleteFolder(id)
    setConfirmDeleteId(null)
  }

  const rootFolders = folders.filter((f) => !f.parent_id)

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Папки
        </h2>
        <button
          onClick={() => setShowInput(!showInput)}
          className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition"
          title="Створити папку"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {showInput && (
        <form onSubmit={handleCreate} className="mb-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Назва папки..."
            autoFocus
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
          />
        </form>
      )}

      <button
        onClick={() => handleSelectFolder(null)}
        className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition flex items-center gap-2 ${
          currentFolderId === null
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-700'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        Без папки
      </button>

      <div className="space-y-1">
        {rootFolders.map((folder) => (
          <div key={folder.id} className="group relative">
            <button
              onClick={() => handleSelectFolder(folder.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
                currentFolderId === folder.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="truncate flex-1">{folder.name}</span>
            </button>

            {confirmDeleteId === folder.id ? (
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null) }}
                  className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[10px]"
                >
                  ✕
                </button>
                <button
                  onClick={(e) => handleDelete(folder.id, e)}
                  className="px-1.5 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[10px]"
                >
                  ✓
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(folder.id) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition"
                title="Видалити"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {rootFolders.length === 0 && !showInput && (
        <button
          onClick={() => setShowInput(true)}
          className="text-indigo-400 hover:text-indigo-300 text-xs"
        >
          + Створити першу папку
        </button>
      )}
    </div>
  )
}