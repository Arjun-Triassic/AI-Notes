import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../lib/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/register', { email, password })
      return res.data
    },
    onSuccess: () => {
      navigate('/auth/login', { replace: true })
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
        {mutation.isPending ? 'Creating account...' : 'Create account'}
      </button>

      <p className="mt-2 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </form>
  )
}


