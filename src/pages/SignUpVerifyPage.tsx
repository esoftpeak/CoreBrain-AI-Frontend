import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { useAuth } from '../context/AuthProvider'
import { ApiError, api } from '../lib/api'

type VerifyStatus = 'verifying' | 'success' | 'error'

export function SignUpVerifyPage() {
  const { refreshSession } = useAuth()
  const [status, setStatus] = useState<VerifyStatus>('verifying')
  const [message, setMessage] = useState('Verifying your email to finish sign-up...')

  useEffect(() => {
    let mounted = true

    async function finishSignUp() {
      const searchParams = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))

      const authError =
        searchParams.get('error_description') ??
        hashParams.get('error_description') ??
        searchParams.get('error') ??
        hashParams.get('error')

      if (authError) {
        if (!mounted) return
        setStatus('error')
        setMessage(decodeURIComponent(authError.replace(/\+/g, ' ')))
        return
      }

      const code = searchParams.get('code')
      const accessToken = hashParams.get('access_token') ?? undefined
      const refreshToken = hashParams.get('refresh_token') ?? undefined

      if (!code && !(accessToken && refreshToken)) {
        if (!mounted) return
        setStatus('error')
        setMessage('This sign-up link is invalid or has expired. Start sign-up again to receive a new link.')
        return
      }

      try {
        await api.verify({
          code: code ?? undefined,
          accessToken,
          refreshToken,
        })
        await refreshSession()

        if (!mounted) return
        setStatus('success')
        setMessage('Your email is verified. Sign-up is complete.')
        window.history.replaceState({}, document.title, '/signup/verify')
      } catch (err) {
        if (!mounted) return
        setStatus('error')
        setMessage(err instanceof ApiError ? err.message : 'Verification failed. Please try again.')
      }
    }

    void finishSignUp()

    return () => {
      mounted = false
    }
  }, [refreshSession])

  return (
    <AuthLayout>
      <div className="space-y-5 text-center">
        {status === 'verifying' ? (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-[#fafafa]">Finishing sign-up</h1>
              <p className="text-base text-zinc-300">{message}</p>
            </div>
          </>
        ) : null}

        {status === 'success' ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-[#fafafa]">Sign-up complete</h1>
              <p className="text-base text-zinc-300">{message}</p>
            </div>
            <Link
              to="/login"
              className="inline-flex h-10 w-full items-center justify-center rounded-full bg-white text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
            >
              Continue to sign in
            </Link>
          </>
        ) : null}

        {status === 'error' ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </div>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-[#fafafa]">Sign-up not completed</h1>
              <p className="text-base text-zinc-300">{message}</p>
            </div>
            <div className="space-y-3">
              <Link
                to="/signup"
                className="inline-flex h-10 w-full items-center justify-center rounded-full bg-white text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
              >
                Start sign-up again
              </Link>
              <Link
                to="/login"
                className="inline-flex h-10 w-full items-center justify-center rounded-full border border-zinc-800 bg-transparent text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-900"
              >
                Back to sign in
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </AuthLayout>
  )
}
