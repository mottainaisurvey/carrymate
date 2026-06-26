import nextDynamic from 'next/dynamic'
export const dynamic = 'force-dynamic'
const SendMatchClient = nextDynamic(() => import('@/components/sender/SendMatchClient'), { ssr: false, loading: () => <div className="min-h-screen" style={{ background: 'var(--cream)' }} /> })
export default function MatchTripsPage() { return <SendMatchClient /> }
