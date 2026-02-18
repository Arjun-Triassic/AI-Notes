import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'
import { saveToken } from '../../lib/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)

      const res = await api.post('/auth/login', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      return res.data as { access_token: string }
    },
    onSuccess: (data) => {
      saveToken(data.access_token)
      navigate('/', { replace: true })
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-md bg-indigo-500 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-60"
      >
        {mutation.isPending ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="mt-2 text-center text-xs text-slate-400">
        No account?{' '}
        <Link to="/auth/register" className="text-indigo-400 hover:text-indigo-300">
          Register
        </Link>
      </p>
    </form>
  )
}


