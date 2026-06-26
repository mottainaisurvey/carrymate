import nextDynamic from 'next/dynamic'
export const dynamic = 'force-dynamic'
const SendPayClient = nextDynamic(() => import('@/components/sender/SendPayClient'), { ssr: false, loading: () => <div className="min-h-screen" style={{ background: 'var(--cream)' }} /> })
export default function PaymentPage() { return <SendPayClient /> }
