import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-[#fafafa]">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!user.emailConfirmed) {
    return <Navigate to="/signup/check-email" replace state={{ email: user.email }} />
  }

  return children
}

type GuestRouteProps = {
  children: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-[#fafafa]">
        Loading...
      </div>
    )
  }

  if (user?.emailConfirmed) {
    return <Navigate to="/app" replace />
  }

  return children
}
