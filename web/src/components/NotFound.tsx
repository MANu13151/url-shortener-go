import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Shortly — Link Not Found</title>
        <meta
          name="description"
          content="This short link does not exist or has already expired."
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
              This link does not exist or has expired.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full rounded-lg bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-white"
            >
              Create a New URL
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
