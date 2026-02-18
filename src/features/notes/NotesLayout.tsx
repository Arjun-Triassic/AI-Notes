import { Link, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from '../../lib/auth'

export function NotesLayout() {
  const navigate = useNavigate()

  function handleLogout() {
    clearToken()
    navigate('/auth/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            AI Notes
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl gap-6 px-4 py-6">
        <div className="w-1/3">
          <Outlet />
        </div>
        <div className="hidden flex-1 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400 md:block">
          Select a note or create a new one, then click “Summarize with AI” to see an AI-generated summary here.
        </div>
      </main>
    </div>
  )
}


