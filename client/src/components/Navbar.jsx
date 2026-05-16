import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center px-6 justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg">DocManager</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              location.pathname === '/'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Документи
          </Link>
          <Link
            to="/stats"
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              location.pathname === '/stats'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Статистика
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
  <Link
    to="/profile"
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition ${
      location.pathname === '/profile'
        ? 'bg-slate-700 text-white'
        : 'text-slate-400 hover:text-white hover:bg-slate-700'
    }`}
  >
    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
      {(user?.name || user?.email || '?')[0].toUpperCase()}
    </div>
    <span>{user?.name || user?.email}</span>
  </Link>
  <button
    onClick={handleLogout}
    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-sm transition"
  >
    Вийти
      </button>
    </div>
  </header>
  )
}