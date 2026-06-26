import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { trpc } from '../../../lib/trpc'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef9c3', text: '#854d0e' },
  matched: { bg: '#dbeafe', text: '#1e40af' },
  collected: { bg: '#e0f2fe', text: '#0369a1' },
  in_transit: { bg: '#f0fdf4', text: '#166534' },
  delivered: { bg: '#dcfce7', text: '#15803d' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  matched: 'Matched',
  collected: 'Collected',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function ParcelsScreen() {
  const router = useRouter()
  const { data, isLoading, refetch, isRefetching } = trpc.parcels.list.useQuery({})

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
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>No parcels yet</Text>
            <Text style={styles.emptySub}>Post your first parcel to get started.</Text>
            <TouchableOpacity
              style={styles.postBtn}
              onPress={() => router.push('/(app)/(sender)/post-parcel')}
            >
              <Text style={styles.postBtnText}>Post a Parcel</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const status = STATUS_COLORS[item.status] ?? STATUS_COLORS.pending
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: '/(app)/(sender)/parcel/[id]', params: { id: item.id } })}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.contents}</Text>
                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeText, { color: status.text }]}>
                    {STATUS_LABELS[item.status] ?? item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardRoute}>
                {item.originCity} ({item.originCode}) → {item.destCity} ({item.destCode})
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardWeight}>{item.weightKg} kg</Text>
                <Text style={styles.cardPrice}>👤 {item.recipientName}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
        ListHeaderComponent={
          parcels.length > 0 ? (
            <TouchableOpacity
              style={styles.newBtn}
              onPress={() => router.push('/(app)/(sender)/post-parcel')}
            >
              <Text style={styles.newBtnText}>+ Post New Parcel</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16, gap: 12 },
  emptyContainer: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 28 },
  postBtn: {
    backgroundColor: '#1D7A5F',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  newBtn: {
    backgroundColor: '#1D7A5F',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 12,
  },
  newBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
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
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  cardRoute: { fontSize: 13, color: '#666', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardWeight: { fontSize: 13, color: '#888' },
  cardPrice: { fontSize: 15, fontWeight: '700', color: '#1D7A5F' },
})
