import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { trpc } from '../../lib/trpc'
import { supabase } from '../../lib/supabase'

const TIER_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  bronze: { bg: '#fef3c7', text: '#92400e', emoji: '🥉' },
  silver: { bg: '#f1f5f9', text: '#475569', emoji: '🥈' },
  gold: { bg: '#fef9c3', text: '#854d0e', emoji: '🥇' },
  platinum: { bg: '#ede9fe', text: '#5b21b6', emoji: '💎' },
}

const KYC_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Not Started', color: '#92400e' },
  submitted: { label: 'Under Review', color: '#1e40af' },
  approved: { label: 'Verified', color: '#15803d' },
  rejected: { label: 'Rejected', color: '#991b1b' },
}

export default function ProfileScreen() {
  const router = useRouter()
  const { data: user, isLoading } = trpc.users.me.useQuery()

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut()
          router.replace('/welcome')
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D7A5F" />
      </View>
    )
  }

  const tier = TIER_COLORS[user?.carrierTier ?? 'bronze']
  const kyc = KYC_STATUS[user?.kycStatus ?? 'pending']

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.fullName ?? 'Unknown'}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
        {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
      </View>

      {/* Tier badge */}
      <View style={[styles.tierCard, { backgroundColor: tier.bg }]}>
        <Text style={styles.tierEmoji}>{tier.emoji}</Text>
        <View>
          <Text style={[styles.tierName, { color: tier.text }]}>
            {(user?.carrierTier ?? 'bronze').charAt(0).toUpperCase() +
              (user?.carrierTier ?? 'bronze').slice(1)}{' '}
            Carrier
          </Text>
          <Text style={[styles.tierSub, { color: tier.text }]}>
            {user?.role === 'sender'
              ? 'Sender account'
              : user?.role === 'traveler'
              ? 'Traveler account'
              : 'Sender & Traveler'}
          </Text>
        </View>
      </View>

      {/* KYC status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identity Verification</Text>
        <View style={styles.kycRow}>
          <Text style={styles.kycLabel}>KYC Status</Text>
          <Text style={[styles.kycValue, { color: kyc.color }]}>{kyc.label}</Text>
        </View>
        {user?.kycStatus !== 'approved' && (
          <TouchableOpacity
            style={styles.kycBtn}
            onPress={() => router.push('/(auth)/kyc')}
          >
            <Text style={styles.kycBtnText}>
              {user?.kycStatus === 'pending' ? 'Complete Verification' : 'Resubmit Documents'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Account info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <InfoRow label="Full name" value={user?.fullName ?? '—'} />
        <InfoRow label="Phone" value={user?.phone ?? '—'} />
        <InfoRow label="Email" value={user?.email ?? 'Not set'} />
        <InfoRow label="Role" value={user?.role ?? '—'} />
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  inner: { padding: 16, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1D7A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 34, fontWeight: '700', color: '#fff' },
  name: { fontSize: 22, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  phone: { fontSize: 15, color: '#666' },
  email: { fontSize: 14, color: '#888', marginTop: 2 },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    gap: 14,
  },
  tierEmoji: { fontSize: 36 },
  tierName: { fontSize: 17, fontWeight: '700' },
  tierSub: { fontSize: 13, marginTop: 2 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  kycRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    marginBottom: 12,
  },
  kycLabel: { fontSize: 14, color: '#888' },
  kycValue: { fontSize: 14, fontWeight: '700' },
  kycBtn: {
    backgroundColor: '#1D7A5F',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  kycBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoLabel: { fontSize: 14, color: '#888' },
  infoValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '500' },
  signOutBtn: {
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  signOutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
})
