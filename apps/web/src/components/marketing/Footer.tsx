import Link from 'next/link'

const LINKS: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Active corridors', href: '/corridors' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Mobile app', href: '#' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  Support: [
    { label: 'Help centre', href: '#' },
    { label: 'Trust & Safety', href: '/trust' },
    { label: 'Dispute resolution', href: '#' },
    { label: 'Contact us', href: '#' },
  ],
  Legal: [
    { label: 'Privacy policy', href: '/legal/privacy' },
    { label: 'Terms of service', href: '/legal/terms' },
    { label: 'Cookie policy', href: '/legal/cookies' },
  ],
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'white' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-xl font-black mb-3 block" style={{ color: 'white' }}>
              Carry<span style={{ color: 'var(--teal-light)' }}>Mate</span>
            </Link>
            <p className="text-sm opacity-60 leading-relaxed">
              Community-powered logistics for the diaspora.
            </p>
            <div className="flex gap-3 mt-4">
              {['𝕏', 'in', 'f'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:opacity-70"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <div className="text-xs font-black uppercase tracking-widest mb-4 opacity-50">
                {category}
              </div>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith('/') ? (
                      <Link
                        href={href}
                        className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-50"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span>© {new Date().getFullYear()} CarryMate Ltd. All rights reserved.</span>
          <span>Made with ♥ for the diaspora community</span>
        </div>
      </div>
    </footer>
  )
}
