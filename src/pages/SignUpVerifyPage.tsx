import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { authHeadingClass, authMutedTextClass, authPrimaryButtonClass, authSecondaryButtonClass } from '../components/auth/auth-classes'
import { useAuth } from '../context/AuthProvider'
import { useToast } from '../context/ToastProvider'
import { ApiError, api } from '../lib/api'
import { notifyVerificationComplete } from '../lib/auth-sync'

type VerifyStatus = 'verifying' | 'success' | 'error'

export function SignUpVerifyPage() {
  const navigate = useNavigate()
  const { setSessionUser } = useAuth()
  const { showToast } = useToast()
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
      const tokenHash = searchParams.get('token_hash') ?? searchParams.get('token')
      const verifyType = searchParams.get('type') ?? 'signup'
      const accessToken = hashParams.get('access_token') ?? undefined
      const refreshToken = hashParams.get('refresh_token') ?? undefined

      if (!code && !tokenHash && !(accessToken && refreshToken)) {
        if (!mounted) return
        setStatus('error')
        setMessage('This sign-up link is invalid or has expired. Start sign-up again to receive a new link.')
        return
      }

      try {
        const { user } = await api.verify({
          code: code ?? undefined,
          token_hash: tokenHash ?? undefined,
          type: verifyType,
          accessToken,
          refreshToken,
        })
        setSessionUser(user)
        notifyVerificationComplete()

        if (!mounted) return
        setStatus('success')
        setMessage('Your email is verified. Taking you to your dashboard...')
        window.history.replaceState({}, document.title, '/signup/verify')
        showToast('Sign-up complete. Welcome to CoreBrain.ai!', 'success')
        navigate('/dashboard', { replace: true })
      } catch (err) {
        if (!mounted) return
        setStatus('error')
        const errorMessage = err instanceof ApiError ? err.message : 'Verification failed. Please try again.'
        setMessage(errorMessage)
        showToast(errorMessage, 'error')
      }
    }

    void finishSignUp()

    return () => {
      mounted = false
    }
  }, [navigate, setSessionUser, showToast])

  return (
    <AuthLayout>
      <div className="space-y-5 text-center">
        {status === 'verifying' ? (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200" />
            <div className="space-y-1">
              <h1 className={authHeadingClass}>Finishing sign-up</h1>
              <p className={authMutedTextClass}>{message}</p>
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
              <h1 className={authHeadingClass}>Sign-up complete</h1>
              <p className={authMutedTextClass}>{message}</p>
            </div>
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
              <h1 className={authHeadingClass}>Sign-up not completed</h1>
              <p className={authMutedTextClass}>{message}</p>
            </div>
            <div className="space-y-3">
              <Link to="/signup" className={`inline-flex ${authPrimaryButtonClass}`}>
                Start sign-up again
              </Link>
              <Link to="/login" className={`inline-flex ${authSecondaryButtonClass}`}>
                Back to sign in
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </AuthLayout>
  )
}
