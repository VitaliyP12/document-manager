import { useEffect, useState } from 'react'
import { useDocStore } from '../store/docStore'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AddDocumentModal from '../components/AddDocumentModal'
import DocumentDetailsModal from '../components/DocumentDetailsModal'

export default function DashboardPage() {
  const { documents, fetchDocuments, fetchTags } = useDocStore()
  const [selectedTag, setSelectedTag] = useState(null)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)

  useEffect(() => {
    fetchDocuments()
    fetchTags()
  }, [fetchDocuments, fetchTags])

  const filtered = documents.filter((doc) => {
    const matchesTag = selectedTag
      ? doc.Tags?.some((t) => t.id === selectedTag)
      : true
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase())
    return matchesTag && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedTag={selectedTag} onSelectTag={setSelectedTag} />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Заголовок + пошук */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Мої документи</h1>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Пошук документів..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm w-64"
              />
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition"
              >
                + Додати
              </button>
            </div>
          </div>

          {/* Список документів */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">Документів немає</p>
              <p className="text-sm mt-1">Натисніть "+ Додати" щоб створити перший</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((doc) => (
                <div key={doc.id}
                 onClick={() => setSelectedDoc(doc)}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-indigo-500 transition cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
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
              ))}
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