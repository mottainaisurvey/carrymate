import { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { trpc } from '../../../../lib/trpc'

export default function CollectScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>()
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputs = useRef<(TextInput | null)[]>([])

  const { data: booking, isLoading } = trpc.bookings.getById.useQuery({ id: bookingId! })

  const confirmCollection = trpc.parcels.confirmPickupOTP.useMutation({
    onSuccess: () => {
      Alert.alert(
        'Parcel collected! ✅',
        'The sender has been notified. Safe travels!',
        [{ text: 'OK', onPress: () => router.replace('/(app)/dashboard') }]
      )
    },
    onError: (err: { message: string }) => Alert.alert('Invalid code', err.message),
  })

  const handleChange = (val: string, idx: number) => {
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
    if (!val && idx > 0) inputs.current[idx - 1]?.focus()
  }

  const handleConfirm = () => {
    const token = otp.join('')
    if (token.length < 6) {
      Alert.alert('Enter the 6-digit collection code')
      return
    }
    if (!booking) return
    confirmCollection.mutate({ parcelId: booking.parcelId, otp: token })
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D7A5F" />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>📦</Text>
        </View>
        <Text style={styles.heading}>Confirm Collection</Text>
        <Text style={styles.sub}>
          Ask the sender for their 6-digit collection code to confirm you've received the parcel.
        </Text>

        {booking && (
          <View style={styles.parcelCard}>
            <Text style={styles.parcelTitle}>Parcel ID: {booking.parcelId.slice(0, 8)}...</Text>
            <Text style={styles.parcelRoute}>Booking: {booking.status}</Text>
            <Text style={styles.parcelWeight}>Agreed: £{booking.agreedPrice}</Text>
          </View>
        )}

        <Text style={styles.otpLabel}>Enter collection code</Text>
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => (inputs.current[i] = r)}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(v) => handleChange(v, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btn, confirmCollection.isPending && styles.btnDisabled]}
          onPress={handleConfirm}
          disabled={confirmCollection.isPending}
        >
          {confirmCollection.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Confirm Collection</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 24, paddingTop: 32, alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0faf7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: { fontSize: 40 },
  heading: { fontSize: 24, fontWeight: '700', color: '#1a1a1a', marginBottom: 10, textAlign: 'center' },
  sub: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  parcelCard: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  parcelTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  parcelRoute: { fontSize: 13, color: '#666', marginBottom: 4 },
  parcelWeight: { fontSize: 13, color: '#888' },
  otpLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 14, alignSelf: 'flex-start' },
  otpRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  otpBox: {
    width: 46,
    height: 54,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  otpBoxFilled: { borderColor: '#1D7A5F', backgroundColor: '#f0faf7' },
  btn: {
    backgroundColor: '#1D7A5F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
