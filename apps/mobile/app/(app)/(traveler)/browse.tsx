import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { trpc } from '../../../lib/trpc'

export default function BrowseScreen() {
  const router = useRouter()
  // Fetch open parcels (no filter — shows all pending parcels)
  const { data, isLoading, refetch, isRefetching } = trpc.parcels.openParcels.useQuery({})
  // Get traveler's own trips to pick a tripId when accepting
  const { data: myTrips } = trpc.trips.list.useQuery({})

  const acceptParcel = trpc.bookings.create.useMutation({
    onSuccess: () => {
      Alert.alert('Accepted!', 'You have accepted this parcel. Collect it from the sender.')
      refetch()
    },
    onError: (err: { message: string }) => Alert.alert('Error', err.message),
  })

  const handleAccept = (parcelId: string, parcelContents: string, originCity: string, destCity: string) => {
    const openTrips = (myTrips ?? []).filter((t) => t.status === 'open')
    if (openTrips.length === 0) {
      Alert.alert(
        'No open trips',
        'You need to post a trip first before you can accept parcels.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Post a Trip', onPress: () => router.push('/(app)/(traveler)/post-trip') },
        ]
      )
      return
    }

    // If only one open trip, use it directly
    if (openTrips.length === 1) {
      Alert.alert(
        'Accept this parcel?',
        `You'll carry "${parcelContents}" from ${originCity} to ${destCity} on your trip.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Accept',
            onPress: () => acceptParcel.mutate({ parcelId, tripId: openTrips[0].id }),
          },
        ]
      )
      return
    }

    // Multiple trips — let user pick
    Alert.alert(
      'Select your trip',
      `Which trip will you carry "${parcelContents}" on?`,
      [
        ...openTrips.slice(0, 3).map((t) => ({
          text: `${t.originCity} → ${t.destCity} (${new Date(t.departureDate).toLocaleDateString()})`,
          onPress: () => acceptParcel.mutate({ parcelId, tripId: t.id }),
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ]
    )
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D7A5F" />
      </View>
    )
  }

  const parcels = data ?? []

  return (
    <View style={styles.container}>
      <FlatList
        data={parcels}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#1D7A5F" />
        }
        contentContainerStyle={parcels.length === 0 ? styles.emptyContainer : styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Available Parcels</Text>
            <Text style={styles.headerSub}>Find parcels to carry on your next trip</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No parcels available</Text>
            <Text style={styles.emptySub}>
              Check back soon — senders post new parcels regularly.
            </Text>
            <TouchableOpacity
              style={styles.postBtn}
              onPress={() => router.push('/(app)/(traveler)/post-trip')}
            >
              <Text style={styles.postBtnText}>Post a Trip</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.contents}</Text>
              <View style={styles.weightBadge}>
                <Text style={styles.weightText}>{item.weightKg} kg</Text>
              </View>
            </View>
            <Text style={styles.cardRoute}>
              {item.originCity} ({item.originCode}) → {item.destCity} ({item.destCode})
            </Text>
            <View style={styles.cardMeta}>
              <Text style={styles.metaItem}>📦 {item.weightKg} kg</Text>
              {item.notes ? <Text style={styles.metaItem} numberOfLines={1}>📝 {item.notes}</Text> : null}
              <Text style={styles.metaItem}>
                {item.isCustomsSafe ? '✅ Customs safe' : '⚠️ Check customs'}
              </Text>
            </View>
            <View style={styles.recipientRow}>
              <Text style={styles.recipientText}>
                👤 Recipient: {item.recipientName}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.acceptBtn, acceptParcel.isPending && styles.btnDisabled]}
              onPress={() => handleAccept(item.id, item.contents, item.originCity, item.destCity)}
              disabled={acceptParcel.isPending}
            >
              <Text style={styles.acceptBtnText}>Accept & Carry</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16, gap: 12 },
  emptyContainer: { flex: 1 },
  header: { marginBottom: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  headerSub: { fontSize: 13, color: '#888', marginTop: 2, marginBottom: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  postBtn: {
    backgroundColor: '#1D7A5F',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', flex: 1, marginRight: 8 },
  weightBadge: {
    backgroundColor: '#f0faf7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  weightText: { color: '#1D7A5F', fontWeight: '700', fontSize: 14 },
  cardRoute: { fontSize: 13, color: '#666', marginBottom: 10 },
  cardMeta: { flexDirection: 'row', gap: 12, marginBottom: 10, flexWrap: 'wrap' },
  metaItem: { fontSize: 13, color: '#555' },
  recipientRow: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    marginBottom: 12,
  },
  recipientText: { fontSize: 13, color: '#888' },
  acceptBtn: {
    backgroundColor: '#1D7A5F',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  acceptBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
})
