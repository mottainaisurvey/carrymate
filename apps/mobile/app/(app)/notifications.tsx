import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import { trpc } from '../../lib/trpc'

const NOTIF_ICONS: Record<string, string> = {
  booking: '📦',
  collection: '🤝',
  delivery: '🏠',
  payment: '💰',
  review: '⭐',
  kyc: '🪪',
  system: '📢',
}

export default function NotificationsScreen() {
  const { data, isLoading, refetch, isRefetching } = trpc.notifications.list.useQuery()
  const markRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => refetch(),
  })

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D7A5F" />
      </View>
    )
  }

  const notifications = data ?? []
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <View style={styles.topBar}>
          <Text style={styles.unreadText}>{unreadCount} unread</Text>
          <TouchableOpacity onPress={() => markRead.mutate()}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#1D7A5F" />
        }
        contentContainerStyle={notifications.length === 0 ? styles.emptyContainer : styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySub}>
              You'll be notified when there's activity on your parcels or trips.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, !item.read && styles.cardUnread]}>
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>
                {NOTIF_ICONS[item.type] ?? NOTIF_ICONS.system}
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
              <Text style={styles.time}>
                {new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadText: { fontSize: 13, color: '#888' },
  markAllText: { fontSize: 13, color: '#1D7A5F', fontWeight: '600' },
  listContent: { padding: 12, gap: 8 },
  emptyContainer: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardUnread: { backgroundColor: '#f0faf7' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 20 },
  content: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: '#1a1a1a', marginBottom: 3 },
  body: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 6 },
  time: { fontSize: 11, color: '#aaa' },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1D7A5F',
    marginTop: 4,
  },
})
