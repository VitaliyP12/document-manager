import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import Navbar from '../components/Navbar'

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuthStore()

  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [profileLoading, setProfileLoading] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState(null)

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', email: user.email || '' })
    }
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    const result = await updateProfile(profileForm)
    setProfileLoading(false)
    if (result === true) {
      toast.success('Профіль оновлено')
    } else {
      toast.error(result.error || 'Помилка')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError(null)

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Паролі не співпадають')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Новий пароль має бути не менше 6 символів')
      return
    }

    setPasswordLoading(true)
    const result = await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })
    setPasswordLoading(false)

    if (result === true) {
      toast.success('Пароль успішно змінено')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      setPasswordError(result.error || 'Помилка')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Navbar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">Профіль користувача</h1>
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition"
            >
              ← До документів
            </Link>
          </div>

          <div className="flex items-center gap-4 p-6 bg-slate-800 border border-slate-700 rounded-2xl mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {(user?.name || user?.email || '?')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{user?.name || 'Без імені'}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
              {user?.createdAt && (
                <p className="text-xs text-slate-500 mt-1">
                  Зареєстровано {new Date(user.createdAt).toLocaleDateString('uk-UA')}
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Особисті дані
            </h2>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Ім'я</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition"
              >
                {profileLoading ? 'Збереження...' : 'Зберегти зміни'}
              </button>
            </form>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Зміна пароля
            </h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Поточний пароль</label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Новий пароль</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Підтвердження нового пароля</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition"
              >
                {passwordLoading ? 'Зміна...' : 'Змінити пароль'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}