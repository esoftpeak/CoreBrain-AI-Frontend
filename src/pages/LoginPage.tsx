import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { EyeIcon } from '../components/EyeIcon'
import { useAuth } from '../context/AuthProvider'
import { ApiError, api } from '../lib/api'

export function LoginPage() {
  const navigate = useNavigate()
  const { refreshSession } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await api.signIn({ email, password })
      await refreshSession()
      navigate('/app')
    } catch (err) {
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_CONFIRMED') {
        navigate('/signup/check-email', { state: { email: err.email ?? email } })
        return
      }
      setError(err instanceof ApiError ? err.message : 'Sign-in failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-[#fafafa]">Sign in</h1>
          <p className="text-base text-[#fafafa]">
            Enter your email below to sign in to your account
          </p>
        </div>

        {error ? (
          <p className="rounded border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-[#fafafa]">
            Email<span className="text-red-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={submitting}
            className="h-10 w-full rounded border border-zinc-800 bg-transparent px-3 text-sm text-[#fafafa] outline-none focus:border-zinc-600 disabled:opacity-60"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-[#fafafa]">
            Password<span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              disabled={submitting}
              className="h-10 w-full rounded border border-zinc-800 bg-transparent px-3 pr-10 text-sm text-[#fafafa] outline-none focus:border-zinc-600 disabled:opacity-60"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 hover:text-zinc-200"
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="h-10 w-full rounded-full bg-white text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p className="text-center text-sm text-[#fafafa]">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:text-blue-400">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
