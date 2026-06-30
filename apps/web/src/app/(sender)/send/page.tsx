import nextDynamic from 'next/dynamic'

export const dynamic = 'force-dynamic'

const SendParcelClient = nextDynamic(
  () => import('@/components/sender/SendParcelClient'),
  { ssr: false, loading: () => <div className="min-h-screen" style={{ background: 'var(--cream)' }} /> }
)

export default function SendParcelPage() {
  return <SendParcelClient />
}
