import { useState } from 'react'
import { useDocStore } from '../store/docStore'
import TagsManagerModal from './TagsManagerModal'
import FoldersList from './FoldersList'

export default function Sidebar({ selectedTag, onSelectTag }) {
  const { tags } = useDocStore()
  const [showTagsManager, setShowTagsManager] = useState(false)

  const colors = [
    'bg-indigo-500', 'bg-pink-500', 'bg-emerald-500',
    'bg-yellow-500', 'bg-blue-500', 'bg-purple-500',
  ]

  return (
    <>
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Фільтр за тегами
          </h2>
          <button
            onClick={() => setShowTagsManager(true)}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Управління тегами"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

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
          <button
            onClick={() => setShowTagsManager(true)}
            className="mt-2 text-indigo-400 hover:text-indigo-300 text-xs"
          >
            + Створити перший тег
          </button>
        )}

        <FoldersList />
      </aside>

      {showTagsManager && (
        <TagsManagerModal onClose={() => setShowTagsManager(false)} />
      )}
    </>
  )
}