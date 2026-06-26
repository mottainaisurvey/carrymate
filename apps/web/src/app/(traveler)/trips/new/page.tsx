import nextDynamic from 'next/dynamic'
export const dynamic = 'force-dynamic'
const PostTripClient = nextDynamic(() => import('@/components/traveler/PostTripClient'), { ssr: false, loading: () => <div className="min-h-screen" style={{ background: 'var(--cream)' }} /> })
export default function PostTripPage() { return <PostTripClient /> }
