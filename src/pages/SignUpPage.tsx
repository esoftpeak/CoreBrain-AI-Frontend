import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { EyeIcon } from '../components/EyeIcon'
import { useAuth } from '../context/AuthProvider'
import { ApiError, api } from '../lib/api'

export function SignUpPage() {
  const navigate = useNavigate()
  const { refreshSession } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const fullName = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const result = await api.signUp({ fullName, email, password })
      await refreshSession()

      if (!result.needsEmailVerification && result.user.emailConfirmed) {
        navigate('/app')
        return
      }

      navigate('/signup/check-email', { state: { email } })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign-up failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-[#fafafa]">Sign up</h1>
          <p className="text-base text-[#fafafa]">
            Sign-up includes email verification. Submit the form and we&apos;ll send a link to finish.
          </p>
        </div>

        {error ? (
          <p className="rounded border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm text-[#fafafa]">
            Full name<span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={submitting}
            className="h-10 w-full rounded border border-zinc-800 bg-transparent px-3 text-sm text-[#fafafa] outline-none focus:border-zinc-600 disabled:opacity-60"
          />
        </div>

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
              minLength={8}
              autoComplete="new-password"
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

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm text-[#fafafa]">
            Confirm password<span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              disabled={submitting}
              className="h-10 w-full rounded border border-zinc-800 bg-transparent px-3 pr-10 text-sm text-[#fafafa] outline-none focus:border-zinc-600 disabled:opacity-60"
            />
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 hover:text-zinc-200"
            >
              <EyeIcon open={showConfirmPassword} />
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="h-10 w-full rounded-full bg-white text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Starting sign-up...' : 'Sign up'}
          </button>
        </div>

        <p className="text-center text-sm text-[#fafafa]">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-400">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
