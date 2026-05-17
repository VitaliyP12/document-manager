import { useEffect, useState } from 'react'
import { useDocStore } from '../store/docStore'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AddDocumentModal from '../components/AddDocumentModal'
import DocumentDetailsModal from '../components/DocumentDetailsModal'
import FileIcon from '../components/FileIcon'

export default function DashboardPage() {
  const {
    documents,
    tags,
    folders,
    currentFolderId,
    fetchDocuments,
    fetchTags,
    fetchFolders,
    searchDocuments,
    deleteMultipleDocuments,
  } = useDocStore()
  const [selectedTag, setSelectedTag] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('DESC')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => {
    fetchTags()
    fetchFolders()
  }, [fetchTags, fetchFolders])

  useEffect(() => {
    const params = { sort: sortBy, order }
    if (search.trim()) params.q = search.trim()
    if (selectedTag) {
      const tagObj = tags.find((t) => t.id === selectedTag)
      if (tagObj) params.tag = tagObj.name
    }

    const timer = setTimeout(() => {
      if (search.trim() || selectedTag || sortBy !== 'createdAt' || order !== 'DESC') {
        searchDocuments(params)
      } else {
        fetchDocuments(currentFolderId)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search, selectedTag, sortBy, order, tags, currentFolderId, searchDocuments, fetchDocuments])

  const toggleSelect = (id, e) => {
    e.stopPropagation()
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === documents.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(documents.map((d) => d.id))
    }
  }

  const clearSelection = () => {
    setSelectedIds([])
    setConfirmBulkDelete(false)
  }

  const handleBulkDelete = async () => {
    setBulkLoading(true)
    try {
      await deleteMultipleDocuments(selectedIds)
      clearSelection()
    } catch {
      setBulkLoading(false)
    }
  }

  const currentFolder = folders.find((f) => f.id === currentFolderId)
  const heading = currentFolder ? `Папка: ${currentFolder.name}` : 'Мої документи'

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedTag={selectedTag} onSelectTag={setSelectedTag} />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <h1 className="text-xl font-bold text-white">{heading}</h1>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Пошук документів..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm w-64"
                />
              </div>

              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-')
                  setSortBy(s)
                  setOrder(o)
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="createdAt-DESC">Спочатку нові</option>
                <option value="createdAt-ASC">Спочатку старі</option>
                <option value="title-ASC">За назвою (А-Я)</option>
                <option value="title-DESC">За назвою (Я-А)</option>
                <option value="file_size-DESC">За розміром (більші)</option>
                <option value="file_size-ASC">За розміром (менші)</option>
              </select>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
              >
                + Додати
              </button>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between gap-4 mb-4 p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/30">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-indigo-300 hover:text-white transition"
                >
                  {selectedIds.length === documents.length ? 'Зняти всі' : 'Вибрати всі'}
                </button>
                <span className="text-sm text-slate-300">
                  Вибрано: <span className="font-semibold text-white">{selectedIds.length}</span> з {documents.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {confirmBulkDelete ? (
                  <>
                    <span className="text-sm text-red-400 mr-2">Точно видалити?</span>
                    <button
                      onClick={() => setConfirmBulkDelete(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 text-xs transition"
                    >
                      Ні
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      disabled={bulkLoading}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-medium transition"
                    >
                      {bulkLoading ? 'Видалення...' : 'Так, видалити'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 text-xs transition"
                    >
                      Скасувати
                    </button>
                    <button
                      onClick={() => setConfirmBulkDelete(true)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-medium transition"
                    >
                      Видалити ({selectedIds.length})
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">
                {search || selectedTag ? 'Нічого не знайдено' : 'Документів немає'}
              </p>
              <p className="text-sm mt-1">
                {search || selectedTag ? 'Спробуйте змінити фільтри' : 'Натисніть "+ Додати" щоб створити перший'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => {
                const isSelected = selectedIds.includes(doc.id)
                return (
                  <div key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`relative bg-slate-800 border rounded-2xl p-5 transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                        : 'border-slate-700 hover:border-indigo-500'
                    }`}>

                    <button
                      onClick={(e) => toggleSelect(doc.id, e)}
                      className={`absolute top-3 right-3 w-6 h-6 rounded-md flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-indigo-600 border border-indigo-500'
                          : 'bg-slate-900 border border-slate-600 opacity-0 group-hover:opacity-100 hover:opacity-100'
                      }`}
                      style={isSelected ? {} : { opacity: 1 }}
                      title={isSelected ? 'Зняти вибір' : 'Вибрати'}
                    >
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <div className="flex items-start justify-between mb-3 pr-8">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                        <FileIcon fileName={doc.original_name} fileType={doc.file_type} className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(doc.createdAt).toLocaleDateString('uk-UA')}
                      </span>
                    </div>

                    <h3 className="font-semibold text-white mb-1 truncate">{doc.title}</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                      {doc.description || 'Без опису'}
                    </p>

                    {doc.Tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {doc.Tags.map((tag) => (
                          <span key={tag.id}
                            className="px-2 py-0.5 rounded-full bg-indigo-600/20 text-indigo-300 text-xs">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <AddDocumentModal onClose={() => setShowAddModal(false)} />
      )}

      {selectedDoc && (
        <DocumentDetailsModal
          document={documents.find((d) => d.id === selectedDoc.id) || selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  )
}