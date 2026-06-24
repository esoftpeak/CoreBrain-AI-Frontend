import type { ReactNode } from 'react'
import { Logo } from './Logo'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center bg-black px-4 py-10 sm:px-8">
        <div className="w-full max-w-[390px] rounded-md border border-zinc-800 bg-[#111111] shadow-[0_4px_8px_rgba(0,0,0,0.64),inset_0_0_1px_rgba(212,212,216,0.3)]">
          <div className="p-8">{children}</div>
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
