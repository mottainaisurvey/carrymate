import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { trpc } from '../../../lib/trpc'

const TIER_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  bronze:   { bg: '#fef3c7', text: '#92400e', emoji: '🥉' },
  silver:   { bg: '#f1f5f9', text: '#475569', emoji: '🥈' },
  gold:     { bg: '#fef9c3', text: '#854d0e', emoji: '🥇' },
  platinum: { bg: '#ede9fe', text: '#5b21b6', emoji: '💎' },
}

const TIER_THRESHOLDS: Record<string, string> = {
  bronze:   '0–4 deliveries',
  silver:   '5–14 deliveries',
  gold:     '15–29 deliveries',
  platinum: '30+ deliveries',
}

export default function EarningsScreen() {
  const { data: user, isLoading: userLoading } = trpc.users.me.useQuery()
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    refetch,
    isRefetching,
  } = trpc.bookings.list.useQuery({})

  const isLoading = userLoading || bookingsLoading

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D7A5F" />
      </View>
    )
  }

  // Only show bookings where this user is the traveler and status is delivered
  const deliveredBookings = (bookingsData ?? []).filter(
    (b) => b.travelerId === user?.id && b.status === 'delivered'
  )
  const pendingBookings = (bookingsData ?? []).filter(
    (b) => b.travelerId === user?.id && b.status !== 'delivered' && b.status !== 'cancelled'
  )

  const totalEarned = deliveredBookings.reduce(
    (sum, b) => sum + parseFloat(b.agreedPrice ?? '0'),
    0
  )
  const pendingAmount = pendingBookings.reduce(
    (sum, b) => sum + parseFloat(b.agreedPrice ?? '0'),
    0
  )

  const tier = user?.carrierTier ?? 'bronze'
  const tierStyle = TIER_COLORS[tier] ?? TIER_COLORS.bronze
  const completedCount = user?.completedDeliveries ?? deliveredBookings.length

  return (
    <FlatList
      data={deliveredBookings}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#1D7A5F" />
      }
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <>
          {/* Summary cards */}
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.summaryCardGreen]}>
              <Text style={styles.summaryLabel}>Total Earned</Text>
              <Text style={styles.summaryAmount}>£{totalEarned.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardYellow]}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={[styles.summaryAmount, styles.summaryAmountYellow]}>
                £{pendingAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Tier badge */}
          <View style={[styles.tierCard, { backgroundColor: tierStyle.bg }]}>
            <Text style={styles.tierEmoji}>{tierStyle.emoji}</Text>
            <View style={styles.tierInfo}>
              <Text style={[styles.tierName, { color: tierStyle.text }]}>
                {tier.charAt(0).toUpperCase() + tier.slice(1)} Carrier
              </Text>
              <Text style={[styles.tierThreshold, { color: tierStyle.text }]}>
                {TIER_THRESHOLDS[tier]} · {completedCount} completed
              </Text>
            </View>
          </View>

          <Text style={styles.historyTitle}>Delivery History</Text>
        </>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>✈️</Text>
          <Text style={styles.emptyTitle}>No deliveries yet</Text>
          <Text style={styles.emptySub}>Complete your first delivery to start earning.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle} numberOfLines={1}>
              Booking #{item.id.slice(0, 8)}
            </Text>
            <Text style={styles.deliveryAmount}>£{parseFloat(item.agreedPrice).toFixed(2)}</Text>
          </View>
          <Text style={styles.deliveryRoute}>
            Service fee: £{parseFloat(item.serviceFee).toFixed(2)} · Total: £{parseFloat(item.totalAmount).toFixed(2)}
          </Text>
          <View style={styles.deliveryFooter}>
            <Text style={styles.deliveryDate}>
              {item.deliveryVerifiedAt
                ? new Date(item.deliveryVerifiedAt).toLocaleDateString()
                : new Date(item.updatedAt).toLocaleDateString()}
            </Text>
            <View style={styles.statusPaid}>
              <Text style={styles.statusPaidText}>Delivered ✓</Text>
            </View>
          </View>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16, paddingBottom: 40 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 16 },
  summaryCardGreen: { backgroundColor: '#f0faf7' },
  summaryCardYellow: { backgroundColor: '#fffbeb' },
  summaryLabel: { fontSize: 13, color: '#666', marginBottom: 6 },
  summaryAmount: { fontSize: 26, fontWeight: '800', color: '#1D7A5F' },
  summaryAmountYellow: { color: '#d97706' },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  tierEmoji: { fontSize: 36 },
  tierInfo: { flex: 1 },
  tierName: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  tierThreshold: { fontSize: 13 },
  historyTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center' },
  deliveryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  deliveryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  deliveryTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', flex: 1, marginRight: 8 },
  deliveryAmount: { fontSize: 16, fontWeight: '700', color: '#1D7A5F' },
  deliveryRoute: { fontSize: 13, color: '#888', marginBottom: 8 },
  deliveryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deliveryDate: { fontSize: 12, color: '#aaa' },
  statusPaid: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: '#dcfce7' },
  statusPaidText: { fontSize: 12, fontWeight: '600', color: '#15803d' },
})
