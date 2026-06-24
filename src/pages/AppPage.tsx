import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { ApiError, api } from '../lib/api'

export function AppPage() {
  const { user, signOut } = useAuth()
  const [fullName, setFullName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const data = await api.getMe()
        if (mounted) setFullName(data.user.fullName)
      } catch (err) {
        if (mounted) {
          setError(err instanceof ApiError ? err.message : 'Could not load your profile from the API.')
        }
      }
    }

    void loadProfile()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-[#fafafa]">
      <div className="mx-auto max-w-2xl space-y-6 rounded-md border border-zinc-800 bg-[#111111] p-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Welcome to CoreBrain.ai</h1>
          <p className="text-zinc-300">You are signed in and your sign-up is complete.</p>
        </div>

        <div className="space-y-2 text-sm text-zinc-300">
          <p>
            <span className="text-zinc-400">Email:</span> {user?.email}
          </p>
          <p>
            <span className="text-zinc-400">Verified:</span> {user?.emailConfirmed ? 'Yes' : 'No'}
          </p>
          {fullName !== null ? (
            <p>
              <span className="text-zinc-400">Full name:</span> {fullName || '—'}
            </p>
          ) : null}
          {error ? <p className="text-red-300">{error}</p> : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void signOut()}
            className="h-10 rounded-full border border-zinc-800 px-5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-900"
          >
            Sign out
          </button>
          <Link to="/login" className="inline-flex h-10 items-center text-sm text-blue-400 hover:text-blue-300">
            Sign-in page
          </Link>
        </div>
      </div>
    </div>
  )
}
