import { useDocStore } from '../store/docStore'

export default function Sidebar({ selectedTag, onSelectTag }) {
  const { tags } = useDocStore()

  const colors = [
    'bg-indigo-500', 'bg-pink-500', 'bg-emerald-500',
    'bg-yellow-500', 'bg-blue-500', 'bg-purple-500',
  ]

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col p-4">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Фільтр за тегами
      </h2>

      <button
        onClick={() => onSelectTag(null)}
        className={`text-left px-3 py-2 rounded-lg text-sm mb-1 transition ${
          selectedTag === null
            ? 'bg-indigo-600 text-white'
            : 'text-slate-300 hover:bg-slate-700'
        }`}
      >
        Всі документи
      </button>

      <div className="space-y-1 mt-1">
        {tags.map((tag, i) => (
          <button
            key={tag.id}
            onClick={() => onSelectTag(tag.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center gap-2 ${
              selectedTag === tag.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
            {tag.name}
          </button>
        ))}
      </div>

      {tags.length === 0 && (
        <p className="text-slate-500 text-xs mt-2">Теги відсутні</p>
      )}
    </aside>
  )
}