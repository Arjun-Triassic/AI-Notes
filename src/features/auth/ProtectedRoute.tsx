import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getToken } from '../../lib/auth'

type Props = {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const location = useLocation()
  const token = getToken()

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}


