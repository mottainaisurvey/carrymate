import nextDynamic from 'next/dynamic'

export const dynamic = 'force-dynamic'

const DashboardClient = nextDynamic(
  () => import('@/components/dashboard/DashboardClient'),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--cream)' }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }}
        />
      </div>
    ),
  }
)

export default function DashboardPage() {
  return <DashboardClient />
}
