import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from './features/auth/AuthLayout'
import { LoginPage } from './features/auth/LoginPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { NotesLayout } from './features/notes/NotesLayout'
import { NotesListPage } from './features/notes/NotesListPage'
import { NoteDetailPage } from './features/notes/NoteDetailPage'
import { ProtectedRoute } from './features/auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <NotesLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<NotesListPage />} />
        <Route path="notes/:id" element={<NoteDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
