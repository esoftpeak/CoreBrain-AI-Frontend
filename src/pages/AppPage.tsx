import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { appUrl, supabase } from '../lib/supabase'

type ProfileResponse = {
  user: {
    id: string
    email: string | undefined
    fullName: string | null
  }
}

export function AppPage() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        if (mounted) setError('No active session found.')
        return
      }

      const response = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        if (mounted) setError('Could not load your profile from the API.')
        return
      }

      const data = (await response.json()) as ProfileResponse
      if (mounted) setProfile(data)
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
            <span className="text-zinc-400">Verified:</span>{' '}
            {user?.email_confirmed_at ? 'Yes' : 'No'}
          </p>
          {profile ? (
            <p>
              <span className="text-zinc-400">Full name:</span> {profile.user.fullName ?? '—'}
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
          <a
            href={appUrl}
            className="inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
          >
            App home
          </a>
          <Link to="/login" className="inline-flex h-10 items-center text-sm text-blue-400 hover:text-blue-300">
            Sign-in page
          </Link>
        </div>
      </div>
    </div>
  )
}
