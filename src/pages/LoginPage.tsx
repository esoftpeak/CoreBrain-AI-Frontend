import { useState } from 'react'
import { Logo } from '../components/Logo'

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  )
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center bg-black px-4 py-10 sm:px-8">
        <div
          className="w-full max-w-[390px] rounded-md border border-zinc-800 bg-[#111111] shadow-[0_4px_8px_rgba(0,0,0,0.64),inset_0_0_1px_rgba(212,212,216,0.3)]"
        >
          <div className="p-8">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <h1 className="text-lg font-semibold text-[#fafafa]">Login</h1>
                <p className="text-base text-[#fafafa]">
                  Enter your email below to log into your account
                </p>
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
                  className="h-10 w-full rounded border border-zinc-800 bg-transparent px-3 text-sm text-[#fafafa] outline-none focus:border-zinc-600"
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
                    className="h-10 w-full rounded border border-zinc-800 bg-transparent px-3 pr-10 text-sm text-[#fafafa] outline-none focus:border-zinc-600"
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

              <a href="#" className="block text-base text-blue-500 hover:text-blue-400">
                Forgot Password?
              </a>

              <div className="space-y-3 pt-1">
                <button
                  type="submit"
                  className="h-10 w-full rounded-full bg-white text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className="h-10 w-full rounded-full border border-zinc-800 bg-transparent text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-900"
                >
                  Send me a sign-in link
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden lg:block">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgb(176, 122, 0) 0%, rgb(224, 176, 0) 50%, rgb(176, 122, 0) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle, rgba(255,220,120,0.25) 0%, rgba(255,220,120,0) 60%)',
          }}
        />

        <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
          <Logo className="h-56 w-56 max-w-[70%] object-contain" />
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-zinc-950">CoreBrain.ai</h2>
          <p className="mt-1 text-lg text-zinc-900">Your Own AI Department</p>
        </div>
      </aside>
    </div>
  )
}
