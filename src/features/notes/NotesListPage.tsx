import { FormEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'

type Note = {
  id: number
  title: string
  content: string
}

export function NotesListPage() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState<string | null>(null)

  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const res = await api.get<Note[]>('/notes/')
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/notes/', { title, content })
    },
    onSuccess: () => {
      setTitle('')
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const summarizeMutation = useMutation({
    mutationFn: async (noteId: number) => {
      const res = await api.post<{ summary: string }>('/ai/summarize-note', null, {
        params: { note_id: noteId },
      })
      return res.data.summary
    },
    onSuccess: (s) => {
      setSummary(s)
    },
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    createMutation.mutate()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold tracking-tight">New note</h2>
        <input
          className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="h-28 w-full resize-none rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full rounded-md bg-indigo-500 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-60"
        >
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </form>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Your notes</span>
          {notesQuery.isLoading && <span>Loading...</span>}
        </div>
        <div className="space-y-2">
          {notesQuery.data?.map((note) => (
            <div
              key={note.id}
              className="space-y-1 rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs"
            >
              <div className="font-medium text-slate-100">{note.title}</div>
              <p className="line-clamp-3 text-slate-400">{note.content}</p>
              <button
                type="button"
                onClick={() => summarizeMutation.mutate(note.id)}
                className="mt-1 rounded-md border border-slate-700 px-2 py-1 text-[11px] hover:bg-slate-800"
              >
                Summarize with AI
              </button>
            </div>
          ))}
          {notesQuery.data?.length === 0 && (
            <p className="text-xs text-slate-500">No notes yet. Create your first note above.</p>
          )}
        </div>

        {summary && (
          <div className="mt-4 rounded-lg border border-indigo-700/60 bg-indigo-950/40 p-3 text-xs text-indigo-50">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-300">
              AI Summary
            </div>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  )
}


