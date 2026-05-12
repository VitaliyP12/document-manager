import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocStore } from '../store/docStore'
import Navbar from '../components/Navbar'

export default function StatsPage() {
  const { fetchStats, tags, fetchTags, documents, fetchDocuments } = useDocStore()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await fetchTags()
      await fetchDocuments()
      const data = await fetchStats()
      setStats(data)
      setLoading(false)
    }
    load()
  }, [fetchStats, fetchTags, fetchDocuments])

  const totalSize = documents.reduce((sum, d) => sum + (d.file_size || 0), 0)
  const sizeInMB = (totalSize / 1024 / 1024).toFixed(2)

  const tagsWithCount = tags.map((tag) => ({
    ...tag,
    count: documents.filter((d) => d.Tags?.some((t) => t.id === tag.id)).length,
  })).sort((a, b) => b.count - a.count)

  const maxTagCount = Math.max(...tagsWithCount.map((t) => t.count), 1)

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Статистика</h1>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition"
            >
              ← До документів
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-slate-500 py-12">Завантаження...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  label="Всього документів"
                  value={stats?.totalDocuments || 0}
                  color="indigo"
                  icon={
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  }
                />
                <StatCard
                  label="Всього тегів"
                  value={stats?.totalTags || 0}
                  color="pink"
                  icon={
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  }
                />
                <StatCard
                  label="Загальний розмір"
                  value={`${sizeInMB} MB`}
                  color="emerald"
                  icon={
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  }
                />
                <StatCard
                  label="Документів з тегами"
                  value={documents.filter((d) => d.Tags?.length > 0).length}
                  color="yellow"
                  icon={
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M5 13l4 4L19 7" />
                  }
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                    Останні документи
                  </h2>

                  {stats?.recentDocuments?.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700"
                        >
                          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{doc.title}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(doc.createdAt).toLocaleDateString('uk-UA')}
                            </p>
                          </div>
                          {doc.Tags?.length > 0 && (
                            <span className="text-xs text-slate-500 flex-shrink-0">
                              {doc.Tags.length} {doc.Tags.length === 1 ? 'тег' : 'теги'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-8">
                      Документів ще немає
                    </p>
                  )}
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                    Розподіл по тегах
                  </h2>

                  {tagsWithCount.length > 0 ? (
                    <div className="space-y-3">
                      {tagsWithCount.map((tag, i) => {
                        const colors = ['bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500']
                        const color = colors[i % colors.length]
                        const percent = (tag.count / maxTagCount) * 100

                        return (
                          <div key={tag.id}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${color}`} />
                                <span className="text-sm text-slate-200">{tag.name}</span>
                              </div>
                              <span className="text-xs text-slate-500">
                                {tag.count} {tag.count === 1 ? 'документ' : 'документів'}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                              <div
                                className={`h-full ${color} transition-all`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-8">
                      Тегів ще немає
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  const colorMap = {
    indigo: 'bg-indigo-600/20 text-indigo-400',
    pink: 'bg-pink-600/20 text-pink-400',
    emerald: 'bg-emerald-600/20 text-emerald-400',
    yellow: 'bg-yellow-600/20 text-yellow-400',
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
      <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}