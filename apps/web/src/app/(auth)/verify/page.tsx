import Link from 'next/link'

export default function VerifyPage() {
  return (
    <div className="w-full max-w-md text-center">
      <div
        className="rounded-3xl p-10 shadow-sm"
        style={{ background: 'white', border: '1px solid var(--border)' }}
      >
        <div className="text-5xl mb-6">📬</div>
        <h1 className="font-serif text-3xl font-black mb-3" style={{ color: 'var(--ink)' }}>
          Check your inbox
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
          We've sent a confirmation link to your email address. Click the link to activate your account and get started.
        </p>

        <div
          className="rounded-2xl p-5 mb-8 text-sm"
          style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
        >
          <strong>Didn't receive it?</strong> Check your spam folder or wait a minute and try again.
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
          style={{ background: 'var(--teal)', color: 'white' }}
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
