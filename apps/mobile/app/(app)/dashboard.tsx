import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { trpc } from '../../lib/trpc'

const KYC_STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending Verification', color: '#92400e', bg: '#fef3c7' },
  submitted: { label: 'Under Review', color: '#1e40af', bg: '#dbeafe' },
  approved: { label: 'Verified ✓', color: '#15803d', bg: '#dcfce7' },
  rejected: { label: 'Verification Failed', color: '#991b1b', bg: '#fee2e2' },
}

export default function DashboardScreen() {
  const router = useRouter()
  const { data: user, isLoading, refetch, isRefetching } = trpc.users.me.useQuery()

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D7A5F" />
      </View>
    )
  }

  const kycStatus = KYC_STATUS_LABELS[user?.kycStatus ?? 'pending']
  // DB role enum: 'user' | 'sender' | 'traveler' | 'admin'
  const isSender = user?.role === 'sender' || user?.role === 'admin'
  const isTraveler = user?.role === 'traveler' || user?.role === 'admin'

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.inner}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#1D7A5F" />
      }
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          Hello, {user?.fullName?.split(' ')[0] ?? 'there'} 👋
        </Text>
        <Text style={styles.greetingSub}>What would you like to do today?</Text>
      </View>

      {/* KYC status banner */}
      {user?.kycStatus !== 'approved' && (
        <View style={[styles.kycBanner, { backgroundColor: kycStatus.bg }]}>
          <Text style={[styles.kycText, { color: kycStatus.color }]}>
            🪪 {kycStatus.label}
          </Text>
          {user?.kycStatus === 'pending' && (
            <TouchableOpacity onPress={() => router.push('/(auth)/kyc')}>
              <Text style={[styles.kycLink, { color: kycStatus.color }]}>Complete KYC →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Sender actions */}
      {isSender && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Sender</Text>
          <View style={styles.actionGrid}>
            <ActionCard
              emoji="➕"
              title="Post Parcel"
              desc="Send something home"
              onPress={() => router.push('/(app)/(sender)/post-parcel')}
              primary
            />
            <ActionCard
              emoji="📋"
              title="My Parcels"
              desc="Track your shipments"
              onPress={() => router.push('/(app)/(sender)/parcels')}
            />
          </View>
        </View>
      )}

      {/* Traveler actions */}
      {isTraveler && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✈️ Traveler</Text>
          <View style={styles.actionGrid}>
            <ActionCard
              emoji="🗓"
              title="Post Trip"
              desc="Register your journey"
              onPress={() => router.push('/(app)/(traveler)/post-trip')}
              primary
            />
            <ActionCard
              emoji="🔍"
              title="Browse Parcels"
              desc="Find parcels to carry"
              onPress={() => router.push('/(app)/(traveler)/browse')}
            />
            <ActionCard
              emoji="💰"
              title="Earnings"
              desc="View your income"
              onPress={() => router.push('/(app)/(traveler)/earnings')}
            />
          </View>
        </View>
      )}

      {/* Quick links */}
      <View style={styles.quickLinks}>
        <TouchableOpacity
          style={styles.quickLink}
          onPress={() => router.push('/(app)/notifications')}
        >
          <Text style={styles.quickLinkEmoji}>🔔</Text>
          <Text style={styles.quickLinkText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickLink}
          onPress={() => router.push('/(app)/profile')}
        >
          <Text style={styles.quickLinkEmoji}>👤</Text>
          <Text style={styles.quickLinkText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

function ActionCard({
  emoji,
  title,
  desc,
  onPress,
  primary,
}: {
  emoji: string
  title: string
  desc: string
  onPress: () => void
  primary?: boolean
}) {
  return (
    <TouchableOpacity
      style={[styles.actionCard, primary && styles.actionCardPrimary]}
      onPress={onPress}
    >
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={[styles.actionTitle, primary && styles.actionTitlePrimary]}>{title}</Text>
      <Text style={[styles.actionDesc, primary && styles.actionDescPrimary]}>{desc}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  inner: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  greeting: { marginBottom: 16 },
  greetingText: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  greetingSub: { fontSize: 15, color: '#888', marginTop: 4 },
  kycBanner: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  kycText: { fontSize: 14, fontWeight: '600' },
  kycLink: { fontSize: 13, fontWeight: '700' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  actionCardPrimary: { backgroundColor: '#1D7A5F' },
  actionEmoji: { fontSize: 28, marginBottom: 8 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  actionTitlePrimary: { color: '#fff' },
  actionDesc: { fontSize: 12, color: '#888' },
  actionDescPrimary: { color: 'rgba(255,255,255,0.8)' },
  quickLinks: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  quickLink: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickLinkEmoji: { fontSize: 24, marginBottom: 6 },
  quickLinkText: { fontSize: 13, fontWeight: '600', color: '#555' },
})
