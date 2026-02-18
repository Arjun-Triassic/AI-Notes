import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight">AI Notes</h1>
        <Outlet />
      </div>
    </div>
  )
}


