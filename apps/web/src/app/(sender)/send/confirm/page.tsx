import nextDynamic from 'next/dynamic'
export const dynamic = 'force-dynamic'
const SendConfirmClient = nextDynamic(() => import('@/components/sender/SendConfirmClient'), { ssr: false, loading: () => <div className="min-h-screen" style={{ background: 'var(--cream)' }} /> })
export default function ConfirmPage() { return <SendConfirmClient /> }
