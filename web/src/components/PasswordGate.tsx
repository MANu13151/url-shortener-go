import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { unlockURL } from '../api/urls'
import { translateError } from '../utils/errors'

type GateState = 'checking' | 'protected' | 'not_found'

export default function PasswordGate() {
  const { slug }                    = useParams<{ slug: string }>()
  const [gateState, setGateState]   = useState<GateState>('checking')
  const [password, setPassword]     = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  // Probe with an empty password on mount: if the link is not protected the
  // backend returns the target URL immediately and we can skip the form entirely.
  useEffect(() => {
    async function probe() {
      try {
        const { target_url } = await unlockURL(slug!, '')
        window.location.href = target_url
      } catch (err) {
        const message = err instanceof Error ? err.message : ''
        if (message === 'URL not found or expired') {
          setGateState('not_found')
        } else {
          setGateState('protected')
        }
      }
    }
    probe()
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { target_url } = await unlockURL(slug!, password)
      window.location.href = target_url
    } catch (err) {
      setError(err instanceof Error ? translateError(err.message) : 'Something went wrong.')
      setLoading(false)
    }
  }

  if (gateState === 'checking') {
    return (
      <>
        <Helmet>
          <title>Shortly — Verifying Link</title>
          <meta
            name="description"
            content="Checking whether this short link is password-protected or still active."
          />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <p className="text-sm text-zinc-500">Checking link…</p>
        </div>
      </>
    )
  }

  if (gateState === 'not_found') {
    return (
      <>
        <Helmet>
          <title>Shortly — Link Not Found</title>
          <meta
            name="description"
            content="This short link does not exist or has expired."
          />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8 text-center">
              <span className="text-4xl">🔗</span>
              <h2 className="mt-3 text-xl font-semibold text-zinc-50">
                Link Not Found
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                This short link does not exist or has already expired.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Shortly — Password Required</title>
        <meta
          name="description"
          content="This link is password-protected. Enter the password to be redirected to the target URL."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
            <div className="mb-6 text-center">
              <span className="text-4xl">🔒</span>
              <h1 className="mt-3 text-xl font-semibold text-zinc-50">
                Password Required
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                This link is protected with a password
              </p>
              <code className="mt-2 inline-block rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                /{slug}
              </code>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
              />

              {error && (
                <p className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-2.5 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Verifying…' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
