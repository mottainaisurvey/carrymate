import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>
      {/* Simple header */}
      <header className="px-6 py-5">
        <Link href="/" className="font-serif text-xl font-black" style={{ color: 'var(--ink)' }}>
          Carry<span style={{ color: 'var(--teal)' }}>Mate</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        {children}
      </div>

      <footer className="px-6 py-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} CarryMate Ltd. &nbsp;·&nbsp;{' '}
        <a href="#" className="hover:underline">Privacy</a>
        &nbsp;·&nbsp;
        <a href="#" className="hover:underline">Terms</a>
      </footer>
    </div>
  )
}
