import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { ApiError, api } from '../lib/api'

type CheckEmailLocationState = {
  email?: string
}

export function SignUpCheckEmailPage() {
  const location = useLocation()
  const state = location.state as CheckEmailLocationState | null
  const email = state?.email
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!email) {
    return <Navigate to="/signup" replace />
  }

  async function handleResend() {
    if (!email) return

    setResending(true)
    setError(null)
    setMessage(null)

    try {
      await api.resendVerification(email)
      setMessage('Verification email sent again. Open the link to complete your sign-up.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not resend verification email.')
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-[#fafafa]">Verify your email</h1>
          <p className="text-base text-[#fafafa]">
            Sign-up is in progress. We sent a verification link to:
          </p>
          <p className="text-base font-medium text-[#fafafa]">{email}</p>
        </div>

        <p className="text-sm text-zinc-300">
          Open the link in that email to verify your address. That link is the final step of sign-up,
          not a separate registration step.
        </p>

        {error ? (
          <p className="rounded border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded border border-emerald-900/60 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300" role="status">
            {message}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="h-10 w-full rounded-full border border-zinc-800 bg-transparent text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending ? 'Sending...' : 'Resend verification email'}
        </button>

        <p className="text-center text-sm text-[#fafafa]">
          Wrong email?{' '}
          <Link to="/signup" className="text-blue-500 hover:text-blue-400">
            Start sign-up again
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
