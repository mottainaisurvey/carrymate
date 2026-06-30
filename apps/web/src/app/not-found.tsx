import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 1.5rem' }}>
        <p style={{ fontSize: '6rem', fontWeight: 900, marginBottom: '1rem', color: '#1a6b5a' }}>404</p>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.75rem', color: '#1a1a2e' }}>
          Page not found
        </h1>
        <p style={{ fontSize: '1rem', marginBottom: '2rem', color: '#6b7280' }}>
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '0.875rem',
            background: '#1a6b5a',
            color: 'white',
            textDecoration: 'none',
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
