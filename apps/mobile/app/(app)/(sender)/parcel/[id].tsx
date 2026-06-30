import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { trpc } from '../../../../lib/trpc'

const STATUS_STEPS = ['pending', 'booked', 'collected', 'in_transit', 'delivered']

const STATUS_LABELS: Record<string, string> = {
  pending:    'Pending',
  matched:    'Matched',
  booked:     'Booked',
  collected:  'Collected',
  in_transit: 'In Transit',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
}

export default function ParcelDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const { data: parcel, isLoading } = trpc.parcels.getById.useQuery({ id: id! })
  // Get the booking for this parcel (to show delivery OTP)
  const { data: bookings } = trpc.bookings.list.useQuery({})
  const booking = bookings?.find((b) => b.parcelId === id)

  const cancelParcel = trpc.parcels.cancel.useMutation({
    onSuccess: () => {
      Alert.alert('Cancelled', 'Your parcel listing has been cancelled.')
      router.back()
    },
    onError: (err: { message: string }) => Alert.alert('Error', err.message),
  })

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D7A5F" />
      </View>
    )
  }

  if (!parcel) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Parcel not found.</Text>
      </View>
    )
  }

  const currentStepIdx = STATUS_STEPS.indexOf(parcel.status)

  const handleCancel = () => {
    Alert.alert(
      'Cancel parcel?',
      'This will remove your parcel listing. This cannot be undone.',
      [
        { text: 'Keep it', style: 'cancel' },
        {
          text: 'Cancel parcel',
          style: 'destructive',
          onPress: () => cancelParcel.mutate({ id: parcel.id }),
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      {/* Status tracker */}
      <View style={styles.statusTracker}>
        {STATUS_STEPS.map((s, i) => (
          <View key={s} style={styles.statusStep}>
            <View style={[styles.statusDot, i <= currentStepIdx && styles.statusDotActive]}>
              {i < currentStepIdx ? (
                <Text style={styles.statusCheck}>✓</Text>
              ) : (
                <View style={[styles.statusInner, i === currentStepIdx && styles.statusInnerActive]} />
              )}
            </View>
            <Text style={[styles.statusLabel, i === currentStepIdx && styles.statusLabelActive]}>
              {STATUS_LABELS[s]}
            </Text>
          </View>
        ))}
      </View>

      {/* Item info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Details</Text>
        <InfoRow label="Contents" value={parcel.contents} />
        <InfoRow label="Weight" value={`${parcel.weightKg} kg`} />
        {parcel.notes ? <InfoRow label="Notes" value={parcel.notes} /> : null}
        <InfoRow label="Customs safe" value={parcel.isCustomsSafe ? 'Yes' : 'No'} />
      </View>

      {/* Route */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Route</Text>
        <InfoRow label="From" value={`${parcel.originCity} (${parcel.originCode})`} />
        <InfoRow label="To" value={`${parcel.destCity} (${parcel.destCode})`} />
        <InfoRow label="Recipient" value={parcel.recipientName} />
        <InfoRow label="Recipient phone" value={parcel.recipientPhone} />
        {parcel.recipientAddress ? (
          <InfoRow label="Recipient address" value={parcel.recipientAddress} />
        ) : null}
      </View>

      {/* Booking info */}
      {booking && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking</Text>
          <InfoRow label="Agreed price" value={`£${booking.agreedPrice}`} highlight />
          <InfoRow label="Service fee" value={`£${booking.serviceFee}`} />
          <InfoRow label="Total" value={`£${booking.totalAmount}`} />
          <InfoRow label="Status" value={STATUS_LABELS[booking.status] ?? booking.status} />
        </View>
      )}

      {/* Delivery OTP — shown when parcel is in_transit or collected */}
      {booking &&
        (parcel.status === 'in_transit' || parcel.status === 'collected') &&
        booking.deliveryOtp && (
          <View style={styles.otpCard}>
            <Text style={styles.otpLabel}>Delivery Code</Text>
            <Text style={styles.otpCode}>{booking.deliveryOtp}</Text>
            <Text style={styles.otpHint}>
              Share this code with the traveler only when they hand over your parcel.
            </Text>
          </View>
        )}

      {/* Cancel button */}
      {parcel.status === 'pending' && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={handleCancel}
          disabled={cancelParcel.isPending}
        >
          <Text style={styles.cancelBtnText}>Cancel Parcel</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  inner: { padding: 16, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: '#666' },
  statusTracker: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  statusStep: { flex: 1, alignItems: 'center' },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statusDotActive: { backgroundColor: '#1D7A5F' },
  statusInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ccc' },
  statusInnerActive: { backgroundColor: '#fff' },
  statusCheck: { color: '#fff', fontSize: 13, fontWeight: '700' },
  statusLabel: { fontSize: 9, color: '#aaa', textAlign: 'center' },
  statusLabelActive: { color: '#1D7A5F', fontWeight: '700' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoLabel: { fontSize: 13, color: '#888', flex: 1 },
  infoValue: { fontSize: 14, color: '#1a1a1a', fontWeight: '500', flex: 2, textAlign: 'right' },
  infoValueHighlight: { color: '#1D7A5F', fontWeight: '700', fontSize: 16 },
  otpCard: {
    backgroundColor: '#1D7A5F',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  otpLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8 },
  otpCode: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 8,
    marginBottom: 12,
  },
  otpHint: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelBtnText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
})
